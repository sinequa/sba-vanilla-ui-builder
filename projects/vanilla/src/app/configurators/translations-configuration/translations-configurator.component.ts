import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ConfiguratorContext } from '@sinequa/ngx-ui-builder';
import enLocale from "../../../locales/en";
import frLocale from "../../../locales/fr";
import deLocale from "../../../locales/de";
import { Utils } from '@sinequa/core/base';

@Component({
  selector: "sq-translations-configurator",
  template: `
<div class="row mb-2">
    <div class="col-7">
        <label class="form-label" for="filter">Filter</label>
        <input type="text" class="form-control" id="filter" [(ngModel)]="filter">
    </div>
    <div class="col-5">
        <label class="form-label" for="language">Language</label>
        <select id="language" class="form-select mb-2" [(ngModel)]="language">
            <option [ngValue]="'en'">English</option>
            <option [ngValue]="'fr'">French</option>
            <option [ngValue]="'de'">German</option>
        </select>
    </div>
</div>

<app-translation-item
    *ngFor="let item of messages | keyvalue | sqStringFilter:filter"
    [item]="item"
    [level]="1"
    [filter]="filter"
    [path]="[]"
    (updated)="updatedItem($event)">
</app-translation-item>
  `
})
export class TranslationsConfiguratorComponent implements OnChanges {
  @Input() context: ConfiguratorContext;

  enMessages: any;
  frMessages: any;
  deMessages: any;

  filter: string;
  language: 'en' | 'fr' | 'de' = "en";
  updated = false; // boolean used to avoid updating the messages list after making an update so the list displayed doesn't get refreshed and closed again

  ngOnChanges(changes: SimpleChanges): void {
    if (this.updated) { // if coming here from a value update
      this.updated = false;
    } else { // if coming here at component startup or configuration reset
      const translations = changes.context.currentValue.config.translations;
      this.enMessages = Utils.merge({}, enLocale.messages, translations.en);
      this.frMessages = Utils.merge({}, frLocale.messages, translations.fr);
      this.deMessages = Utils.merge({}, deLocale.messages, translations.de);
    }
  }

  get messages() {
    switch (this.language) {
      case 'fr':
        return this.frMessages;
      case 'de':
        return this.deMessages;
      default:
        return this.enMessages;
    }
  }

  updatedItem(item: { path: string[], value: string }): void {
    let configItem: any = this.context.config.translations[this.language];

    // map all parameter from the path to save the new value along the same path as in the static messages
    item.path.forEach((path: string, index: number) => {
      const isLast = index + 1 === item.path.length;
      if (!configItem[path] && !isLast) {
        configItem[path] = {};
      }

      if (isLast) { // if last, then we have reached the parameter to update the value to
        configItem[path] = item.value;
      } else { // else keep moving along the path
        configItem = configItem[path];
      }
    })

    this.updated = true;
    this.context.configChanged();
  }

}
