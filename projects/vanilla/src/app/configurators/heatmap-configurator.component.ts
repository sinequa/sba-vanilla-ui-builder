import { Component, Input, OnChanges } from "@angular/core";
import { SearchService } from "@sinequa/components/search";
import { ConfiguratorContext, ComponentConfig } from "@sinequa/ngx-ui-builder";

@Component({
    selector: 'sq-heatmap-configurator',
    template: `
<div class="form-group">
    <label for="title">Title <span *ngIf="config.title!.startsWith('msg#')">("{{config.title | sqMessage}}")</span></label>
    <input type="text" class="form-control mb-2" id="title" autocomplete="off" spellcheck="off" [(ngModel)]="config.title" (ngModelChangeDebounced)="configChanged()">

    <sq-icon-selector class="d-block mb-2" [config]="config" (configChanged)="configChanged()"></sq-icon-selector>

    <sq-checkbox [context]="context" property="collapsible" label="Collapsible"></sq-checkbox>

    <label for="fieldX">Default field (X)</label>
    <select id="fieldX" class="form-select mb-2" [(ngModel)]="config.fieldX" (ngModelChange)="configChanged()">
        <option *ngFor="let a of metadata" [ngValue]="a">{{a}}</option>
    </select>

    <label for="fieldY">Default field (Y)</label>
    <select id="fieldY" class="form-select mb-2" [(ngModel)]="config.fieldY" (ngModelChange)="configChanged()">
        <option *ngFor="let a of metadata" [ngValue]="a">{{a}}</option>
    </select>

    <label for="fields">All available fields</label>
    <select id="fields" class="form-select mb-2" [(ngModel)]="config.fields" multiple (ngModelChange)="configChanged()">
        <option *ngFor="let a of metadata" [ngValue]="a">{{a}}</option>
    </select>
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
    ){}

    ngOnChanges(): void {
        // Initialize the config (when a new facet is created)
        if(!this.config.fieldX) {
            this.config.title = "Heatmap";
            this.config.icon = "fas fa-th";
            this.config.fieldX = "company";
            this.config.fieldY = "person";
            this.config.fields = ['geo', 'company', 'person'];
        }
    }

    configChanged() {
        this.context.configChanged();
    }

}
