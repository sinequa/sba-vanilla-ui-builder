import { Component, Input, OnInit } from "@angular/core";
import { AppService } from "@sinequa/core/app-utils";
import { ConfiguratorContext } from "@sinequa/ngx-ui-builder";

@Component({
  selector: 'sq-preview-configurator',
  template: `
  <label>Highlights</label>
  <p class="small text-muted m-0">Select which entities are highlighted in the preview text.</p>
  <sq-select-multi [options]="highlights" [(ngModel)]="context.config.filters" (ngModelChange)="context.configChanged()">
  </sq-select-multi>

  <label>Metadata</label>
  <p class="small text-muted m-0">Select which metadata to display in the preview header. The order of the metadata can be changed by dragging the following options up and down.</p>
  <sq-select-multi [options]="metadata" [enableReorder]="true" [(ngModel)]="context.config.metadata" (ngModelChange)="context.configChanged()">
  </sq-select-multi>

  <label for="height">Preview height</label>
  <input type="number" class="form-control mb-2" id="height" autocomplete="off" spellcheck="off" min="0" max="10000" [(ngModel)]="context.config.height" (ngModelChangeDebounced)="context.configChanged()">

  <sq-checkbox [context]="context" property="highlightActions" label="Enable highlight options"></sq-checkbox>
  `
})
export class PreviewConfiguratorComponent implements OnInit {
  @Input() context: ConfiguratorContext;
  @Input() metadata: string[];

  highlights: string[];

  constructor(
    public appService: AppService
  ){}

  ngOnInit(): void {
    this.highlights = this.appService.getWebService<any>(this.appService.app?.preview || "_preview")?.highlights.split(',') || []
  }

}
