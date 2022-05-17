import { Component, Input, OnInit } from "@angular/core";
import { AppService } from "@sinequa/core/app-utils";
import { ConfiguratorContext } from "@sinequa/ngx-ui-builder";

@Component({
  selector: 'sq-preview-configurator',
  template: `

  <label for="preview-highlights">Highlights</label>
  <select id="preview-highlights" class="form-select mb-1" [(ngModel)]="context.config.filters" (ngModelChange)="context.configChanged()" multiple>
    <option *ngFor="let a of highlights" [ngValue]="a">{{a}}</option>
  </select>

  <label for="preview-metadata">Metadata</label>
  <select id="preview-metadata" class="form-select mb-1" [(ngModel)]="context.config.metadata" (ngModelChange)="context.configChanged()" multiple>
    <option *ngFor="let a of metadata" [ngValue]="a">{{a}}</option>
  </select>

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
