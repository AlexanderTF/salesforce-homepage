import { LightningElement,track,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import NAME_FIELD from '@salesforce/schema/Account.Name';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
import WEBSITE_FIELD from '@salesforce/schema/Account.Website';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import OPPORTUNITY_NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import OPPORTUNITY_STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';
import OPPORTUNITY_CLOSE_DATE_FIELD from '@salesforce/schema/Opportunity.CloseDate';
import OPPORTUNITY_AMOUNT_FIELD from '@salesforce/schema/Opportunity.Amount';
import CONTACT_NAME_FIELD from '@salesforce/schema/Contact.Name'
import CONTACT_ACCTID_FIELD from '@salesforce/schema/Contact.AccountId'
import CONTACT_EMAIL_FIELD from '@salesforce/schema/Contact.Email'
import LEAD_NAME from '@salesforce/schema/Lead.Name'
import LEAD_COMPANY from '@salesforce/schema/Lead.Company'
import LEAD_STATUS from '@salesforce/schema/Lead.Status'

export default class RecordCreationShortcut extends LightningElement {
    // Modal
    @track isModalOpen = false;
    @track isCreatingAccount = false;
    @track isCreatingOpportunity = false;
    @track isCreatingContact = false;
    @track isCreatingLead = false;

    // Form
    accountFields = [
        NAME_FIELD,
        PHONE_FIELD,
        WEBSITE_FIELD,
        INDUSTRY_FIELD,
    ];

    opportunityFields = [
        OPPORTUNITY_NAME_FIELD,
        OPPORTUNITY_STAGE_FIELD,
        OPPORTUNITY_CLOSE_DATE_FIELD,
        OPPORTUNITY_AMOUNT_FIELD
    ];

    contactFields = [
        CONTACT_NAME_FIELD,
        CONTACT_EMAIL_FIELD,
        CONTACT_ACCTID_FIELD
    ]

    leadFields = [
        LEAD_NAME,
        LEAD_COMPANY,
        LEAD_STATUS
    ]

    openModal(event) {
        const type = event.target.title;
    
        this.isCreatingAccount = type === 'Create Account';
        this.isCreatingOpportunity = type === 'Create Opportunity';
        this.isCreatingContact = type === 'Create Contact';
        this.isCreatingLead = type === 'Create Lead';
    
        this.isModalOpen = true;
    }
    
    closeModal(event){
        this.isCreatingAccount = false;
        this.isCreatingOpportunity = false;
        this.isCreatingContact = false;
        this.isModalOpen = false
    }

    handleSuccess(event) {
        const newRecordId = event.detail.id;

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: `Record created with ID: ${newRecordId}`,
                variant: 'success',
            })
        );

        this.closeModal(); // Close modal after successful creation
    }

    handleError(event) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error creating record',
                message: event.detail.message,
                variant: 'error',
            })
        );
    }
}