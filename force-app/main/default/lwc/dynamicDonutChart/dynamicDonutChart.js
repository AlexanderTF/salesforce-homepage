import { LightningElement, wire } from 'lwc';
import getOpportunityStageAmounts from '@salesforce/apex/OpportunityController.getOpportunityStageAmounts';

export default class MyComponent extends LightningElement {
    radius = 74;
    svgSize = 150;

    stageCounts;
    totalOpportunities;
    error;

    stageClosedWon;
    stageClosedLost;
    stagePending;

    totalAmountFormat;

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

    createDonutData(){
        let startAngle = 0;
        let endAngle = 0;

        for (let stage in this.stageCounts) {
            const count = this.stageCounts[stage];
            const percentage = this.getPercentage(count, this.totalOpportunities);
            endAngle = startAngle + percentage;

            const startCoord = this.getCoordFromDegrees(startAngle, this.radius, this.svgSize);
            const endCoord = this.getCoordFromDegrees(endAngle, this.radius, this.svgSize);

            const innerStartCoord = this.getCoordFromDegrees(endAngle, this.radius - 10, this.svgSize);
            const innerEndCoord = this.getCoordFromDegrees(startAngle, this.radius - 10, this.svgSize);

            const largeArcFlag = (endAngle - startAngle) > 180 ? 1 : 0;

            if (stage === 'Closed Won') {
                this.stageClosedWon = this.createPathData(startCoord, endCoord, largeArcFlag, innerStartCoord, innerEndCoord);
            }
            else if (stage === 'Closed Lost') {
                this.stageClosedLost = this.createPathData(startCoord, endCoord, largeArcFlag, innerStartCoord, innerEndCoord);
            }
            else {
                this.stagePending = this.createPathData(startCoord, endCoord, largeArcFlag, innerStartCoord, innerEndCoord);
            }

            startAngle = endAngle;
        }   
    }

    createPathData(startCoord, endCoord, largeArcFlag, innerStartCoord, innerEndCoord) {
        return `M ${startCoord[0]} ${startCoord[1]} 
                A ${this.radius} ${this.radius} 0 ${largeArcFlag} 0 ${endCoord[0]} ${endCoord[1]}
                L ${innerStartCoord[0]} ${innerStartCoord[1]}
                A ${this.radius - 10} ${this.radius - 10} 0 ${largeArcFlag} 1 ${innerEndCoord[0]} ${innerEndCoord[1]}`;
    }

    // Function to get coordinates from degrees
    getCoordFromDegrees(angle, radius, svgSize) {
        const x = Math.cos(angle * Math.PI / 180);
        const y = Math.sin(angle * Math.PI / 180);
        const coordX = x * radius + svgSize / 2;
        const coordY = y * -radius + svgSize / 2;
        return [coordX, coordY];
    }

    getPercentage(numOppInStage,numOfOpp) {
        return ((numOppInStage * 360) / numOfOpp);
    }

    // Utility function to format numbers into 'k', 'M', etc.
    formatNumber(value) {
        if (value >= 1_000_000) {
            this.totalAmountFormat = `$${(value / 1_000_000).toFixed(1)}M`;
        } else if (value >= 1_000) {
            this.totalAmountFormat = `$${(value / 1_000).toFixed(1)}k`;
        } else {
            this.totalAmountFormat = `$${value.toString()}`;
        }
    }
}


 
