import { Component, Input } from '@angular/core';
import { AppService } from '@sinequa/core/app-utils';
import { ConfiguratorContext } from "@sinequa/ngx-ui-builder";
import { NetworkConfig } from "../search/network.pipe";

@Component({
  selector: 'sq-network-configurator',
  template: `
  <label for="title">Title <span *ngIf="config.title!.startsWith('msg#')">("{{config.title | sqMessage}}")</span></label>
  <input type="text" class="form-control mb-2" id="title" autocomplete="off" spellcheck="off" [(ngModel)]="config.title" (ngModelChangeDebounced)="configChanged()">

  <sq-icon-selector class="d-block mb-2" [config]="config" (configChanged)="configChanged()"></sq-icon-selector>

  <sq-checkbox [context]="context" property="collapsible" label="Collapsible"></sq-checkbox>

  <hr />

  <h6>Node Types</h6>
  <div *ngFor="let type of config.nodeTypes; let i=index; trackBy: getIndex" class="card mb-1 p-2">
    <label for="field-{{i}}">Field</label>
    <input type="text" class="form-control mb-2" id="field-{{i}}" autocomplete="off" spellcheck="off" [(ngModel)]="type.field" (ngModelChangeDebounced)="configChanged()">

    <sq-icon-selector [config]="type" (configChanged)="iconChanged(type, $event)"></sq-icon-selector>

    <sq-color-picker [context]="context" property="nodeTypes.{{i}}.color" label="Color"></sq-color-picker>
  </div>
  <button class="btn btn-sm btn-primary mb-2" (click)="addNodeType()">Add Node Type</button>

  <h6>Network Providers</h6>
  <div *ngFor="let provider of config.providers; let i=index; trackBy: getIndex" class="card mb-1 p-2">
    <label for="type-{{i}}">Type</label>
    <select id="type-{{i}}" class="form-select mb-2" [(ngModel)]="provider.type" (ngModelChange)="configChanged()">
      <option>aggregations</option>
      <option>selected-records</option>
    </select>

    <div *ngIf="provider.type === 'aggregations'">
      <p class="text-muted">
        Nodes and edges are given by cross-aggregations computed on index columns.
        Cross-aggregations are configured by providing the 2 two columns (instead of 1) separated by a slash (/), eg. "person/company".
      </p>
      <label>Cross Aggregations</label>
      <sq-select-multi
        [options]="aggregations"
        [(ngModel)]="provider.aggregations"
        (ngModelChange)="configChanged()">
      </sq-select-multi>
      <div *ngIf="!aggregations.length" class="alert alert-warning">
        Please configure at least one cross-aggregation in the query web service
      </div>
    </div>

    <div *ngIf="provider.type === 'selected-records'">
      <p class="text-muted">
        Nodes are given by the records selected from the result list, and by the fields contained in these records.
      </p>
      <label>Fields</label>
      <sq-select-multi
        [options]="metadata"
        [(ngModel)]="provider.fields"
        (ngModelChange)="configChanged()">
      </sq-select-multi>
    </div>
  </div>
  <button class="btn btn-sm btn-primary mb-2" (click)="addProvider()">Add Provider</button>

  <hr />

`
})
export class NetworkConfiguratorComponent {
  @Input() context: ConfiguratorContext;
  @Input() metadata: string[];

  get config(): NetworkConfig {
    return this.context.config as NetworkConfig;
  }

  aggregations: string[];

  constructor(
    public appService: AppService
  ){}

  ngOnChanges(): void {
    // Initialize the config (when a new facet is created)
    if(!this.config.nodeTypes) {
      this.config.title = "Network";
      this.config.icon = "fas fa-project-diagram";
      this.config.classes = "mb-3";
      this.config.nodeTypes = [{
        icon: "fas fa-globe-americas",
        iconCode: "\uf57d", // Geo
        color: "#5cb85c",
        field: "geo"
      },{
        icon: "fas fa-building",
        iconCode: "\uf1ad", // Company
        color: "#f0ad4e",
        field: "company"
      }];
      this.config.providers = [{
        type: "aggregations",
        aggregations: ["Geo_Company"],
        fields: []
      }];
    }
    // Update the list of available aggregations
    this.aggregations = this.appService.ccquery?.aggregations
      .filter(agg => agg.column.includes('/') && agg.name !== "Heatmap")
      .map(agg => agg.name) || [];
  }


  getIndex = (i: number) => i;

  configChanged() {
    this.context.configChanged();
  }

  addNodeType() {
    this.config.nodeTypes.push({
      icon: '',
      iconCode: '',
      color: '#000000',
      field: ''
    });
    this.configChanged();
  }

  addProvider() {
    this.config.providers.push({
      type: 'selected-records',
      aggregations: [],
      fields: ['person']
    });
    this.configChanged();
  }

  iconChanged(nodeType: {icon: string, iconCode: string}, change: {icon: string, iconCode: string}) {
    Object.assign(nodeType, change);
    this.configChanged();
  }
}
