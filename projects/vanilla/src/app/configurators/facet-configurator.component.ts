import { Component, Input, OnChanges } from "@angular/core";
import { SearchService } from "@sinequa/components/search";
import { ConfiguratorContext, ComponentConfig } from "ngx-ui-builder";

@Component({
    selector: 'sq-facet-configurator',
    template: `
<div class="form-group">
    <label for="title">Name</label>
    <input type="text" class="form-control mb-2" id="name" autocomplete="off" spellcheck="off" [(ngModel)]="config.name" (ngModelChange)="configChanged()">

    <label for="title">Title <span *ngIf="config.title!.startsWith('msg#')">("{{config.title | sqMessage}}")</span></label>
    <input type="text" class="form-control mb-2" id="title" autocomplete="off" spellcheck="off" [(ngModel)]="config.title" (ngModelChange)="configChanged()">

    <label for="icon">Icon <span *ngIf="config.icon">(<i [ngClass]="config.icon"></i>)</span></label>
    <input type="text" class="form-control mb-2" id="icon" autocomplete="off" spellcheck="off" [(ngModel)]="config.icon" (ngModelChange)="configChanged()">

    <label for="aggregation">Aggregation</label>
    <select id="aggregation" class="form-select mb-2" [(ngModel)]="config.aggregation" (ngModelChange)="configChanged()">
        <option *ngFor="let a of aggregations" [ngValue]="a">{{a}}</option>
    </select>

    <div class="form-check mb-2">
        <input type="checkbox" class="form-check-input" id="showCount" [(ngModel)]="!!config.showCount" (ngModelChange)="configChanged()">
        <label class="custom-control-label" for="showCount">Show counts</label>
    </div>
    
    <div class="form-check mb-2">
        <input type="checkbox" class="form-check-input" id="searchable" [(ngModel)]="!!config.searchable" (ngModelChange)="configChanged()">
        <label class="custom-control-label" for="searchable">Searchable</label>
    </div>

    <div class="form-check mb-2">
        <input type="checkbox" class="form-check-input" id="allowOr" [(ngModel)]="!!config.allowOr" (ngModelChange)="configChanged()">
        <label class="custom-control-label" for="allowOr">Allow Multi-selecting with OR</label>
    </div>
    
    <div class="form-check mb-2" *ngIf="!isTreeFacet">
        <input type="checkbox" class="form-check-input" id="allowAnd" [(ngModel)]="!!config.allowAnd" (ngModelChange)="configChanged()">
        <label class="custom-control-label" for="allowAnd">Allow Multi-selecting with AND</label>
    </div>

    <div class="form-check mb-2">
        <input type="checkbox" class="form-check-input" id="allowExclude" [(ngModel)]="!!config.allowExclude" (ngModelChange)="configChanged()">
        <label class="custom-control-label" for="allowExclude">Allow Excluding Items</label>
    </div>
</div>    
`
})
export class FacetConfiguratorComponent implements OnChanges {
    @Input() context: ConfiguratorContext;
    @Input() isTreeFacet: boolean;

    get config(): ComponentConfig {
        return this.context.config;
    }

    aggregations: string[];

    constructor(
        public searchService: SearchService
    ){}

    ngOnChanges(): void {
        // Initialize the config (when a new facet is created)
        if(!this.config.name) {
            this.config.name = "My facet";
            this.config.title = this.config.name;
            this.config.showCount = true;
            this.config.searchable = true;
            this.config.allowOr = true;
            this.config.allowExclude = true;
            this.config.allowAnd = false;
        }
        // Update the list of available aggregations
        this.aggregations = this.searchService.results?.aggregations
            .filter(agg => !!agg.isTree === !!this.isTreeFacet)
            .map(agg => agg.name) || [];
    }

    configChanged() {
        this.context.configChanged();
    }

}