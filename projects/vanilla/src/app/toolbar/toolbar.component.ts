import { Component } from "@angular/core";
import { AppService } from "@sinequa/core/app-utils";
import { NotificationsService } from "@sinequa/core/notification";
import { DownloadWebService, JsonMethodPluginService } from "@sinequa/core/web-services";
import { ConfigService, ConfigurableService } from "@sinequa/ngx-ui-builder";
import { throwError } from "rxjs";
import { catchError, finalize, switchMap } from "rxjs/operators";
import { AppConfigService } from "../app-config.service";

@Component({
  selector: 'sq-ui-builder-toolbar',
  templateUrl: './toolbar.component.html',
  styles: [`
    .dropdown-item {
      width: calc(100% - .5rem);
    }
    .dropdown-divider {
      margin: 0;
    }
  `]
})
export class ToolbarComponent {

  constructor(
    public appService: AppService,
    public configService: ConfigService,
    public configurableService: ConfigurableService,
    public pluginService: JsonMethodPluginService,
    public downloadService: DownloadWebService,
    public notificationsService: NotificationsService,
    public appConfigService: AppConfigService
  ){}

  exportInProgress: boolean;
  exportApp() {
    if(this.exportInProgress) return;
    this.exportInProgress = true;
    const workspaceName = this.appService.app?.workspaceApp.split('/')[2]; // '/_sba/ws11.5.1.69/projects/vanilla-search/'
    if(workspaceName) {
      const config = this.configService.getAllConfig();
      const download$ = this.pluginService.post("MakeStaticWorkspace", {workspaceName, config}, {params: {noNotify: true}, responseType: "json"})
        .pipe(
          catchError(err => {
            this.notificationsService.error("Make sure you install the following JSON method plugin: https://github.com/sinequa/sba-vanilla-ui-builder/blob/develop/UiBuilderPlugin.cs")
            return throwError(err);
          }),
          switchMap(value => {
            const zipName = value?.zipName;
            if(zipName) {
              return this.pluginService.post("DownloadExportedWorkspace", {workspaceName, zipName}, {observe: 'response', responseType: 'blob'});
            }
            throw "Missing Zip file name from response";
          }),
          finalize(() => this.exportInProgress = false)
        );
      this.downloadService.download(download$).subscribe();
    }
  }

  exportConfig() {
    this.configService.exportConfiguration();
  }

  importConfig(importConfigElement: HTMLInputElement) {
    const file = importConfigElement.files?.[0];
    if(file) {
      const reader = new FileReader();
      reader.onload = () => {
        const config = JSON.parse(reader.result as string);
        this.configService.set(config);
      }
      reader.readAsText(file, 'utf-8');
    }
  }

  resetConfig() {
    this.appConfigService.reset();
  }

  openGlobalConfigurator() {
    // Simulate click on global component
    this.configurableService.clickConfigurable({
      id: "global",
      parentId: "", // parentId would be required to duplicate or remove the component, which is not applicable here
      zone: "",
      removeSelected: () => {}, // These callbacks do nothing because this is not a real click on a configurable component
      removeEdited: () => {}
    })
  }

}
