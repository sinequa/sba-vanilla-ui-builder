import { Component, Input } from "@angular/core";
import { ConfiguratorContext } from "@sinequa/ngx-ui-builder";

@Component({
  selector: "sq-global-configurator",
  template: `
  <sq-color-picker [context]="context" property="backgroundColor" label="Background color"></sq-color-picker>
  <sq-color-picker [context]="context" property="gradientColor" label="Gradient color"></sq-color-picker>
  <sq-img-selector [context]="context" param="backgroundImage" description="Background image" class="d-block mb-2"></sq-img-selector>
  `
})
export class GlobalConfiguratorComponent {
  @Input() context: ConfiguratorContext;
}
