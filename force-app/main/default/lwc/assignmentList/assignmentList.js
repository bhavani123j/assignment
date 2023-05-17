import { LightningElement , wire, api , track } from 'lwc';
import getAssigmentRecordList from '@salesforce/apex/assignmentClass.getAssigmentRecordList';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from "@salesforce/apex";

const COLUMNS = [
    {
        label: 'Title',
        fieldName: 'Title__c',
        type: 'text',
        editable: true,
        
        
    },
    {
        label: 'Description',
        fieldName: 'Description__c',
        type: 'text',
        editable: true,
        
    },
    {
        label: 'Due Date',
        fieldName: 'Due_Date__c',
        type: 'date',
        sortable: true,
        editable: true,
        
    },
    {
        label: 'Status',
        fieldName: 'Status__c',
        type: 'text',
        editable: true,
    },
]
export default class AssignmentList extends LightningElement {
    @track assignmentData=[];
    @track sortBy;
    columns = COLUMNS;
    @track sortDirection;
    @track pageSize = 5;
    @track records;
    @api recordId;
    totalRecords ; //Total no.of records
    totalPages; //Total no.of pages
    pageNumber = 1; //Page number  
    searchTitle;
    allData;
    saveDraftValues = [];
    event2;
    @api wiredDataRes;
    get disablePrev() {
        return this.pageNumber == 1;
    }
    get disableNext() {
        return this.pageNumber == this.totalPages;
    }
    
    @wire(getAssigmentRecordList,{})
    assignmentRecs(result){
        this.wiredDataRes = result;
        let {error,data} =result;
    if(data){
        this.records = data;
        this.allData = data;
        this.totalRecords = data.length;
       if(this.totalRecords > this.pageSize){
        this.pagination();
       }
        else{
            this.assignmentData = this.records;  
        }
    }
   
    }
    previousPage() {
        this.pageNumber = this.pageNumber - 1;
        this.pagination();
    }
    nextPage() {
        this.pageNumber = this.pageNumber + 1;
        if(this.totalRecords > this.pageSize){
            this.pagination();
           }
            else{
                this.assignmentData = this.records;  
            }
    }
    searchTitleChange(event){
        this.searchTitle = event.target.value;
        console.log('this.searchTitle ',this.searchTitle );
        if(this.searchTitle == null || this.searchTitle == ''){
            console.log('null title');
            this.records = this.allData;
            this.pagination();
        }
    }
    handleSearch(event){
       let filteredData = this.records.filter(rec => rec.Title__c.includes(this.searchTitle));
        this.records = filteredData;
       this.pagination();        
    }
    pagination() {
         this.assignmentData = [];
       
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
       
        if (this.pageNumber <= 1) {
            this.pageNumber = 1;
        } else if (this.pageNumber >= this.totalPages) {
            this.pageNumber = this.totalPages;
        }
        for (let i = (this.pageNumber - 1) * this.pageSize; i < this.pageNumber * this.pageSize; i++) {
            if (i === this.totalRecords) {
                break;
            }
            this.assignmentData.push(this.records[i]);
        }
    }
    handleSave(event) {
        this.saveDraftValues = event.detail.draftValues;
        const recordInputs = this.saveDraftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(resolve => {
            this.ShowToast('Success', 'Records Updated Successfully!', 'success', 'dismissable');
            this.saveDraftValues = [];  
            return refreshApex(this.wiredDataRes);
        }).catch(error => {
            this.ShowToast('Error', 'An Error Occured!!', 'error', 'dismissable');
        }).finally(() => {
            this.saveDraftValues = [];
        });
    }
    handleSortData(event) {       
        this.sortBy = event.detail.fieldName;       
        this.sortDirection = event.detail.sortDirection;       
        this.sortAccountData(event.detail.fieldName, event.detail.sortDirection);
      }
      sortAccountData(fieldname, direction) {
        try{
        let parseData = JSON.parse(JSON.stringify(this.assignmentData));
        let keyValue = (a) => {
                return a[fieldname];
            };
        let isReverse = direction === 'asc' ? 1: -1;
                parseData.sort((x, y) => {
                x = keyValue(x) ? keyValue(x) : ''; 
                y = keyValue(y) ? keyValue(y) : '';
                return isReverse * ((x > y) - (y > x));
            });
        this.assignmentData = parseData;
        }catch(error){
            console.log('error>>'+error);
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
    refreshTimeline(evt){
        const buttonIcon = evt.target.querySelector('.slds-button__icon');
        return refreshApex(this.wiredDataRes);
    }
   
}