public  class assignmentClass {
/****************************************************************
 * Method Name : getAssigmentRecordList
 * Description : This method is used to return the list of Assignment Records.
***************************************************************/
	 @AuraEnabled(cacheable=true)
    public static List<Assignment__c> getAssigmentRecordList(){
        List<Assignment__c> assigmentList = [Select Id,Title__c,Description__c,Due_Date__c,Status__c FROM Assignment__c];
        
        return assigmentList;
    }
    @AuraEnabled()
    public static  string updateCreateAssigmentRecord(AssignmentFields record){
        String response;
        List<Assignment__c> assigmentList = [Select Id,Title__c,Description__c,Due_Date__c,Status__c FROM Assignment__c 
                                             WHERE Title__c =: record.title LIMIT 1];
        if(assigmentList.size()!=0){
            
            Assignment__c assignObj = new Assignment__c(Id= assigmentList.get(0).Id);
            if(assigmentList.get(0).Description__c != record.description && record.description !=''){
                assignObj.Description__c = record.description;
            }
            if(assigmentList.get(0).Due_Date__c != record.dueDate && record.dueDate != Null){
                assignObj.Due_Date__c = record.dueDate;
            }
            if(assigmentList.get(0).Status__c != record.status && record.status !=''){
                assignObj.Status__c = record.status;
            }
            
            
            update assignObj;
            response = 'Records Updated Successfully';
        }
 		 else{
			Assignment__c assignObj = new Assignment__c();
            assignObj.Title__c = record.title;
            assignObj.Description__c = record.description;
            assignObj.Due_Date__c = record.dueDate;
            assignObj.Status__c = record.status;
            insert assignObj;
            response = 'Records Created Successfully';
        }
        return response;
    }
    
    public Class AssignmentFields{
        @AuraEnabled
        public String title {get; set;}
        @AuraEnabled
        public String description{get; set;}
        @AuraEnabled
        public Date dueDate{get; set;}
        @AuraEnabled
        public String status{get; set;}
    }
}