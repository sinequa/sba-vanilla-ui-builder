import { Component, Input } from "@angular/core";
import { ConfiguratorContext } from "@sinequa/ngx-ui-builder";

@Component({
  selector: 'sq-search-form-configurator',
  template: `
  <h6>Autocomplete sources</h6>
  <sq-select-multi
    [options]="sources"
    valueField="value"
    displayField="display"
    [(ngModel)]="context.config.autocompleteSources"
    (ngModelChange)="context.configChanged()">
  </sq-select-multi>

  <hr />
  `
})
export class SearchFormConfiguratorComponent {
  @Input() context: ConfiguratorContext;

  sources = [
    {value: "suggests", display: "Suggestions"},
    {value: "baskets", display: "Collections (aka. baskets)"},
    {value: "recent-documents", display: "Recent documents"},
    {value: "recent-queries", display: "Recent queries"},
    {value: "saved-queries", display: "Saved queries"},
  ]
}
