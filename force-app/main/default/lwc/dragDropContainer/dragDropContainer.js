/* eslint-disable no-new */
import { LightningElement } from 'lwc';
import { sortableFactory, sortableModule } from './Sortable';

export default class DragDropContainer extends LightningElement {

    

    renderedCallback() {
        let Sortable= new sortableFactory();
        console.log(sortableFactory);
        let el = this.template.querySelector(".draggable-items");
        let el1 = this.template.querySelector(".draggable-items1");

        

        new Sortable(el, {
            animation: 150,
            ghostClass: 'blue-background-class',
            group: 'dragGroup1'
        });
        new Sortable(el1, {
            animation: 150,
            ghostClass: 'blue-background-class',
            group: 'dragGroup1'
        });
        // sortableFactory().create(el,{
        //     animation: 150,
        //     ghostClass: 'blue-background-class',
        //     group:'dragGroup1'
        // });
        // sortableFactory().create(el1,{
        //     animation: 150,
        //     ghostClass: 'blue-background-class',
        //     group:'dragGroup1'
        // });
    }



}