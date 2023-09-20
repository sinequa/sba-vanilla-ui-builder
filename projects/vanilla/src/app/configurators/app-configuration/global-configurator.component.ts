import { Component, Input, OnInit } from "@angular/core";
import { PreviewHighlightColors } from "@sinequa/components/preview";
import { AppService } from "@sinequa/core/app-utils";
import { ConfiguratorContext } from "@sinequa/ngx-ui-builder";
import { GlobalService } from "./global.service";
import { PREVIEW_HIGHLIGHTS } from "projects/vanilla/src/config";

@Component({
  selector: "sq-global-configurator",
  template: `
  <div role="alert" class="alert alert-warning">This component controls global styling options (colors, fonts, etc.). The component itself has no visible appearance.</div>

  <div class="d-flex gap-2">
    <uib-color-picker [context]="context" [defaultColor]="background" property="backgroundColor" label="Background" tooltip="Select the background color"></uib-color-picker>
    <uib-color-picker [context]="context" [defaultColor]="gradient" property="gradientColor" label="Gradient" tooltip="Select last color to create a gradient background"></uib-color-picker>
  </div>

  <div class="d-flex gap-2">
    <uib-color-picker [context]="context" [defaultColor]="brand" property="brandingColor" label="Branding" tooltip="Select color for navigation and facet bar"></uib-color-picker>
    <uib-color-picker [context]="context" [defaultColor]="primary" property="primaryColor" label="Primary" tooltip="Select primary color for buttons"></uib-color-picker>
    <uib-color-picker [context]="context" [defaultColor]="secondary" property="secondaryColor" label="Secondary" tooltip="Select secondary color used by buttons"></uib-color-picker>
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

  <div>
    <label for="appName" class="form-label">App Title</label>
    <input type="text" id="appName" class="form-control" [(ngModel)]="context.config.appName" (ngModelChangeDebounced)="context.configChanged()" autocomplete="off" aria-describedby="appNameHelp">
    <div id="appNameHelp" class="form-text">Set the application's name displayed on the browser tab</div>
  </div>

  <hr/>

  <uib-image-selector [sizeable]="false" [context]="context" param="backgroundImage" description="Background image" class="d-block mb-2"></uib-image-selector>

  <label for="font">Font</label>
  <select id="font" class="form-select mb-2" [(ngModel)]="context.config.fontFamily" (ngModelChange)="context.configChanged()">
    <option *ngFor="let font of fonts" [ngValue]="font.value">{{font.name}}</option>
  </select>

  <hr/>

  <div class="d-flex flex-column gap-1">
    <h6>Entities Highlights</h6>
    <div *ngFor="let entity of context.config.entityHighlights" class="row mb-2">
      <strong>{{entity.name}}</strong>
      <div class="col-6">
        <label for="{{entity}}-color" class="form-label">Color</label>
        <input type="color" id="{{entity}}-color" class="form-control" [(ngModel)]="entity.color" (ngModelChangeDebounced)="context.configChanged()">
      </div>
      <div class="col-6">
        <label for="{{entity}}-bgColor" class="form-label">Background Color</label>
        <input type="color" id="{{entity}}-bgColor" class="form-control" [(ngModel)]="entity.bgColor" (ngModelChangeDebounced)="context.configChanged()">
      </div>
    </div>
  </div>
  `
})
export class GlobalConfiguratorComponent implements OnInit {
  @Input() context: ConfiguratorContext;

  fonts = [
    { name: "System (default)", value: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"' },
    { name: "Serif", value: "Georgia, serif" },
    { name: "Cursive", value: "cursive" },
    { name: "Monospace", value: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' },
    { name: "Fantasy", value: "fantasy" }
  ]

  textColors = ['darker', 'neutral', 'lighter'];

  background?;
  gradient?;

  brand?;
  primary?;
  secondary?;


  constructor(private appService: AppService,
    public globalService: GlobalService) { }

  ngOnInit(): void {
    this.background = getComputedStyle(document.body).getPropertyValue('--background-color').trim();
    this.gradient = getComputedStyle(document.body).getPropertyValue('--gradient-color').trim();

    this.brand = getComputedStyle(document.body).getPropertyValue('--brand-300').trim();
    this.primary = getComputedStyle(document.body).getPropertyValue('--primary-300').trim();
    this.secondary = getComputedStyle(document.body).getPropertyValue('--secondary-300').trim();

    this.setupHighlights();
  }

  setTextColor(index: number) {
    this.context.config.textColor = `text${index + 1}`;
    this.context.configChanged();
  }

  changeTheme(event) {
    const checked = event.target.checked;
    this.context.config.theme = checked;
    this.context.configChanged();

    document.body.classList.toggle("sinequa");
  }

  private setupHighlights() {
    if (!this.context.config.entityHighlights) {
      this.context.config.entityHighlights = [...PREVIEW_HIGHLIGHTS];
    }

    const preview = this.appService.app?.preview?.split(',')?.[0];
    if (preview) {
      const entities = this.appService.getWebService<any>(preview)?.highlights?.split(",") || [];
      const length = this.context.config.entityHighlights.length;

      // add any entities from the preview that aren't contained in context.config.entityHighlights
      entities.filter((e: string) => !this.context.config.entityHighlights.find((h: PreviewHighlightColors) => h.name === e))
        .forEach((e: string) => this.context.config.entityHighlights.push({ name: e }));
        if (length < this.context.config.entityHighlights.length) {
          this.context.configChanged();
        }
    }
  }
}
