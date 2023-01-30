import { Component, Input, OnChanges } from "@angular/core";
import { SearchService } from "@sinequa/components/search";
import { ConfiguratorContext, ComponentConfig } from "@sinequa/ngx-ui-builder";

@Component({
  selector: 'sq-facet-configurator',
  template: `
<div class="form-group">
  <h6>Header</h6>
  <sq-facet-header-configurator [context]="context"></sq-facet-header-configurator>
  <hr />

  <h6>{{context.context?.templates?.[config.type]?.display || config.type}}</h6>

  <label for="title">Name</label>
  <input type="text" class="form-control mb-2" id="name" autocomplete="off" spellcheck="off" [(ngModel)]="config.name" (ngModelChangeDebounced)="configChanged()">

  <label for="aggregation">Aggregation</label>
  <select id="aggregation" class="form-select mb-2" [(ngModel)]="config.parameters.aggregation" (ngModelChange)="configChanged()">
    <option *ngFor="let a of aggregations" [ngValue]="a">{{a}}</option>
  </select>

  <sq-checkbox [context]="context" property="parameters.showCount" label="Show counts"></sq-checkbox>

  <ng-container *ngIf="config.type !== 'facet-date'">
    <sq-checkbox [context]="context" property="parameters.searchable" label="Searchable"></sq-checkbox>
    <sq-checkbox [context]="context" property="parameters.allowOr" label="Allow Multi-selecting with OR"></sq-checkbox>
    <sq-checkbox [context]="context" property="parameters.allowAnd" label="Allow Multi-selecting with AND" *ngIf="config.type !== 'facet-tree'"></sq-checkbox>
    <sq-checkbox [context]="context" property="parameters.allowExclude" label="Allow Excluding Items"></sq-checkbox>
  </ng-container>

  <ng-container *ngIf="config.type === 'facet-date'">
    <label for="timelineAggregation">Timeline Aggregation</label>
    <select id="timelineAggregation" class="form-select mb-2" [(ngModel)]="config.parameters.timelineAggregation" (ngModelChange)="configChanged()">
      <option *ngFor="let a of aggregations" [ngValue]="a">{{a}}</option>
    </select>

    <sq-checkbox [context]="context" property="parameters.allowPredefinedRange" label="Allow predefined range"></sq-checkbox>
    <sq-checkbox [context]="context" property="parameters.allowCustomRange" label="Allow custom range"></sq-checkbox>
    <sq-checkbox [context]="context" property="parameters.showCustomRange" label="Show custom range"></sq-checkbox>
  </ng-container>
</div>
`
})
export class FacetConfiguratorComponent implements OnChanges {
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
    if (!this.config.name) {
      this.config.name = "My facet";
      this.config.title = this.config.name;
      if (this.config.type === 'facet-date') {
        this.config.parameters = {
          showCount: true,
          allowPredefinedRange: true,
          allowCustomRange: true,
          showCustomRange: true,
          replaceCurrent: true,
          displayEmptyDistributionIntervals: true
        };
      }
      else {
        this.config.parameters = {
          showCount: true,
          searchable: true,
          allowOr: true,
          allowExclude: true,
          allowAnd: false
        };
      }
    }
    // Update the list of available aggregations
    this.aggregations = this.searchService.results?.aggregations
      .filter(agg => !!agg.isTree === (this.config.type === 'facet-tree'))
      .map(agg => agg.name) || [];
  }

  configChanged() {
    this.context.configChanged();
  }

}
