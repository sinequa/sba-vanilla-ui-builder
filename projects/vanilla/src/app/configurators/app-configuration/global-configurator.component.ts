import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { PreviewHighlightColors } from "@sinequa/components/preview";
import { AppService } from "@sinequa/core/app-utils";
import { ConfiguratorContext } from "@sinequa/ngx-ui-builder";

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

  <uib-image-selector [sizeable]="false" [context]="context" param="favicon" description="Favicon" class="d-block mb-2"></uib-image-selector>

  <hr/>

  <uib-image-selector [sizeable]="false" [context]="context" param="backgroundImage" description="Background image" class="d-block mb-2"></uib-image-selector>

  <label for="font">Font</label>
  <select id="font" class="form-select mb-2" [(ngModel)]="context.config.fontFamily" (ngModelChange)="context.configChanged()">
    <option *ngFor="let font of fonts" [ngValue]="font.value">{{font.name}}</option>
  </select>

  <hr/>

  <h6>Search Layout</h6>

  <p class="small text-muted">The search page has 3 columns (facets, results, preview) sized using the <a href="https://getbootstrap.com/docs/5.3/layout/grid/" target="_blank">Bootstrap grid system</a>. Use the classes below to control the width of these columns at each screen size breakpoint.</p>

  <uib-checkbox [context]="context" property="layout.fullWidth" label="Full width"></uib-checkbox>
  <uib-checkbox [context]="context" property="layout.reversed" label="Reversed tabs"></uib-checkbox>
  <uib-checkbox [context]="context" property="layout.hidePreview" label="Hide preview when no selected document" uib-tooltip="It will adapt the col numbers for the results when there are no opened document"></uib-checkbox>

  <label class="form-label">Facets tab</label>
  <div class="row mb-2">
    <div class="col-3">
      <label for="facets-sm">col-sm</label>
      <input type="number" id="facets-sm" class="form-control" [(ngModel)]="context.config.layout.facets.sm" (ngModelChangeDebounced)="context.configChanged()" min="0" max="12" step="1" [disabled]="context.config.layout.facets.customClassOnly">
    </div>
    <div class="col-3">
      <label for="facets-md">col-md</label>
      <input type="number" id="facets-md" class="form-control" [(ngModel)]="context.config.layout.facets.md" (ngModelChangeDebounced)="context.configChanged()" min="0" max="12" step="1" [disabled]="context.config.layout.facets.customClassOnly">
    </div>
    <div class="col-3">
      <label for="facets-lg">col-lg</label>
      <input type="number" id="facets-lg" class="form-control" [(ngModel)]="context.config.layout.facets.lg" (ngModelChangeDebounced)="context.configChanged()" min="0" max="12" step="1" [disabled]="context.config.layout.facets.customClassOnly">
    </div>
    <div class="col-3">
      <label for="facets-xl">col-xl</label>
      <input type="number" id="facets-xl" class="form-control" [(ngModel)]="context.config.layout.facets.xl" (ngModelChangeDebounced)="context.configChanged()" min="0" max="12" step="1" [disabled]="context.config.layout.facets.customClassOnly">
    </div>
  </div>
  <div class="row mb-2">
    <div class="col-12">
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="facets-classes" [(ngModel)]="context.config.layout.facets.customClassOnly" (ngModelChange)="context.configChanged()">
        <label class="form-check-label" for="facets-classes">Custom classes only</label>
      </div>
      <input type="text" id="facets-xl" class="form-control" [(ngModel)]="context.config.layout.facets.customClass" (ngModelChangeDebounced)="context.configChanged()" placeholder="Custom classes">
    </div>
  </div>

  <label class="form-label">Results tab</label>
  <div class="row mb-2">
    <div class="col-3">
      <label for="results-sm">col-sm</label>
      <input type="number" id="results-sm" class="form-control" [(ngModel)]="context.config.layout.results.sm" (ngModelChangeDebounced)="context.configChanged()" min="0" max="12" step="1" [disabled]="context.config.layout.results.customClassOnly">
    </div>
    <div class="col-3">
      <label for="results-md">col-md</label>
      <input type="number" id="results-md" class="form-control" [(ngModel)]="context.config.layout.results.md" (ngModelChangeDebounced)="context.configChanged()" min="0" max="12" step="1" [disabled]="context.config.layout.results.customClassOnly">
    </div>
    <div class="col-3">
      <label for="results-lg">col-lg</label>
      <input type="number" id="results-lg" class="form-control" [(ngModel)]="context.config.layout.results.lg" (ngModelChangeDebounced)="context.configChanged()" min="0" max="12" step="1" [disabled]="context.config.layout.results.customClassOnly">
    </div>
    <div class="col-3">
      <label for="results-xl">col-xl</label>
      <input type="number" id="results-xl" class="form-control" [(ngModel)]="context.config.layout.results.xl" (ngModelChangeDebounced)="context.configChanged()" min="0" max="12" step="1" [disabled]="context.config.layout.results.customClassOnly">
    </div>
  </div>
  <div class="row mb-2">
    <div class="col-12">
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="results-classes" [(ngModel)]="context.config.layout.results.customClassOnly" (ngModelChange)="context.configChanged()">
        <label class="form-check-label" for="results-classes">Custom classes only</label>
      </div>
      <input type="text" id="facets-xl" class="form-control" [(ngModel)]="context.config.layout.results.customClass" (ngModelChangeDebounced)="context.configChanged()" placeholder="Custom classes">
    </div>
  </div>

  <label class="form-label">Preview tab</label>
  <div class="row mb-2">
    <div class="col-3">
      <label for="preview-sm">col-sm</label>
      <input type="number" id="preview-sm" class="form-control" [(ngModel)]="context.config.layout.preview.sm" (ngModelChangeDebounced)="context.configChanged()" min="0" max="12" step="1" [disabled]="context.config.layout.preview.customClassOnly">
    </div>
    <div class="col-3">
      <label for="preview-md">col-md</label>
      <input type="number" id="preview-md" class="form-control" [(ngModel)]="context.config.layout.preview.md" (ngModelChangeDebounced)="context.configChanged()" min="0" max="12" step="1" [disabled]="context.config.layout.preview.customClassOnly">
    </div>
    <div class="col-3">
      <label for="preview-lg">col-lg</label>
      <input type="number" id="preview-lg" class="form-control" [(ngModel)]="context.config.layout.preview.lg" (ngModelChangeDebounced)="context.configChanged()" min="0" max="12" step="1" [disabled]="context.config.layout.preview.customClassOnly">
    </div>
    <div class="col-3">
      <label for="preview-xl">col-xl</label>
      <input type="number" id="preview-xl" class="form-control" [(ngModel)]="context.config.layout.preview.xl" (ngModelChangeDebounced)="context.configChanged()" min="0" max="12" step="1" [disabled]="context.config.layout.preview.customClassOnly">
    </div>
  </div>
  <div class="row mb-2">
    <div class="col-12">
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="preview-classes" [(ngModel)]="context.config.layout.preview.customClassOnly" (ngModelChange)="context.configChanged()">
        <label class="form-check-label" for="preview-classes">Custom classes only</label>
      </div>
      <input type="text" id="facets-xl" class="form-control" [(ngModel)]="context.config.layout.preview.customClass" (ngModelChangeDebounced)="context.configChanged()" placeholder="Custom classes">
    </div>
  </div>

  <hr/>

  <div class="d-flex flex-column gap-1">
    <h6>Entities Highlights</h6>
    <small class="text-muted">Entity highlights must be configured in the preview web service in the Sinequa administration UI</small>
    <div *ngFor="let entity of context.config.entityHighlights" class="row mb-2">
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="{{entity}}-enabled" [(ngModel)]="entity.$enabled" (ngModelChangeDebounced)="enableHighlight(entity)">
        <label class="form-check-label" for="excludable">{{entity.name}}</label>
      </div>
      <div class="col-6" *ngIf="entity.$enabled">
        <label for="{{entity}}-color" class="form-label">Color</label>
        <input type="color" id="{{entity}}-color" class="form-control" [(ngModel)]="entity.color" (ngModelChangeDebounced)="context.configChanged()">
      </div>
      <div class="col-6" *ngIf="entity.$enabled">
        <label for="{{entity}}-bgColor" class="form-label">Background Color</label>
        <input type="color" id="{{entity}}-bgColor" class="form-control" [(ngModel)]="entity.bgColor" (ngModelChangeDebounced)="context.configChanged()">
      </div>
    </div>
  </div>
  `
})
export class GlobalConfiguratorComponent implements OnInit, OnChanges {
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

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    this.background = getComputedStyle(document.body).getPropertyValue('--background-color').trim();
    this.gradient = getComputedStyle(document.body).getPropertyValue('--gradient-color').trim();

    this.brand = getComputedStyle(document.body).getPropertyValue('--brand-300').trim();
    this.primary = getComputedStyle(document.body).getPropertyValue('--primary-300').trim();
    this.secondary = getComputedStyle(document.body).getPropertyValue('--secondary-300').trim();

    this.setupHighlights();
  }

  ngOnChanges(): void {
    if (this.context) {
      if (!this.context.config.layout) this.context.config.layout = {};
      if (!this.context.config.layout.facets) this.context.config.layout.facets = {};
      if (!this.context.config.layout.results) this.context.config.layout.results = {};
      if (!this.context.config.layout.preview) this.context.config.layout.preview = {};
    }
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

  enableHighlight(highlight: PreviewHighlightColors) {
    if (!highlight['$enabled']) {
      highlight.bgColor = undefined;
      highlight.color = undefined;
    }
    this.context.configChanged();
  }

  private setupHighlights() {
    const preview = this.appService.app?.preview?.split(',')?.[0];
    if (preview) {
      const entities = this.appService.getWebService<any>(preview)?.highlights?.split(",") || [];

      // add any entities from the preview that aren't contained in context.config.entityHighlights
      const newEntities = entities.filter((e: string) => !this.context.config.entityHighlights.find((h: PreviewHighlightColors) => h.name === e));
      const removedEntities = this.context.config.entityHighlights.filter((h: PreviewHighlightColors) => !entities.find((e: string) => e === h.name));

      if (newEntities.length) newEntities.forEach((e: string) => this.context.config.entityHighlights.push({ name: e, $enabled: true }));
      if (removedEntities.length) removedEntities.forEach((e: string) => {
        const item = this.context.config.entityHighlights.find((h: PreviewHighlightColors) => h.name === e);
        const index = this.context.config.entityHighlights.indexOf(item);
        this.context.config.entityHighlights.splice(index, 1);
      });

      if (newEntities.length || removedEntities.length) {
        this.context.configChanged();
      }
    }
  }
}
