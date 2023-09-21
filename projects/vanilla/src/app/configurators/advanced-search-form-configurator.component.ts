import { Component, Input } from "@angular/core";
import { Utils } from "@sinequa/core/base";
import { ConfiguratorContext, ConfigService, ComponentConfig } from "@sinequa/ngx-ui-builder";
import { Observable, map } from "rxjs";

@Component({
  selector: 'sq-advanced-search-form-configurator',
  template: `
  <h6>Autocomplete sources</h6>
  <uib-multi-selector
    [options]="sources"
    valueField="value"
    displayField="display"
    [(ngModel)]="context.config.autocompleteSources"
    (ngModelChange)="context.configChanged()">
  </uib-multi-selector>

  <hr />

  <h6>Select the facets to display</h6>
  <uib-multi-selector
    [options]="facets$ | async"
    displayField="name"
    [enableReorder]="true"
    [(ngModel)]="context.config.facets"
    [compareWith]="compareIds"
    (ngModelChange)="context.configChanged()">
  </uib-multi-selector>`
})
export class AdvancedSearchFormConfiguratorComponent {
  @Input() context: ConfiguratorContext;

  facets$: Observable<ComponentConfig[]>;

  sources = [
    {value: "suggests", display: "Suggestions"},
    {value: "baskets", display: "Collections (aka. baskets)"},
    {value: "recent-documents", display: "Recent documents"},
    {value: "recent-queries", display: "Recent queries"},
    {value: "saved-queries", display: "Saved queries"},
  ]

  constructor(public configService: ConfigService) {
    // Watch the list of available facet configurations to display in the facet-multi
    this.facets$ = this.configService.watchAllConfig().pipe(
      map(config => config.filter(c => c.type === 'facet-list' || c.type === 'facet-date')
        .map(c => Utils.extend({}, c, {type: c.type.replace("facet-", ""), aggregation: c.aggregation || c.parameters.aggregation})) // Component configs have "facet-" prepended to the type
      )
    );
  }

  compareIds = (config1: ComponentConfig, config2: ComponentConfig) => {
    return config1?.id === config2?.id;
  }
}
