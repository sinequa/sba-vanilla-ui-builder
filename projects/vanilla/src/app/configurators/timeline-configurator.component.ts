import { Component, Input, OnChanges } from "@angular/core";
import { SearchService } from "@sinequa/components/search";
import { ConfiguratorContext, ComponentConfig } from "@sinequa/ngx-ui-builder";

@Component({
    selector: 'sq-timeline-configurator',
    template: `
<div class="form-group">
    <label for="title">Title <span *ngIf="config.title!.startsWith('msg#')">("{{config.title | sqMessage}}")</span></label>
    <input type="text" class="form-control mb-2" id="title" autocomplete="off" spellcheck="off" [(ngModel)]="config.title" (ngModelChangeDebounced)="configChanged()">

    <sq-icon-selector class="d-block mb-2" [config]="config" (configChanged)="configChanged()"></sq-icon-selector>

    <sq-checkbox [context]="context" property="collapsible" label="Collapsible"></sq-checkbox>

    <label for="aggregation">Aggregation</label>
    <select id="aggregation" class="form-select mb-2" [(ngModel)]="config.timeseries[0].aggregation" (ngModelChange)="configChanged()">
        <option *ngFor="let a of aggregations" [ngValue]="a">{{a}}</option>
    </select>

    <sq-checkbox [context]="context" property="timeseries.0.showDatapoints" label="Show datapoints"></sq-checkbox>

    <sq-color-picker [context]="context" property="timeseries.0.lineStyles.stroke" label="Line color"></sq-color-picker>
    <sq-color-picker [context]="context" property="timeseries.0.areaStyles.fill" label="Area color"></sq-color-picker>

    <sq-checkbox [context]="context" property="showRecords" label="Show documents/records on the X axis"></sq-checkbox>

</div>
`
})
export class TimelineConfiguratorComponent implements OnChanges {
    @Input() context: ConfiguratorContext;

    get config(): ComponentConfig {
        return this.context.config;
    }

    aggregations: string[];

    constructor(
        public searchService: SearchService
    ){}

    ngOnChanges(): void {
        // Initialize the config (when a new facet is created)
        if(!this.config.timeseries) {
            this.config.title = "Timeline";
            this.config.icon = "fas fa-chart-line";
            this.config.timeseries = [{
                name: 'dates',
                aggregation: 'Timeline',
                primary: true,
                lineStyles: {stroke: 'lightBlue'},
                areaStyles: {fill: 'lightBlue'},
                showDatapoints: true
            }];
            this.config.showRecords = true;
        }
        // Update the list of available aggregations
        this.aggregations = this.searchService.results?.aggregations
            .filter(agg => !agg.isTree)
            .map(agg => agg.name) || [];
    }

    configChanged() {
        this.context.configChanged();
    }

}
