import { Component, Input, OnChanges } from "@angular/core";
import { AppService } from "@sinequa/core/app-utils";
import { ComponentConfig, ConfiguratorContext } from "@sinequa/ngx-ui-builder";

@Component({
    selector: 'sq-metadata-configurator',
    template: `
<div class="form-group">
    <label for="item">Item</label>
    <select id="item" class="form-select mb-2" [(ngModel)]="config.item" (ngModelChange)="configChanged(true)">
        <option *ngFor="let a of metadata" [ngValue]="a">{{a}}</option>
    </select>

    <sq-checkbox [context]="context" property="clickable" label="Clickable"></sq-checkbox>
    <sq-checkbox [context]="context" property="showTitle" label="Show title"></sq-checkbox>
    <sq-checkbox [context]="context" property="showIcon" label="Show icon"></sq-checkbox>

    <div *ngIf="isEntity">
        Entity options:
        <sq-checkbox [context]="context" property="showCounts" label="Show counts"></sq-checkbox>
        <sq-checkbox [context]="context" property="showEntityTooltip" label="Show tooltip"></sq-checkbox>
    </div>
</div>
    `
})
export class MetadataConfiguratorComponent implements OnChanges {
    @Input() context: ConfiguratorContext;
    @Input() metadata: string[];

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
