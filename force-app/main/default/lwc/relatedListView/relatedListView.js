import { LightningElement, track, api, wire } from 'lwc';
import getRelatedList from '@salesforce/apex/RelatedListDisplayController.getRelatedList';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';


export default class RelatedListView extends LightningElement {
    @track activeSections = ['A'];
    @track activeSectionsMessage = '';

    @api objectApiName;
    @api parentId;
    @api fieldNames;
    @api parentFieldName;
    @api childObjectName;

    @track programPlanList;
    fieldListArr = (this.fieldNames && this.fieldNames.length > 0) ? this.fieldNames.split(',') : ['Id'];


    @wire(CurrentPageReference) pageRef;

    //@wire(getRelatedList, { parentId: '$parentId', fieldNames: 'Id', parentField: 'hed__Account__c', objAPIName: 'hed__Program_Plan__c' }) programPlanList;
    @wire(getRelatedList, { parentId: '$parentId', fieldNames: '$fieldNames', parentField: '$parentFieldName', objAPIName: '$objectApiName' }) programPlanList;

    get programPlanIds() {
        return ((this.programPlanList && this.programPlanList.data)) ? this.programPlanList.data : [];
    }

    handleSectionToggle(event) {
        const openSections = event.detail.openSections;

        // @wire(getSearchResults, { searchQuery: this.queryTerm, objectName: 'Account' }) response;

        if (openSections.length === 0) {
            this.activeSectionsMessage = 'All sections are closed';
        } else {
            this.activeSectionsMessage =
                'Open sections: ' + openSections.join(', ');
        }
    }

    getRelevantData(param) {
        if (param && param.selectedObject) {
            this.parentId = param.selectedObject.Id;
        }
    }

    connectedCallback() {
        console.log("fieldListArr:: ", this.fieldListArr);
        registerListener('lookup-updated', this.getRelevantData, this);
    }
}