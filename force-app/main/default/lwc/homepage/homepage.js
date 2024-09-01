import { LightningElement } from 'lwc';

export default class CustomHomepage extends LightningElement {
    isModalOpen = false;
    objectApiName;
    modalTitle;

    handleNewAccount() {
        this.objectApiName = 'Account';
        this.modalTitle = 'Creaete New Account';
        this.isModalOpen = true;
    }

    handleNewContact() {
        this.objectApiName = 'Contact';
        this.modalTitle = 'Create New Contact';
        this.isModalOpen = true;
    }

    handleNewOpportunity() {
        this.objectApiName = 'Opportunity';
        this.modalTitle = 'Create New Opportunity';
        this.isModalOpen = true;
    }

    handleCloseModal() {
        this.isModalOpen = false;
    }
}
