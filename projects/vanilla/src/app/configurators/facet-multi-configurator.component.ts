import { Component, Input, OnChanges } from "@angular/core";
import { Utils } from "@sinequa/core/base";
import { ComponentConfig, ConfigService, ConfiguratorContext } from "@sinequa/ngx-ui-builder";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: 'sq-facet-multi-configurator',
  template: `
  <h6>Header</h6>
  <sq-facet-header-configurator [context]="context"></sq-facet-header-configurator>
  <hr />

  <h6>Select the facets to display</h6>
  <uib-multi-selector
    [options]="facets$ | async"
    displayField="name"
    [enableReorder]="true"
    [(ngModel)]="context.config.facets"
    [compareWith]="compareIds"
    (ngModelChange)="context.configChanged()">
  </uib-multi-selector>
`
})
export class FacetMultiConfiguratorComponent implements OnChanges {
  @Input() context: ConfiguratorContext;

  facets$: Observable<ComponentConfig[]>;

  constructor(
    public configService: ConfigService
  ){
    // Watch the list of available facet configurations to display in the facet-multi
    this.facets$ = this.configService.watchAllConfig().pipe(
      map(config => config.filter(c => c.type === 'facet-list' || c.type === 'facet-tree' || c.type === 'facet-date')
        .map(c => Utils.extend({}, c, {type: c.type.replace("facet-", "")})) // Component configs have "facet-" prepended to the type
      )
    );
  }

  ngOnChanges() {
    // Initialize list of facets when created from scratch
    if(!this.context.config.facets) {
      this.context.config.facets = [];
      this.context.config.icon = "fas fa-filter fa-fw";
      this.context.config.title = "msg#facet.filters.title";
    }
  }

  compareIds = (config1: ComponentConfig, config2: ComponentConfig) => {
    return config1?.id === config2?.id;
  }
}
