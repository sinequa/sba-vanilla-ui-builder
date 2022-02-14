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
    
    <sq-checkbox [context]="context" property="showCount" label="Show counts"></sq-checkbox>
    <sq-checkbox [context]="context" property="searchable" label="Searchable"></sq-checkbox>
    <sq-checkbox [context]="context" property="allowOr" label="Allow Multi-selecting with OR"></sq-checkbox>
    <sq-checkbox [context]="context" property="allowAnd" label="Allow Multi-selecting with AND" *ngIf="!isTreeFacet"></sq-checkbox>
    <sq-checkbox [context]="context" property="allowExclude" label="Allow Excluding Items"></sq-checkbox>
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