@isTest
public class assignmentClassTest {
    static testMethod void getAssigmentRecordListTest(){
        Test.startTest();
        assignmentClass.getAssigmentRecordList();
        Test.StopTest();
    }
    static testMethod void updateCreateAssigmentRecordTest(){
        assignmentClass.AssignmentFields fields= new assignmentClass.AssignmentFields();  
        fields.title='test title';
        fields.status='Completed';
        
         assignmentClass.AssignmentFields fields2= new assignmentClass.AssignmentFields();  
        fields2.title='test title2';
        fields2.dueDate=system.today();
        fields2.status='Completed';
        Test.startTest();
        assignmentClass.updateCreateAssigmentRecord(fields);
         assignmentClass.updateCreateAssigmentRecord(fields2);

        Test.StopTest();
    }
    @testSetUp static void setUp(){
    Assignment__c assignObj = new Assignment__c();
            assignObj.Title__c = 'test title';
            assignObj.Description__c = 'test title description';
            assignObj.Due_Date__c = system.today();
            assignObj.Status__c = 'Not Started';
            insert assignObj;     
    }
    
}