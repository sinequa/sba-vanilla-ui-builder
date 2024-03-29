import { Component, Input } from "@angular/core";
import { ConfiguratorContext } from "@sinequa/ngx-ui-builder";

@Component({
  selector: 'sq-search-form-legacy-configurator',
  template: `
  <h6>Autocomplete sources</h6>
  <uib-multi-selector
    [options]="sources"
    valueField="value"
    displayField="display"
    [(ngModel)]="context.config.autocompleteSources"
    (ngModelChange)="context.configChanged()">
  </uib-multi-selector>  `
})
export class SearchFormLegacyConfiguratorComponent {
  @Input() context: ConfiguratorContext;

  sources = [
    {value: "suggests", display: "Suggestions"},
    {value: "baskets", display: "Collections (aka. baskets)"},
    {value: "recent-documents", display: "Recent documents"},
    {value: "recent-queries", display: "Recent queries"},
    {value: "saved-queries", display: "Saved queries"},
  ]
}
