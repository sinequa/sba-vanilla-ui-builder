import { Component, Input, OnChanges } from "@angular/core";
import { SearchService } from "@sinequa/components/search";
import { ConfiguratorContext, ComponentConfig } from "@sinequa/ngx-ui-builder";

@Component({
  selector: 'sq-chart-configurator',
  template: `
<div class="form-group">
  <h6>Header</h6>
  <sq-facet-header-configurator [context]="context"></sq-facet-header-configurator>
  <hr />

  <h6>{{context.context?.templates?.[config.type]?.display || config.type}}</h6>

  <label for="aggregation">Aggregation</label>
  <select id="aggregation" class="form-select mb-2" [(ngModel)]="config.aggregation" (ngModelChange)="configChanged()">
    <option *ngFor="let a of aggregations" [ngValue]="a">{{a}}</option>
  </select>

  <label>Aggregations available to users</label>
  <uib-multi-selector
    [options]="aggregations"
    [(ngModel)]="config.aggregations"
    (ngModelChange)="configChanged()">
  </uib-multi-selector>

  <label for="type">Chart Type</label>
  <select id="type" class="form-select mb-2" [(ngModel)]="config.chartType" (ngModelChange)="configChanged()">
      <option *ngFor="let chartType of chartTypes" [ngValue]="chartType.type">{{chartType.display}}</option>
  </select>

  <label>Chart Types available to users</label>
  <uib-multi-selector
    [options]="chartTypes"
    displayField="display"
    [compareWith]="compareChartTypes"
    [(ngModel)]="config.chartTypes"
    (ngModelChange)="configChanged()">
  </uib-multi-selector>

  <uib-color-picker [context]="context" property="defaultColor" label="Default color"></uib-color-picker>
  <uib-color-picker [context]="context" property="filteredColor" label="Filtered color"></uib-color-picker>
  <uib-color-picker [context]="context" property="selectedColor" label="Selected color"></uib-color-picker>
</div>
`
})
export class ChartConfiguratorComponent implements OnChanges {
  @Input() context: ConfiguratorContext;

  @Input()
  chartTypes: { type: string, display: string }[] = [
    { type: 'Column2D', display: 'Columns 2D' },
    { type: 'Bar2D', display: 'Bars 2D' },
    { type: 'Pie2D', display: 'Pie 2D' },
    { type: 'Column3D', display: 'Columns 3D' },
    { type: 'Bar3D', display: 'Bars 3D' },
    { type: 'Pie3D', display: 'Pie 3D' }
  ];

  get config(): ComponentConfig {
    return this.context.config;
  }

  aggregations: string[];

  constructor(
    public searchService: SearchService
  ) { }

  ngOnChanges(): void {
    // Initialize the config (when a new facet is created)
    if (!this.config.aggregation) {
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

  compareChartTypes(a: { type: string, display: string }, b: { type: string, display: string }) {
    return a.type === b.type;
  }

}
