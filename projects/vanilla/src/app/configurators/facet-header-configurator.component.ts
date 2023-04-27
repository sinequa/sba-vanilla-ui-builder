import {Component, Input} from '@angular/core';
import { ComponentConfig, ConfiguratorContext } from '@sinequa/ngx-ui-builder';

@Component({
  selector: 'sq-facet-header-configurator',
  template: `
  <label for="title">Title <span *ngIf="config.title!.startsWith('msg#')">("{{config.title | sqMessage}}")</span></label>
  <input type="text" class="form-control mb-2" id="title" autocomplete="off" spellcheck="off" [(ngModel)]="config.title" (ngModelChangeDebounced)="configChanged()">

  <sq-icon-selector class="d-block mb-2" [config]="config" (configChanged)="configChanged()"></sq-icon-selector>

  <uib-checkbox [context]="context" property="collapsible" label="Collapsible"></uib-checkbox>
  `
})
export class FacetHeaderConfiguratorComponent {
  @Input() context: ConfiguratorContext;

  get config(): ComponentConfig {
    return this.context.config;
  }

  configChanged() {
    this.context.configChanged();
  }
}
