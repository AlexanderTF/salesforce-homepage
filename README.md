# Salesforce Custom Homepage Components

In this project we created 3 homepage components:
- Dynamic Donut Chart of opportunity pipeline using Scalable Vector Graphics (SVG)
- Modal window for quick record creation
- Greeting banner
  
![HomePage Components](https://github.com/AlexanderTF/salesforce-homepage/blob/main/images/Salesforce%20homepage%20Screenshot.png)

## SVG Donut Chart - Opportunity Pipeline

The pipeline shows the percentage of 'In Progress', 'Closed-Won' and 'Closed-Lost' Opportunities of the current user by Amount.

### 1) Retrieving the Opportunities

We use an Apex Controller [***OpportunityController.cls***](https://github.com/AlexanderTF/salesforce-homepage/blob/main/force-app/main/default/classes/OpportunityController.cls) to query the logged user's opportunities:
```apex
List<Opportunity> allUsersOpportunities = [SELECT Id, StageName, Amount FROM Opportunity WHERE OwnerId = :currentUserId];
```
and sum up their dollar amounts into three main categories *(Closed-Won, Closed-Lost, In Progress)*:
```apex
for (Opportunity opp: allUsersOpportunities)
{
    String stage = opp.StageName;
    Decimal amount = opp.Amount;

    if (stage == 'Closed Won'){
        stageAmounts.put('Closed Won',stageAmounts.get('Closed Won')+amount);
    } else if (stage == 'Closed Lost'){
        stageAmounts.put('Closed Lost',stageAmounts.get('Closed Lost')+amount);
    } else {
        stageAmounts.put('In Process',stageAmounts.get('In Process')+amount);
    }
}
```
The controller returns a Map<String, Decimal> named **stageAmounts** that will be used for designing our dynamic SVG in javascript.

### 2) Designing the SVG Donut Chart

To use the data from our Apex Controller in our Javascript file [***dynamicDonutChart.js***](https://github.com/AlexanderTF/salesforce-homepage/blob/main/force-app/main/default/lwc/dynamicDonutChart/dynamicDonutChart.js), we use the @wire decorator:
```apex
    @wire(getOpportunityStageAmounts)
    wiredStageCounts({ error, data }) {
        if (data) {
            this.stageCounts = data;
            this.totalOpportunities = Object.values(data).reduce((acc, value) => acc + value, 0);
            this.createDonutData();
            this.formatNumber(this.totalOpportunities);
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.stageCounts = undefined;
        }
    }
```
We then designed the Donut Chart with the help of some trigonometry. I used the following article to help me understand how to create an SVG using the *\<path\>* tag:
[Medium - How to create an interactive Donut Chart using SVG](https://medium.com/@theAngularGuy/how-to-create-an-interactive-donut-chart-using-svg-107cbf0b5b6)

The ***createDonutData()*** method will return a string containing the format for the \<path\> tag and will be used in the [***dynamicDonuctChart.html***](https://github.com/AlexanderTF/salesforce-homepage/blob/main/force-app/main/default/lwc/dynamicDonutChart/dynamicDonutChart.html) file:
```html
<svg width="150" height="150">
  <path d={stagePending} fill="#0D9DDA"/>
  <path d={stageClosedWon} fill="#06A59A"/>
  <path d={stageClosedLost} fill="#FE5C4C"/>
</svg>
```

## Record Creation Modal

A component has been added to quickly create records from the Homepage. Users can click on 4 different buttons to decide which type of records they want to create (Accounts, Opportunities, Leads and Contacts) and a modal window that contains a form will appear in the middle of the screen:
<p align="center">
  <img src="images/salesforce homepage modal screenshot.png" width="450" title="Modal example to create a new contact">
</p>

### 1) Determining the SObject being created
To determine which button has been pressed, we utilise the target ***'title'*** from the *\<button\>* tag:
```javascript
openModal(event) {
    const type = event.target.title;

    this.isCreatingAccount = type === 'Create Account';
    this.isCreatingOpportunity = type === 'Create Opportunity';
    this.isCreatingContact = type === 'Create Contact';
    this.isCreatingLead = type === 'Create Lead';

    this.isModalOpen = true;
}
```

### 2) Closing the Modal
If the user wants to close the modal, we create another method to update the conditional HTML rendering:
```javascript
closeModal(event){
    this.isCreatingAccount = false;
    this.isCreatingOpportunity = false;
    this.isCreatingContact = false;
    this.isModalOpen = false
}
```

### 3) Creating the form
We use the *\<lightning-record-form\>* to quickly create a standard form and push the information to the database:
```html
<template if:true={isCreatingAccount}>
    <lightning-record-form
        object-api-name="Account"
        mode="edit"
        onsuccess={handleSuccess}
        onerror={handleError}
        fields={accountFields}
    >
    </lightning-record-form>
</template>
```

## Greeting Banner
To create the greeting banner, we use the Brand Band component *"slds-brand-band"* from the Lightning Design System.
```HTML
<div class="slds-brand-band slds-brand-band_small slds-brand-band_group">
```
To retrieve the current user's name, we use the @wire decorator:
```javascript
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
```
If you want to change the banner's or Salesforce theme, go to:
Setup > Quick Find "Themes and Branding" > Choose your desired theme

## Feedback & Issue
Your feedback is invaluable! Please open an issue if you have suggestions, encounter bugs, or need assistance.
