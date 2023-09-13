import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
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
    <label class="form-label" for="metadataString">Insert a static string</label>
    <div class="input-group mb-2">
      <input type="text" class="form-control" [(ngModel)]="metadataString" id="metadataString" placeholder="Type the string to insert">
      <div class="input-group-append">
        <button class="btn btn-secondary" (click)="insertString()">Add</button>
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
    <select id="item" class="form-select mb-2" [(ngModel)]="modifiedMetadata" (ngModelChangeDebounced)="selectedMetadata()">
      <option [value]="undefined">Select a metadata</option>
      <option *ngFor="let conf of config.metadataConfig" [value]="conf.field || conf">{{conf.field || conf}}</option>
    </select>

    <!-- Simple string metadata -->
    <ng-container *ngIf="stringToModify">
    <div class="mb-2">
        <label class="form-label" for="stringUpdate">Update the string</label>
        <input type="text" class="form-control mb-1" id="stringUpdate" [(ngModel)]="newString" (ngModelChangeDebounced)="changedString()">
      </div>
    </ng-container>

    <!-- MetadataConfig metadata -->
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
export class MetadataConfiguratorComponent implements OnChanges {
  @Input() context: ConfiguratorContext;
  @Input() metadata: string[];

  modifiedMetadata: string;
  metadataString: string;
  metadataToModify: MetadataConfig;
  stringToModify?: string;
  newString: string;
  isEntity: boolean;

  constructor(public appService: AppService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.context && this.metadataToModify) {
      this.metadataToModify = this.config.metadataConfig.find(m => m.field === this.metadataToModify.field);
    }
  }

  get config(): ComponentConfig {
    return this.context.config;
  }

  get metadataSelection(): string[] {
    const stringItems = this.config.metadataConfig?.filter(c => !c.field) || [];
    return this.metadata.concat(stringItems);
  }

 /** Update the whole config */
  configChanged() {
    this.context.configChanged();
  }

  /** Selecting a metadata to update */
  selectedMetadata() {
    this.metadataToModify = this.config.metadataConfig.find(m => m.field === this.modifiedMetadata);
    this.stringToModify = this.metadataToModify ? undefined : this.modifiedMetadata;
    this.newString = String(this.stringToModify);
    this.isEntity = this.metadataToModify && this.appService.isEntity(this.metadataToModify.field);
  }

  /** Insert a static string inside the metadata list */
  insertString() {
      if (this.metadataString.trim() !== "") {
        this.config.metadataConfig.push(this.metadataString);
        this.config.items.push(this.metadataString);
        this.metadataString = '';
        this.configChanged();
      }
  }

  /** Update a static string */
  changedString() {
    if (this.newString) {
      let metadataConfigValue = this.config.metadataConfig.find(m => m === this.stringToModify);
      let itemsValue = this.config.items.find(m => m === this.stringToModify);

      this.config.metadataConfig[this.config.metadataConfig.indexOf(metadataConfigValue)] = this.newString;
      this.config.items[this.config.items.indexOf(itemsValue)] = this.newString;
      this.modifiedMetadata = this.newString;
      this.stringToModify = this.newString;

      this.configChanged();
    }
  }

  /** Update the metadata list after reorganizing it */
  updatedList() {
    const allMetadata = [...(this.config.metadataConfig || [])];
    this.config.metadataConfig = this.config.items.map(item => {
      let metadata: MetadataConfig = allMetadata.find(m => m.field === item);
      if (!metadata && !!this.metadata.find(m => m === item)) {
        metadata = {field: item};
      }
      return metadata || item;
    });
    this.configChanged();
  }

  /** Update a metadata icon */
  iconChanged(metadata: any, change: { icon: string, iconCode: string }) {
    Object.assign(metadata, change);
    this.configChanged();
  }
}
