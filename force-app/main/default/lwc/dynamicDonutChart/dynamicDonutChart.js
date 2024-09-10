import { LightningElement, wire } from 'lwc';
import getOpportunityStageCounts from '@salesforce/apex/OpportunityController.getOpportunityStageCounts';

export default class MyComponent extends LightningElement {
    radius = 100;
    svgSize = 200;
    startAngle = 0;
    endAngle;

    stageCounts;
    error;

    

    @wire(getOpportunityStageCounts)
    wiredStageCounts({ error, data }) {
        if (data) {
            this.stageCounts = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.stageCounts = undefined;
        }
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

    // Function to create path data string
    get PathData() {
        // Outer graph's coordinates
        const startCoord = this.getCoordFromDegrees(this.startAngle, this.radius, this.svgSize);
        const endCoord = this.getCoordFromDegrees(this.endAngle, this.radius, this.svgSize);

        // Inner graph's coordinates
        const innerStartCoord = this.getCoordFromDegrees(this.endAngle, this.radius - 5, this.svgSize);
        const innerEndCoord = this.getCoordFromDegrees(this.startAngle, this.radius - 5, this.svgSize);

        const largeArcFlag = (this.endAngle - this.startAngle) > 180 ? 1 : 0;
        const sweepFlag = 1; // Draw the arc in the positive-angle direction (clockwise)

        // Construct the path data string
        return `M ${startCoord[0]} ${startCoord[1]} 
                A ${this.radius} ${this.radius} 0 ${largeArcFlag} 0 ${endCoord[0]} ${endCoord[1]}
                L ${innerStartCoord[0]} ${innerStartCoord[1]}
                A ${this.radius - 5} ${this.radius - 5} 0 ${largeArcFlag} ${sweepFlag} ${innerEndCoord[0]} ${innerEndCoord[1]}`;
    }

}


 
