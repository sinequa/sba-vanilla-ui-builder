import { Component, Input, OnChanges } from "@angular/core";
import { Utils } from "@sinequa/core/base";
import { ComponentConfig, ConfigService, ConfiguratorContext } from "ngx-ui-builder";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: 'sq-facet-multi-configurator',
  template: `
<label for="title">Title <span *ngIf="context.config.title!.startsWith('msg#')">("{{context.config.title | sqMessage}}")</span></label>
<input type="text" class="form-control mb-2" id="title" autocomplete="off" spellcheck="off" [(ngModel)]="context.config.title" (ngModelChange)="context.configChanged()">

<sq-icon-selector [config]="context.config" (configChanged)="context.configChanged()"></sq-icon-selector>

Select the facets to display:
<select class="form-select mb-2" multiple [(ngModel)]="context.config.facets" [compareWith]="compareIds" (ngModelChange)="context.configChanged()">
    <option *ngFor="let facet of (facets$ | async)" [ngValue]="facet">{{facet.id}}</option>
</select>
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
      map(config => config.filter(c => c.type === 'facet-list' || c.type === 'facet-tree')
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