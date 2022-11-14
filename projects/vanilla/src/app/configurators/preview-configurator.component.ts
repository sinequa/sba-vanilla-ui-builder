import { Component, Input, OnInit } from "@angular/core";
import { AppService } from "@sinequa/core/app-utils";
import { ConfiguratorContext } from "@sinequa/ngx-ui-builder";

@Component({
  selector: 'sq-preview-configurator',
  template: `
  <h6>Preview options</h6>
  <label for="height">Preview height</label>
  <input type="number" class="form-control mb-2" id="height" autocomplete="off" spellcheck="off" min="0" max="10000" [(ngModel)]="context.config.height" (ngModelChangeDebounced)="context.configChanged()">

  <sq-checkbox [context]="context" property="highlightActions" label="Enable highlight options"></sq-checkbox>
  <sq-checkbox [context]="context" property="highlightEntities" label="Highlight entities by default"></sq-checkbox>
  <sq-checkbox [context]="context" property="highlightExtracts" label="Highlight extracts by default"></sq-checkbox>

  <label>Extract options</label>
  <p class="small text-muted m-0">Select which type of extracts should be highlighted.</p>
  <sq-select-multi [options]="extractOptions" [(ngModel)]="context.config.extracts" (ngModelChange)="context.configChanged()" valueField="value" displayField="display">
  </sq-select-multi>

  <h6 class="mt-2">Metadata options</h6>

  <sq-checkbox [context]="context" property="metadataShowTitle" label="Show metadata title"></sq-checkbox>
  <sq-checkbox [context]="context" property="metadataShowIcon" label="Show metadata icon"></sq-checkbox>
  <sq-checkbox [context]="context" property="metadataClickable" label="Metadata clickable"></sq-checkbox>

  <label>Metadata</label>
  <p class="small text-muted m-0">Select which metadata to display in the preview header. The order of the metadata can be changed by dragging the following options up and down.</p>
  <sq-select-multi [options]="metadata" [enableReorder]="true" [(ngModel)]="context.config.metadata" (ngModelChange)="context.configChanged()">
  </sq-select-multi>

  `
})
export class PreviewConfiguratorComponent implements OnInit {
  @Input() context: ConfiguratorContext;
  @Input() metadata: string[];

  highlights: string[];
  extractOptions = [
    {value: "matchlocations", display: "Highlight matched keywords"},
    {value: "extractslocations", display: "Highlight relevant extracts"},
    {value: "matchingpassages", display: "Highlight relevant passages (available if Neural Search is activated)"}
  ]

  constructor(
    public appService: AppService
  ){}

  ngOnInit(): void {
    this.highlights = this.appService.getWebService<any>(this.appService.app?.preview || "_preview")?.highlights.split(',') || []
  }

}
