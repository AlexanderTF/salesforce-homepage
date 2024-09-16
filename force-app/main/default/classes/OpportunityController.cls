public with sharing class OpportunityController {
    @AuraEnabled(cacheable=true)
    public static Map<String, Decimal> getOpportunityStageAmounts() {
        Id currentUserId = UserInfo.getUserId();
        List<Opportunity> allUsersOpportunities = [SELECT Id, StageName, Amount FROM Opportunity WHERE OwnerId = :currentUserId];
        
        Map<String, Decimal> stageAmounts = new Map<String,Decimal>{
            'In Process' => 0.0,
            'Closed Won' => 0.0,
            'Closed Lost' => 0.0
        };

        for (Opportunity opp: allUsersOpportunities){
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

        return stageAmounts;
    }
}
