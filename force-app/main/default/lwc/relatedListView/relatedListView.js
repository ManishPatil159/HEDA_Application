import { LightningElement, track, api } from 'lwc';

export default class RelatedListView extends LightningElement {
    @track activeSections = ['A'];
    @track activeSectionsMessage = '';

    @api objectApiName;
    @api parentId;
    @api fieldNames;
    @api parentFieldName;

    handleSectionToggle(event) {
        const openSections = event.detail.openSections;

        if (openSections.length === 0) {
            this.activeSectionsMessage = 'All sections are closed';
        } else {
            this.activeSectionsMessage =
                'Open sections: ' + openSections.join(', ');
        }
    }
}