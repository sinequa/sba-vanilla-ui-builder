import { Component, Input, OnChanges } from "@angular/core";
import { SearchService } from "@sinequa/components/search";
import { AppService } from "@sinequa/core/app-utils";
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

  <uib-checkbox [context]="context" property="parameters.showCount" label="Show counts"></uib-checkbox>

  <ng-container *ngIf="config.type !== 'facet-date'">
    <uib-checkbox [context]="context" property="parameters.searchable" label="Searchable"></uib-checkbox>
    <uib-checkbox [context]="context" property="parameters.allowOr" label="Allow Multi-selecting with OR"></uib-checkbox>
    <uib-checkbox [context]="context" property="parameters.allowAnd" label="Allow Multi-selecting with AND" *ngIf="!isTree"></uib-checkbox>
    <uib-checkbox [context]="context" property="parameters.allowExclude" label="Allow Excluding Items"></uib-checkbox>
    <uib-checkbox [context]="context" property="parameters.displayEmptyDistributionIntervals" label="Display empty distribution intervals"></uib-checkbox>
    <uib-checkbox [context]="context" property="parameters.acceptNonAggregationItemFilter" label="Accept non aggregation item filters"></uib-checkbox>
    <uib-checkbox [context]="context" property="parameters.replaceCurrent" label="Replace the previous select"></uib-checkbox>

    <div *ngIf="isTree">
      <label for="title">Expanded level</label>
      <input type="number" class="form-control" id="expandedLevel" [(ngModel)]="config.parameters.expandedLevel" min="0" (ngModelChangeDebounced)="configChanged()">
    </div>
  </ng-container>

  <ng-container *ngIf="config.type === 'facet-date'">
    <label for="timelineAggregation">Timeline Aggregation</label>
    <select id="timelineAggregation" class="form-select mb-2" [(ngModel)]="config.parameters.timelineAggregation" (ngModelChange)="configChanged()">
      <option *ngFor="let a of aggregations" [ngValue]="a">{{a}}</option>
    </select>

    <uib-checkbox [context]="context" property="parameters.allowPredefinedRange" label="Allow predefined range"></uib-checkbox>
    <uib-checkbox [context]="context" property="parameters.allowCustomRange" label="Allow custom range"></uib-checkbox>
    <uib-checkbox [context]="context" property="parameters.showCustomRange" label="Show custom range"></uib-checkbox>
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
  isTree: boolean;

  constructor(
    public searchService: SearchService,
    private appService: AppService
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
          displayEmptyDistributionIntervals: true,
          acceptNonAggregationItemFilter: true,
          expandedLevel: 2
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
    const aggregations = this.searchService.results?.aggregations;
    this.aggregations = aggregations?.map(agg => agg.name) || [];
    this.isTree = !!aggregations?.find(a => a.name === this.config.parameters?.aggregation)?.isTree;
  }

  configChanged() {
    this.context.configChanged();
  }

}
