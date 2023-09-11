import { Component, Input } from "@angular/core";
import { MetadataConfig } from "@sinequa/components/metadata";
import { AppService } from "@sinequa/core/app-utils";
import { ComponentConfig, ConfiguratorContext } from "@sinequa/ngx-ui-builder";

@Component({
  selector: 'sq-metadata-configurator',
  template: `
<div class="form-group">
  <label class="form-label mt-2">Selection</label>
  <p class="small text-muted m-0">Select which metadata to display. The order can be changed by dragging the following options up and down.</p>
  <uib-multi-selector [options]="metadataSelection" [enableReorder]="true" [(ngModel)]="config.items" (ngModelChange)="updatedList()">
  </uib-multi-selector>

  <div *ngIf="config.items?.length">
    <div class="input-group mb-2">
      <input type="text" class="form-control" [(ngModel)]="metadataString" placeholder="Type a string to insert between metadatas">
      <div class="input-group-append">
        <button class="btn btn-secondary" (click)="insertString()">Insert a string</button>
      </div>
    </div>

    <div class="mb-2">
      <label class="form-label" for="layout">Layout</label>
      <select [(ngModel)]="config.layout" id="layout" class="form-select" (ngModelChange)="context.configChanged()">
        <option value="">Inline</option>
        <option value="table">Table</option>
      </select>
    </div>

    <label class="form-label mt-2" for="item">Customize</label>
    <select id="item" class="form-select mb-2" [(ngModel)]="modifiedMetadata" (ngModelChangeDebounced)="changedMetadata()">
      <option [value]="undefined">Select a metadata</option>
      <option *ngFor="let conf of updatableMetadata" [value]="conf.field">{{conf.field}}</option>
    </select>

    <ng-container *ngIf="metadataToModify">
      <div class="mb-2">
        <label class="form-label" for="label">Label</label>
        <input type="text" class="form-control mb-1" id="label" [(ngModel)]="metadataToModify.label" (ngModelChangeDebounced)="configChanged()">
      </div>
      <div class="mb-2">
        <sq-icon-selector [config]="metadataToModify" (configChanged)="iconChanged(metadataToModify, $event)"></sq-icon-selector>
      </div>
      <div class="mb-2">
        <label class="form-label" for="fieldClass">Additional CSS classes</label>
        <input type="text" class="form-control mb-1" id="fieldClass" [(ngModel)]="metadataToModify.fieldClass" (ngModelChangeDebounced)="configChanged()">
      </div>
      <div class="form-check mb-2">
        <input class="form-check-input" type="checkbox" id="filterable" [(ngModel)]="metadataToModify.filterable" (ngModelChangeDebounced)="configChanged()">
        <label class="form-check-label" for="filterable">Filterable</label>
      </div>
      <div class="form-check mb-2">
        <input class="form-check-input" type="checkbox" id="excludable" [(ngModel)]="metadataToModify.excludable" (ngModelChangeDebounced)="configChanged()">
        <label class="form-check-label" for="excludable">Excludable</label>
      </div>
      <div class="form-check mb-2">
        <input class="form-check-input" type="checkbox" id="collapseRows" [(ngModel)]="metadataToModify.collapseRows" (ngModelChangeDebounced)="configChanged()">
        <label class="form-check-label" for="collapseRows">Collapse rows</label>
      </div>
      <div class="form-check mb-2" *ngIf="isEntity">
        <input class="form-check-input" type="checkbox" id="showEntityExtract" [(ngModel)]="metadataToModify.showEntityExtract" (ngModelChangeDebounced)="configChanged()">
        <label class="form-check-label" for="showEntityExtract">Show entity extract</label>
      </div>
      <div class="mb-2" *ngIf="isEntity">
        <label class="form-label" for="entityExtractMaxLines">Max lines for entity extract</label>
        <input type="number" class="form-control" id="entityExtractMaxLines" [(ngModel)]="metadataToModify.entityExtractMaxLines">
      </div>
    </ng-container>
  </div>
</div>
    `
})
export class MetadataConfiguratorComponent {
  @Input() context: ConfiguratorContext;
  @Input() metadata: string[];
  @Input() metadataConfig: MetadataConfig[];

  modifiedMetadata: string;
  metadataString: string;
  metadataToModify: MetadataConfig;
  isEntity: boolean;

  constructor(public appService: AppService) { }

  get config(): ComponentConfig {
    return this.context.config;
  }

  get metadataSelection(): string[] {
    const stringItems = this.config.metadataConfig?.filter(c => !c.field) || [];
    return this.metadata.concat(stringItems);
  }

  get updatableMetadata(): MetadataConfig[] {
    return this.config.metadataConfig?.filter(c => !!c.field) || [];
  }

  insertString() {
      if (this.metadataString.trim() !== "") {
        this.config.metadataConfig.push(this.metadataString);
        this.config.items.push(this.metadataString);
        this.metadataString = '';
        this.configChanged();
      }
  }

  configChanged() {
    this.context.configChanged();
    setTimeout(() => {
      if (this.metadataToModify) {
        this.metadataToModify = this.config.metadataConfig.find(m => m.field === this.metadataToModify.field);
      }
    })
  }

  updatedList() {
    const allMetadata = [...(this.config.metadataConfig || [])].concat(this.metadataConfig);
    this.config.metadataConfig = this.config.items.map(item => {
      let metadata: MetadataConfig = allMetadata.find(m => m.field === item || !m.field);
      if (!metadata) {
        metadata = { field: item };
      }
      return metadata;
    });
    this.configChanged();
  }

  changedMetadata() {
    this.metadataToModify = this.config.metadataConfig.find(m => m.field === this.modifiedMetadata);
    this.isEntity = this.appService.isEntity(this.metadataToModify.field);
  }

  iconChanged(metadata: any, change: { icon: string, iconCode: string }) {
    Object.assign(metadata, change);
    this.configChanged();
  }
}
