public with sharing class RelatedListDisplayController {
    public RelatedListDisplayController() {

    }

    @AuraEnabled(cacheable=true)
    public static List<SObject> getRelatedList(Id parentId, String fieldNames, String parentField, String objAPIName) {
        //String query = 'SELECT ' + parentField + ' FROM ' + objAPIName + ' WHERE ' + parentField + '=' + parentId;
        String query ='SELECT  ' + fieldNames + ' FROM ' + objAPIName + ' WHERE ' + parentField + ' = \'' + parentId + '\'';
        return Database.query(query);
    }
}
