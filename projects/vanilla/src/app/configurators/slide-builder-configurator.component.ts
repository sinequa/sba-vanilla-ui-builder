import { Component, Input } from "@angular/core";
import { ComponentConfig, ConfiguratorContext } from "@sinequa/ngx-ui-builder";

@Component({
  selector: "sq-slide-builder-configurator",
  template: `
  <div role="alert" class="alert alert-warning">This component requires special configuration on the backend. Please check the documentation: https://sinequa.github.io/sba-angular/modules/components/slide-builder.html</div>

  <div class="form-group">
    <h6>Header</h6>
    <sq-facet-header-configurator [context]="context"></sq-facet-header-configurator>
    <hr />
    <h6>Slide Builder configuration</h6>
    <uib-checkbox [context]="context" property="enableSaveAsBasket" label="Enable saving as a basket"></uib-checkbox>
  </div>
  `
})
export class SlideBuilderConfiguratorComponent {
  @Input() context: ConfiguratorContext;

  get config(): ComponentConfig {
    return this.context.config;
  }

  ngOnChanges(): void {
    // Initialize the config (when a new facet is created)
    if (!this.config.condition) {
      this.config.title = "Slide Deck Builder";
      this.config.icon = "far fa-file-powerpoint";
      this.config.classes = "mb-3";
    }
  }

  configChanged() {
    this.context.configChanged();
  }

}
