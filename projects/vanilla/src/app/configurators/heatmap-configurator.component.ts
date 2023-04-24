import { Component, Input, OnChanges } from "@angular/core";
import { SearchService } from "@sinequa/components/search";
import { ConfiguratorContext, ComponentConfig } from "@sinequa/ngx-ui-builder";

@Component({
  selector: 'sq-heatmap-configurator',
  template: `
<div class="form-group">
  <h6>Header</h6>
  <sq-facet-header-configurator [context]="context"></sq-facet-header-configurator>
  <hr />

  <h6>Heatmap configuration</h6>
  <label for="fieldX">Default field (X)</label>
  <select id="fieldX" class="form-select mb-2" [(ngModel)]="config.fieldX" (ngModelChange)="configChanged()">
    <option *ngFor="let a of metadata" [ngValue]="a">{{a}}</option>
  </select>

  <label for="fieldY">Default field (Y)</label>
  <select id="fieldY" class="form-select mb-2" [(ngModel)]="config.fieldY" (ngModelChange)="configChanged()">
    <option *ngFor="let a of metadata" [ngValue]="a">{{a}}</option>
  </select>

  <label>All available fields</label>
  <uib-multi-selector
    [options]="metadata"
    [(ngModel)]="config.fields"
    (ngModelChange)="configChanged()">
  </uib-multi-selector>
</div>
`
})
export class HeatmapConfiguratorComponent implements OnChanges {
  @Input() context: ConfiguratorContext;
  @Input() metadata: string[];

  get config(): ComponentConfig {
    return this.context.config;
  }

  constructor(
    public searchService: SearchService
  ) { }

  ngOnChanges(): void {
    // Initialize the config (when a new facet is created)
    if (!this.config.fieldX) {
      this.config.title = "Heatmap";
      this.config.icon = "fas fa-th";
      this.config.fieldX = "company";
      this.config.fieldY = "person";
      this.config.fields = ['geo', 'company', 'person'];
      this.config.classes = "mb-3";
    }
  }

  configChanged() {
    this.context.configChanged();
  }

}
