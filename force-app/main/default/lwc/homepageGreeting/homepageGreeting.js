import { LightningElement,wire,track} from 'lwc';
import {getRecord} from 'lightning/uiRecordApi';
import USER_ID from '@salesforce/user/Id';
import NAME_FIELD from '@salesforce/schema/User.FirstName';

export default class HomepageGreeting extends LightningElement {
    @track error;
    @track name;
   
    @wire(getRecord, {recordId: USER_ID, fields: [NAME_FIELD]}) 
    wiredUser({ error, data }) {
        if (data) {
            this.name = data.fields.FirstName.value.toUpperCase();
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.name = undefined;
        }
    }
}