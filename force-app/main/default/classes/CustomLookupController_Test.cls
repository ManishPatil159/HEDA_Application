@isTest
public with sharing class CustomLookupController_Test {

    @TestSetup
    static void makeData(){
        List<Account> lstAccount = new List<Account>();
        lstAccount.add(new Account(Name='John Smith'));
        lstAccount.add(new Account(Name='Smith Jones'));
        lstAccount.add(new Account(Name='Smith Davies'));
        lstAccount.add(new Account(Name='John Doe'));
        lstAccount.add(new Account(Name='Carla Jones'));
        insert lstAccount;
    }

    @IsTest
    static void validateEmptyInput() {
        List<Account> lstAccounts = [SELECT Name FROM Account];
        System.assertEquals(5, lstAccounts.size(), 'Account size mismatch');

        Test.startTest();
        //(String searchQuery, String objectName, String nameField, String whereClause)
        List<Account> returnedAccountLst = CustomLookupController.getSearchResults('', 'Account', 'Name', '');
        Test.stopTest();
        System.assertEquals(0, returnedAccountLst.size(), 'Accounts returned for empty string');
    }

    @IsTest
    static void validateAccountSearch(){
        Test.startTest();
        List<Account> returnedAccountLst = CustomLookupController.getSearchResults('John', 'Account', 'Name', '');
        Test.stopTest();
        System.assertEquals(2, returnedAccountLst.size(), 'Accounts returned for valid search string');
        for (Account accObj : returnedAccountLst) {
            System.assert(accObj.Name.startsWithIgnoreCase('John'), 'Account Names match');    
        }
    }

    @IsTest
    static void validateNonExistentValue(){
        Test.startTest();
        List<Account> returnedAccountLst = CustomLookupController.getSearchResults('Max', 'Account', 'Name', '');
        Test.stopTest();
        System.assertEquals(0, returnedAccountLst.size(), 'Accounts returned for non existent search string');
    }
}
