import { Component } from "@angular/core";
import { AppService } from "@sinequa/core/app-utils";
import { NotificationType, NotificationsService } from "@sinequa/core/notification";
import { DownloadWebService, JsonMethodPluginService } from "@sinequa/core/web-services";
import { ConfigService, ConfigurableService } from "@sinequa/ngx-ui-builder";
import { of, throwError } from "rxjs";
import { catchError, finalize, map, switchMap } from "rxjs/operators";
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
    const workspaceName = this.appService.app?.workspaceApp.split('/')[2]; // '/_sba/ws11.5.1.69/projects/vanilla-search/'
    if(workspaceName) {
      this.exportInProgress = true;
      const config = this.configService.getAllConfig();
      this.pluginService.post("MakeStaticWorkspace", { workspaceName, config }, { params: { noNotify: true }, responseType: "json" })
        .pipe(
          catchError(err => {
            this.notificationsService.error("Make sure you install the following JSON method plugin: https://github.com/sinequa/sba-vanilla-ui-builder/blob/develop/UiBuilderPlugin.cs")
            return throwError(err);
          }),
          switchMap((value: any) => {
            const zipName = value?.zipName;
            if (zipName) {
              return this.pluginService.post("DownloadExportedWorkspace", { workspaceName, zipName }, { observe: 'response', responseType: 'blob' })
                .pipe(map(x => this.downloadService.download(of(x), zipName)));
            }
            throw "Missing Zip file name from response";
          }),
          finalize(() => this.exportInProgress = false)
        ).subscribe();
    } else {
      this.notificationsService.notify(NotificationType.Error, "No workspace name set!");
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

  openTranslationsConfigurator() {
    // Simulate click on global component
    this.configurableService.clickConfigurable({
      id: "translations",
      parentId: "", // parentId would be required to duplicate or remove the component, which is not applicable here
      zone: "",
      removeSelected: () => {}, // These callbacks do nothing because this is not a real click on a configurable component
      removeEdited: () => {}
    })
  }

}
