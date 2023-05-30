import { Component, Input, OnInit } from "@angular/core";
import { AppService } from "@sinequa/core/app-utils";
import { ConfiguratorContext } from "@sinequa/ngx-ui-builder";

@Component({
  selector: 'sq-preview-configurator',
  template: `
  <h6>Preview options</h6>

  <uib-checkbox [context]="context" property="highlightActions" label="Show Highlight Actions" uib-tooltip="Should the <strong>Actions</strong> buttons will be displayed?"></uib-checkbox>
  <uib-checkbox [context]="context" property="highlightEntities" label="Highlight entities by default" uib-tooltip="This setting will be overridden by the user settings"></uib-checkbox>
  <uib-checkbox [context]="context" property="highlightExtracts" label="Highlight extracts by default" uib-tooltip="This setting will be overridden by the user settings"></uib-checkbox>

  <label>Extract options</label>
  <p class="small text-muted m-0">Select which type of extracts should be highlighted.</p>
  <uib-multi-selector [options]="extractOptions" [(ngModel)]="context.config.extracts" (ngModelChange)="context.configChanged()" valueField="value" displayField="display">
  </uib-multi-selector>

  <h6 class="mt-2">Metadata options</h6>

  <uib-checkbox [context]="context" property="metadataShowTitle" label="Show metadata title"></uib-checkbox>
  <uib-checkbox [context]="context" property="metadataShowIcon" label="Show metadata icon"></uib-checkbox>
  <uib-checkbox [context]="context" property="metadataClickable" label="Metadata clickable"></uib-checkbox>

  <label>Metadata</label>
  <p class="small text-muted m-0">Select which metadata to display in the preview header. The order of the metadata can be changed by dragging the following options up and down.</p>
  <uib-multi-selector [options]="metadata" [enableReorder]="true" [(ngModel)]="context.config.metadata" (ngModelChange)="context.configChanged()">
  </uib-multi-selector>

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
