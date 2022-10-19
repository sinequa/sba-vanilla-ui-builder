import { Component, Input } from "@angular/core";
import { ConfiguratorContext } from "@sinequa/ngx-ui-builder";

@Component({
    selector: 'sq-search-form-configurator',
    template: `
    <h6>Search form parameters</h6>
    <sq-checkbox [context]="context" property="enableVoiceRecognition" label="Voice recognition"></sq-checkbox>
    <sq-checkbox [context]="context" property="keepTab" label="Keep active tab for a new search"></sq-checkbox>
    <sq-checkbox [context]="context" property="enableKeepFilters" label="Allow user to keep active filters for a new search"></sq-checkbox>
    <sq-checkbox [context]="context" property="keepFilters" label="Keep filters by default" *ngIf="context.config.enableKeepFilters"></sq-checkbox>
    <sq-checkbox [context]="context" property="enableAdvancedForm" label="Display the advanced form"></sq-checkbox>
    <sq-checkbox [context]="context" property="keepAdvancedSearchFilters" label="Keep the advanced form's filters for a new search" *ngIf="context.config.enableAdvancedForm"></sq-checkbox>

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
