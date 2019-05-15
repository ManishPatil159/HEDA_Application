import { LightningElement, track, api } from 'lwc';
import getSearchResults from '@salesforce/apex/CustomLookupController.getSearchResults';


export default class CustomLookup extends LightningElement {
    @track queryTerm;
    @track responseList;
    @track error;
    @api selectedRecord = {};
    @api objectApiName;
    @api objectIcon;
    @api nameField;
    @api whereClause;
    initialRender = true;

    handleKeyUp(evt) {
        // const isEnterKey = evt.keyCode === 13;
        // if (isEnterKey) {
        // if (evt.target.value && evt.target.value.length > 2) {
        this.queryTerm = evt.target.value;
        // @wire(getSearchResults, { searchQuery: this.queryTerm, objectName: 'Account' }) response;
        //getSearchResults({ searchQuery: this.queryTerm, objectName: 'Account' }).then(result => {
        if (this.queryTerm && this.queryTerm.length > 0) {
            getSearchResults({
                    searchQuery: this.queryTerm,
                    objectName: this.objectApiName,
                    nameField: this.nameField,
                    whereClause: this.whereClause
                        //whereClause: 'RecordType.Name = \'Academic Program\''
                }).then(result => {
                    if (result && result.length > 0) {
                        this.responseList = result;

                        let openSectionElem = this.template.querySelector('[id^="set-open-section"]');
                        openSectionElem.classList.add("slds-is-open");
                        //temp.addClass('slds-is-open');
                    } else {
                        let openSectionElem = this.template.querySelector('[id^="set-open-section"]');
                        openSectionElem.classList.remove("slds-is-open");
                        this.responseList = [];
                        this.selectedRecord = {};
                        //this.queryTerm = "";
                    }

                })
                .catch(error => {
                    this.error = error;
                });
        } else {
            let openSectionElem = this.template.querySelector('[id^="set-open-section"]');
            openSectionElem.classList.remove("slds-is-open");
            this.responseList = [];
            this.selectedRecord = {};
        }
        //}
    }

    itemSelected(elem) {
        let selectedId = elem.currentTarget.getAttribute("data-item");
        if (selectedId) {
            let selectedRec = this.responseList.filter(function(i) { return i.Id === selectedId; });
            if (selectedRec && selectedRec.length > 0) {
                this.selectedRecord = selectedRec[0];
                this.queryTerm = selectedRec[0].Name;
                let openSectionElem = this.template.querySelector('[id^="set-open-section"]');
                openSectionElem.classList.remove("slds-is-open");

                const selectedEvent = new CustomEvent('lookup-updated', { selectedObject: this.selectedRecord, apiName: this.objectApiName });
                // Dispatches the event.
                this.dispatchEvent(selectedEvent);

            }
        }
    }

    renderedCallback() {
        let thisObj = this;

        // if (this.initialRender) {
        //     let txtSearch = this.template.querySelector("[id^='cutstomlookup-list']");
        //     
        //     txtSearch.addEventListener("focusout", function(elem) {
        //         console.log('lost focus', elem);
        //         let openSectionElem = thisObj.template.querySelector('[id^="set-open-section"]');
        //         if (openSectionElem) {
        //             openSectionElem.classList.remove("slds-is-open");
        //             thisObj.queryTerm = '';
        //         }
        //     });
        //     this.initialRender = false;
        // }

        // let lookupItemArr = this.template.querySelectorAll(".custom-lookup-listitem");
        // if (lookupItemArr && lookupItemArr.length > 0) {
        //     let thisObj = this;
        //     lookupItemArr.forEach(function(lookupItem) {
        //         lookupItem.addEventListener("click", function(elem) {
        //             let selectedId = elem.currentTarget.getAttribute("data-item");
        //             if (selectedId) {
        //                 let selectedRec = this.responseList.filter(function(i) { return i.Id === selectedId; });
        //                 if (selectedRec && selectedRec.length > 0) {
        //                     thisObj.selectedRecord = selectedRec[0];
        //                     thisObj.queryTerm = selectedRec[0].Name;
        //                     let openSectionElem = thisObj.template.querySelector('[id^="set-open-section"]');
        //                     openSectionElem.classList.remove("slds-is-open");

        //                     const selectedEvent = new CustomEvent('lookup-updated', { selectedObject: this.selectedRecord, apiName: this.objectApiName });
        //                     // Dispatches the event.
        //                     thisObj.dispatchEvent(selectedEvent);

        //                 }
        //             }
        //         });
        //     });
        // }

    }
}