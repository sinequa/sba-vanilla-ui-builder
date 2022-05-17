import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { ComponentConfig, ConfiguratorContext } from "@sinequa/ngx-ui-builder";

@Component({
  selector: 'sq-home-facet-configurator',
  template: `
  <label for="maxItems">Number of items displayed</label>
  <input type="number" class="form-control mb-2" id="maxItems" autocomplete="off" spellcheck="off" min="1" [(ngModel)]="config.maxItems" (ngModelChangeDebounced)="context.configChanged()">
`
})
export class HomeFacetConfigurator implements OnChanges {
  @Input() context: ConfiguratorContext;

  get config(): ComponentConfig {
    return this.context.config;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!this.config.maxItems) {
      this.config.maxItems = 5;
    }
  }
}
