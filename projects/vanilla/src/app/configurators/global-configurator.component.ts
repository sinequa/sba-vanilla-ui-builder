import { Component, Input } from "@angular/core";
import { ConfiguratorContext } from "@sinequa/ngx-ui-builder";

@Component({
  selector: "sq-global-configurator",
  template: `
  <sq-color-picker [context]="context" property="backgroundColor" label="Background color"></sq-color-picker>
  <sq-color-picker [context]="context" property="gradientColor" label="Gradient color"></sq-color-picker>
  <sq-img-selector [context]="context" param="backgroundImage" description="Background image" class="d-block mb-2"></sq-img-selector>

  <label for="font">Font</label>
  <select id="font" class="form-select mb-2" [(ngModel)]="context.config.fontFamily" (ngModelChange)="context.configChanged()">
      <option *ngFor="let font of fonts" [ngValue]="font.value">{{font.name}}</option>
  </select>
  `
})
export class GlobalConfiguratorComponent {
  @Input() context: ConfiguratorContext;

  fonts = [
    {name: "System (default)", value: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'},
    {name: "Serif", value: "Georgia, serif"},
    {name: "Cursive", value: "cursive"},
    {name: "Monospace", value: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'},
    {name: "Fantasy", value: "fantasy"}
  ]
}
