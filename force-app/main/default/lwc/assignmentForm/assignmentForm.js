import { LightningElement ,track,api,wire} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import updateCreateAssigmentRecord from '@salesforce/apex/assignmentClass.updateCreateAssigmentRecord';
import {NavigationMixin } from 'lightning/navigation';
export default class AssignmentForm extends NavigationMixin(LightningElement) {
    @track fieldValues;
    @track response;
  
    handleSubmit(event) {
        this.fieldValues = event.detail.fields;
        event.preventDefault();
        if(this.fieldValues.Title__c !='' && this.fieldValues.Due_Date__c !='' && this.fieldValues.Status__c !=''){
            this.handleRecords();
        }
       
        
    }
   
    ShowToast(title, message, variant, mode){
        const evt = new ShowToastEvent({
                title: title,
                message:message,
                variant: variant,
                mode: mode
            });
            this.dispatchEvent(evt);
    }
    handleRecords(){
        updateCreateAssigmentRecord({record:{
            title : this.fieldValues.Title__c ?this.fieldValues.Title__c:'',
            description : this.fieldValues.Description__c ?this.fieldValues.Description__c:'',
            dueDate : this.fieldValues.Due_Date__c ?this.fieldValues.Due_Date__c:'',
            status : this.fieldValues.Status__c ?this.fieldValues.Status__c:'',
        }}).then(result =>{
          
            
            this.ShowToast('Success', result, 'success', 'dismissable');

        }).catch(error =>{
            this.ShowToast('Error', 'An Error Occured!!', 'error', 'dismissable');
        })
    }
  
}