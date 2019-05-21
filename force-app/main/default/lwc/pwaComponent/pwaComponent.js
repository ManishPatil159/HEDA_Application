import { LightningElement } from 'lwc';

export default class PwaComponent extends LightningElement {
    connectedCallback() {
        const apiKey = '05bed8b641c84d6c933df9d4a71bfc59';
        const defaultSource = 'the-washington-post';
        const sourceSelector = this.template.querySelector('#sources');
        const newsArticles = this.template.querySelector('main');

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () =>
                navigator.serviceWorker.register('sw.js')
                .then(registration => console.log('Service Worker registered'))
                .catch(err => 'SW registration failed'));
        }

        window.addEventListener('load', e => {
            sourceSelector.addEventListener('change', evt => updateNews(evt.target.value));
            updateNewsSources().then(() => {
                sourceSelector.value = defaultSource;
                updateNews();
            });
        });

        window.addEventListener('online', () => updateNews(sourceSelector.value));

        async function updateNewsSources() {
            const response = await fetch(`https://newsapi.org/v2/sources?apiKey=${apiKey}`);
            const json = await response.json();
            sourceSelector.innerHTML =
                json.sources
                .map(source => `<option value="${source.id}">${source.name}</option>`)
                .join('\n');
        }

        async function updateNews(source = defaultSource) {
            newsArticles.innerHTML = '';
            const response = await fetch(`https://newsapi.org/v2/top-headlines?sources=${source}&sortBy=top&apiKey=${apiKey}`);
            const json = await response.json();
            newsArticles.innerHTML =
                json.articles.map(createArticle).join('\n');
        }

        function createArticle(article) {
            return `
        <div class="article">
          <a href="${article.url}">
            <h2>${article.title}</h2>
            <img src="${article.urlToImage}" alt="${article.title}">
            <p>${article.description}</p>
          </a>
        </div>
      `;
        }



        const cacheName = 'news-v1';
        const staticAssets = [
            './',
            './s',
            './s/*',
            // './',
            // './app.js',
            // './styles.css',
            // './fallback.json',
            // './images/fallback_image.jpg'
        ];

        self.addEventListener('install', async function() {
            const cache = await caches.open(cacheName);
            cache.addAll(staticAssets);
        });

        self.addEventListener('activate', event => {
            event.waitUntil(self.clients.claim());
        });

        self.addEventListener('fetch', event => {
            const request = event.request;
            const url = new URL(request.url);
            if (url.origin === location.origin) {
                event.respondWith(cacheFirst(request));
            } else {
                event.respondWith(networkFirst(request));
            }
        });

        async function cacheFirst(request) {
            const cachedResponse = await caches.match(request);
            return cachedResponse || fetch(request);
        }

        async function networkFirst(request) {
            const dynamicCache = await caches.open('news-dynamic');
            try {
                const networkResponse = await fetch(request);
                dynamicCache.put(request, networkResponse.clone());
                return networkResponse;
            } catch (err) {
                const cachedResponse = await dynamicCache.match(request);
                return cachedResponse || await caches.match('./fallback.json');
            }
        }
    }
}