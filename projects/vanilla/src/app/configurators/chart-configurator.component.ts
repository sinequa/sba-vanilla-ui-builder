import { Component, Input, OnChanges } from "@angular/core";
import { SearchService } from "@sinequa/components/search";
import { ConfiguratorContext, ComponentConfig } from "@sinequa/ngx-ui-builder";

@Component({
    selector: 'sq-chart-configurator',
    template: `
<div class="form-group">
    <label for="title">Title <span *ngIf="config.title!.startsWith('msg#')">("{{config.title | sqMessage}}")</span></label>
    <input type="text" class="form-control mb-2" id="title" autocomplete="off" spellcheck="off" [(ngModel)]="config.title" (ngModelChangeDebounced)="configChanged()">

    <sq-icon-selector class="d-block mb-2" [config]="config" (configChanged)="configChanged()"></sq-icon-selector>

    <sq-checkbox [context]="context" property="collapsible" label="Collapsible"></sq-checkbox>

    <label for="aggregation">Aggregation</label>
    <select id="aggregation" class="form-select mb-2" [(ngModel)]="config.aggregation" (ngModelChange)="configChanged()">
        <option *ngFor="let a of aggregations" [ngValue]="a">{{a}}</option>
    </select>

    <label>Aggregations available to users</label>
    <sq-select-multi
      [options]="aggregations"
      [(ngModel)]="config.aggregations"
      (ngModelChange)="configChanged()">
    </sq-select-multi>

    <label for="type">Chart Type</label>
    <select id="type" class="form-select mb-2" [(ngModel)]="config.chartType" (ngModelChange)="configChanged()">
        <option *ngFor="let chartType of chartTypes" [ngValue]="chartType.type">{{chartType.display}}</option>
    </select>

    <label>Chart Types available to users</label>
    <sq-select-multi
      [options]="chartTypes"
      displayField="display"
      [compareWith]="compareChartTypes"
      [(ngModel)]="config.chartTypes"
      (ngModelChange)="configChanged()">
    </sq-select-multi>

    <sq-color-picker [context]="context" property="defaultColor" label="Default color"></sq-color-picker>
    <sq-color-picker [context]="context" property="filteredColor" label="Filtered color"></sq-color-picker>
    <sq-color-picker [context]="context" property="selectedColor" label="Selected color"></sq-color-picker>

</div>
`
})
export class ChartConfiguratorComponent implements OnChanges {
    @Input() context: ConfiguratorContext;

    @Input()
    chartTypes: {type: string, display: string}[] = [
      {type: 'Column2D', display: 'Columns 2D'},
      {type: 'Bar2D', display: 'Bars 2D'},
      {type: 'Pie2D', display: 'Pie 2D'},
      {type: 'Column3D', display: 'Columns 3D'},
      {type: 'Bar3D', display: 'Bars 3D'},
      {type: 'Pie3D', display: 'Pie 3D'}
    ];

    get config(): ComponentConfig {
        return this.context.config;
    }

    aggregations: string[];

    constructor(
        public searchService: SearchService
    ){}

    ngOnChanges(): void {
        // Initialize the config (when a new facet is created)
        if(!this.config.aggregation) {
            this.config.title = "Chart";
            this.config.icon = "fas fa-chart-bar";
            this.config.aggregation = "Company";
            this.config.aggregations = [];
            this.config.classes = "mb-3";
            this.config.chartType = "Column2D";
            this.config.chartTypes = [];
            this.config.filteredColor = "#C3E6CB";
            this.config.selectedColor = "#8186d4";
        }
        // Update the list of available aggregations
        this.aggregations = this.searchService.results?.aggregations
            .filter(agg => !agg.isTree)
            .map(agg => agg.name) || [];
    }

    configChanged() {
        this.context.configChanged();
    }

    compareChartTypes(a: {type: string, display: string}, b: {type: string, display: string}){
      return a.type === b.type;
    }

}
