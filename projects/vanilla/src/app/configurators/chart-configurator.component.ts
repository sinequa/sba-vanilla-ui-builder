import { Component, Input, OnChanges } from "@angular/core";
import { SearchService } from "@sinequa/components/search";
import { ConfiguratorContext, ComponentConfig } from "@sinequa/ngx-ui-builder";

@Component({
    selector: 'sq-chart-configurator',
    template: `
<div class="form-group">
    <label for="title">Title <span *ngIf="config.title!.startsWith('msg#')">("{{config.title | sqMessage}}")</span></label>
    <input type="text" class="form-control mb-2" id="title" autocomplete="off" spellcheck="off" [(ngModel)]="config.title" (ngModelChangeDebounced)="configChanged()">

    <sq-icon-selector class="d-block mb-2" [config]="config" (configChanged)="configChanged()"></sq-icon-selector>

    <sq-checkbox [context]="context" property="collapsible" label="Collapsible"></sq-checkbox>

    <label for="aggregation">Aggregation</label>
    <select id="aggregation" class="form-select mb-2" [(ngModel)]="config.aggregation" (ngModelChange)="configChanged()">
        <option *ngFor="let a of aggregations" [ngValue]="a">{{a}}</option>
    </select>
</div>
`
})
export class ChartConfiguratorComponent implements OnChanges {
    @Input() context: ConfiguratorContext;

    get config(): ComponentConfig {
        return this.context.config;
    }

    aggregations: string[];

    constructor(
        public searchService: SearchService
    ){}

    ngOnChanges(): void {
        // Initialize the config (when a new facet is created)
        if(!this.config.aggregation) {
            this.config.title = "Chart";
            this.config.icon = "fas fa-chart-bar";
            this.config.aggregation = "Company";
            this.config.classes = "mb-3";
        }
        // Update the list of available aggregations
        this.aggregations = this.searchService.results?.aggregations
            .filter(agg => !agg.isTree)
            .map(agg => agg.name) || [];
    }

    configChanged() {
        this.context.configChanged();
    }

}
