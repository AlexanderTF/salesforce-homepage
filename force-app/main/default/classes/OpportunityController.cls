public with sharing class OpportunityController {
    @AuraEnabled(cacheable=true)
    public static Map<String, Integer> getOpportunityStageCounts() {
        //Id currentUserId = UserInfo.getUserId();
        List<Opportunity> allUsersOpportunities = [SELECT Id, StageName FROM Opportunity];
        
        Map<String, Integer> stageCounts = new Map<String,Integer>{
            'In Process' => 0,
            'Closed Won' => 0,
            'Closed Lost' => 0
        };

        for (Opportunity opp: allUsersOpportunities){
            String stage = opp.StageName;

            if (stage == 'Closed Won'){
                stageCounts.put('Closed Won',stageCounts.get('Closed Won')+1);
            } else if (stage == 'Closed Lost'){
                stageCounts.put('Closed Lost',stageCounts.get('Closed Lost')+1);
            } else {
                stageCounts.put('In Process',stageCounts.get('In Process')+1);
            }
        }

        return stageCounts;
    }
}
