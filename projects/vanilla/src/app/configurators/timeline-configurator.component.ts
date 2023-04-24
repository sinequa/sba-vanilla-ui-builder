import { Component, Input, OnChanges } from "@angular/core";
import { SearchService } from "@sinequa/components/search";
import { ConfiguratorContext, ComponentConfig } from "@sinequa/ngx-ui-builder";

@Component({
  selector: 'sq-timeline-configurator',
  template: `
<div class="form-group">
  <h6>Header</h6>
  <sq-facet-header-configurator [context]="context"></sq-facet-header-configurator>
  <hr />

  <h6>Timeline configuration</h6>
  <label for="aggregation">Aggregation</label>
  <select id="aggregation" class="form-select mb-2" [(ngModel)]="config.timeseries[0].aggregation" (ngModelChange)="configChanged()">
    <option *ngFor="let a of aggregations" [ngValue]="a">{{a}}</option>
  </select>

  <uib-checkbox [context]="context" property="timeseries.0.showDatapoints" label="Show datapoints"></uib-checkbox>

  <uib-color-picker [context]="context" property="timeseries.0.lineStyles.stroke" label="Line color"></uib-color-picker>
  <uib-color-picker [context]="context" property="timeseries.0.areaStyles.fill" label="Area color"></uib-color-picker>

  <uib-checkbox [context]="context" property="showRecords" label="Show documents/records on the X axis"></uib-checkbox>
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
  ) { }

  ngOnChanges(): void {
    // Initialize the config (when a new facet is created)
    if (!this.config.timeseries) {
      this.config.title = "Timeline";
      this.config.icon = "fas fa-chart-line";
      this.config.timeseries = [{
        name: 'dates',
        aggregation: 'Timeline',
        primary: true,
        lineStyles: { stroke: 'lightBlue' },
        areaStyles: { fill: 'lightBlue' },
        showDatapoints: true
      }];
      this.config.showRecords = true;
      this.config.classes = "mb-3";
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
