import { LightningElement, api, wire, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

export default class RelatedListItem extends LightningElement {
    @api objectName;
    @api recordId;
    @api fieldList;
    // @api fields = [
    //     'hed__Program_Plan__c.Name',
    //     'hed__Program_Plan__c.Id',
    // ];
    @track programPlan;
    @track hasData = false;
    @track error;

    // @wire(getRecord, {
    //     recordId: '$recordId',
    //     fields: '$fields'
    // }) programPlan;


    @wire(getRecord, {
        recordId: '$recordId',
        fields: '$fieldList'
    })
    wiredRecord({ error, data }) {
        debugger;
        if (error) {
            this.error = 'Unknown error';
            if (Array.isArray(error.body)) {
                this.error = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                this.error = error.body.message;
            }
            this.record = undefined;
        } else if (data) {
            this.programPlan = data;
            this.hasData = true;
            // Process record data
        }
    }


    // @wire(getRecord, {
    //     recordId: '$recordId',
    //     fields: [
    //         'hed__Program_Plan__c.Name',
    //         'hed__Program_Plan__c.Id'
    //     ]
    // }) programPlan;

    get name() {
        return (this.programPlan && this.programPlan.fields) ? this.programPlan.fields.Name.value : 'empty';
    }
    get Id() {
        return (this.programPlan && this.programPlan.fields) ? this.programPlan.fields.Name.Id : '';
    }

    connectedCallback() {
        this.fieldList = [];
        this.fieldList.push(this.objectName + '.Name');
        this.fieldList.push(this.objectName + '.Id');
        console.log('fields:: ', this.fieldList);

    }
}