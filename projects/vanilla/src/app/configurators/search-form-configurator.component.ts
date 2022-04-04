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
    <select class="form-select" multiple [(ngModel)]="context.config.autocompleteSources" (ngModelChange)="context.configChanged()">
      <option value="suggests">Suggestions</option>
      <option value="baskets">Baskets</option>
      <option value="recent-documents">Recent documents</option>
      <option value="recent-queries">Recent queries</option>
      <option value="saved-queries">Saved queries</option>
    </select>
    `
})
export class SearchFormConfiguratorComponent {
  @Input() context: ConfiguratorContext;
}