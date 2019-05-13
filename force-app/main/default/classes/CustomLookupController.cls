public with sharing class CustomLookupController {
    public CustomLookupController() {

    }

    /**
     * getSearchResults returns the search results based on the string searched in the custom lookup
     * @param  searchQuery Search string entered in the custom lookup
     * @param  objectName  Object name (API name) on which the query is to be done.
     * @return             return list of searched results
     */
    @AuraEnabled(cacheable=true)
    public static List<SObject> getSearchResults(String searchQuery, String objectName, String nameField, String whereClause) {
        System.debug('searchQuery:::: '+searchQuery);
        String searchStr = searchQuery+'%';
        String query='SELECT '+ nameField +' FROM ' + objectName + ' WHERE Name LIKE \''+ searchStr+'\'';

        if(whereClause!=null && whereClause != '') {
            query+=' AND ' + whereClause;
        }
        System.debug('query:::: '+query);
        System.debug('query after escape:::: '+query);
        return Database.query(query);
    }
}
