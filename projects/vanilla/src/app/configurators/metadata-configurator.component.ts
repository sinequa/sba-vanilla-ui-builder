import { Component, Input, OnChanges } from "@angular/core";
import { AppService } from "@sinequa/core/app-utils";
import { ComponentConfig, ConfiguratorContext } from "ngx-ui-builder";
import { METADATA } from "../../config";

@Component({
    selector: 'sq-metadata-configurator',
    template: `
<div class="form-group">
    <label for="item">Item</label>
    <select id="item" class="form-select mb-2" [(ngModel)]="config.item" (ngModelChange)="configChanged(true)">
        <option *ngFor="let a of items" [ngValue]="a">{{a}}</option>
    </select>
    
    <div class="form-check mb-2">
        <input type="checkbox" class="form-check-input" id="clickable" [(ngModel)]="!!config.clickable" (ngModelChange)="configChanged()">
        <label class="custom-control-label" for="clickable">Clickable</label>
    </div>

    <div class="form-check mb-2">
        <input type="checkbox" class="form-check-input" id="showTitle" [(ngModel)]="!!config.showTitle" (ngModelChange)="configChanged()">
        <label class="custom-control-label" for="showTitle">Show title</label>
    </div>
    
    <div class="form-check mb-2">
        <input type="checkbox" class="form-check-input" id="showIcon" [(ngModel)]="!!config.showIcon" (ngModelChange)="configChanged()">
        <label class="custom-control-label" for="showIcon">Show icon</label>
    </div>
    
    <div *ngIf="isEntity">
        Entity options:
        <div class="form-check mb-2">
            <input type="checkbox" class="form-check-input" id="showCounts" [(ngModel)]="!!config.showCounts" (ngModelChange)="configChanged()">
            <label class="custom-control-label" for="showCounts">Show counts</label>
        </div>

        <div class="form-check mb-2">
            <input type="checkbox" class="form-check-input" id="showEntityTooltip" [(ngModel)]="!!config.showEntityTooltip" (ngModelChange)="configChanged()">
            <label class="custom-control-label" for="showEntityTooltip">Show tooltip</label>
        </div>
    </div>
</div>
    `
})
export class MetadataConfiguratorComponent implements OnChanges {
    @Input() context: ConfiguratorContext;

    items = METADATA;
    isEntity: boolean;

    constructor(public appService: AppService){}

    ngOnChanges(): void {
        this.isEntity = this.appService.isEntity(this.config.item);
    }

    get config(): ComponentConfig {
        return this.context.config;
    }

    configChanged(isItem?: boolean) {
        if(isItem) {
            this.isEntity = this.appService.isEntity(this.config.item);
        }
        this.context.configChanged();
    }
}