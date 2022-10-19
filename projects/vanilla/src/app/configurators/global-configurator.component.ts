import { Component, Input, OnInit } from "@angular/core";
import { ConfiguratorContext } from "@sinequa/ngx-ui-builder";

@Component({
  selector: "sq-global-configurator",
  template: `
  <div role="alert" class="alert alert-warning">This component controls global styling options (colors, fonts, etc.). The component itself has no visible appearance.</div>

  <div class="d-flex gap-2">
    <sq-color-picker [context]="context" [defaultColor]="background" property="backgroundColor" label="Background" tooltip="Select the background color"></sq-color-picker>
    <sq-color-picker [context]="context" [defaultColor]="gradient" property="gradientColor" label="Gradient" tooltip="Select last color to create a gradient backgound"></sq-color-picker>
  </div>

  <div class="d-flex gap-2">
    <sq-color-picker [context]="context" [defaultColor]="brand" property="brandingColor" label="Branding" tooltip="Select color for navigation and facet bar"></sq-color-picker>
    <sq-color-picker [context]="context" [defaultColor]="primary" property="primaryColor" label="Primary" tooltip="Select primary color for buttons"></sq-color-picker>
    <sq-color-picker [context]="context" [defaultColor]="secondary" property="secondaryColor" label="Secondary" tooltip="Select secondary color used by buttons"></sq-color-picker>
  </div>

  <!-- color variants -->
  <details id="colors-variants" class="mb-2 mt-2">
    <summary>Colors variants</summary>
    <div class="card p-2">
      <div class="d-flex flex-column">
        <h6>Brand variants</h6>
        <div class="d-flex gap-1">
          <div *ngFor="let color of [100,200,300,400,500]" class="d-flex rounded-1 justify-content-center align-items-center" [style]="'width: 35px;height: 35px;background-color: var(--brand-'+ color + '); color: var(--switch-' + color + ');'">{{ color }}</div>
        </div>
      </div>
      <div class="d-flex flex-column mt-1">
        <h6>Primary variants</h6>
        <div class="d-flex gap-1">
          <div *ngFor="let color of [100,200,300,400,500]" class="d-flex rounded-1 justify-content-center align-items-center" [style]="'width: 35px;height: 35px;background-color: var(--primary-'+ color + '); color: var(--switch-' + color + ');'">{{ color }}</div>
        </div>
      </div>
      <div class="d-flex flex-column mt-1">
        <h6>Secondary variants</h6>
        <div class="d-flex gap-1">
          <div *ngFor="let color of [100,200,300,400,500]" class="d-flex rounded-1 justify-content-center align-items-center" [style]="'width: 35px;height: 35px;background-color: var(--secondary-'+ color + '); color: var(--switch-' + color + ');'">{{ color }}</div>
        </div>
      </div>
    </div>
  </details>

  <hr/>

  <div class="d-flex flex-column gap-1">
    <h6>Nav/Card Header Text Color</h6>
    <div class="d-flex gap-1">
      <div *ngFor="let color of [1,2,3];let index = index;" style="flex-basis: 33%" class="form-check form-check-inline d-flex align-items-center gap-1" >
        <input name="textColorOptions" class="form-check-input" type="radio" [ngModel]="context.config.textColor" value="text{{ index+1 }}" (click)="setTextColor(index)">
        <div class="rounded-1 p-1" [style]="'background-color: var(--brand); color: var(--text'+color+');'">{{ textColors[index] }}</div>
      </div>
    </div>
  </div>

  <hr/>

  <sq-img-selector [context]="context" param="backgroundImage" description="Background image" class="d-block mb-2"></sq-img-selector>

  <label for="font">Font</label>
  <select id="font" class="form-select mb-2" [(ngModel)]="context.config.fontFamily" (ngModelChange)="context.configChanged()">
    <option *ngFor="let font of fonts" [ngValue]="font.value">{{font.name}}</option>
  </select>
  `
})
export class GlobalConfiguratorComponent implements OnInit {
  @Input() context: ConfiguratorContext;

  fonts = [
    {name: "System (default)", value: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'},
    {name: "Serif", value: "Georgia, serif"},
    {name: "Cursive", value: "cursive"},
    {name: "Monospace", value: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'},
    {name: "Fantasy", value: "fantasy"}
  ]

  textColors = ['darker', 'neutral', 'lighter'];

  background?;
  gradient?;

  brand?;
  primary?;
  secondary?;

  ngOnInit(): void {
    this.background = getComputedStyle(document.body).getPropertyValue('--background-color').trim();
    this.gradient = getComputedStyle(document.body).getPropertyValue('--gradient-color').trim();

    this.brand = getComputedStyle(document.body).getPropertyValue('--brand-300').trim();
    this.primary = getComputedStyle(document.body).getPropertyValue('--primary-300').trim();
    this.secondary = getComputedStyle(document.body).getPropertyValue('--secondary-300').trim();
  }

  setTextColor(index: number) {
    this.context.config.textColor = `text${index+1}`;
    this.context.configChanged();
  }
}
