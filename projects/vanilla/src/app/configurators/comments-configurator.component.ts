import { Component, Input } from "@angular/core";
import { ComponentConfig, ConfiguratorContext } from "@sinequa/ngx-ui-builder";

@Component({
  selector: "sq-comments-configurator",
  template: `
  <div role="alert" class="alert alert-warning">This component requires special configuration on the backend. Please check the documentation: https://sinequa.github.io/sba-angular/modules/components/comments.html</div>

  <div class="form-group">
      <label for="title">Title <span *ngIf="config.title!.startsWith('msg#')">("{{config.title | sqMessage}}")</span></label>
      <input type="text" class="form-control mb-2" id="title" autocomplete="off" spellcheck="off" [(ngModel)]="config.title" (ngModelChangeDebounced)="configChanged()">

      <sq-icon-selector class="d-block mb-2" [config]="config" (configChanged)="configChanged()"></sq-icon-selector>

      <sq-checkbox [context]="context" property="collapsible" label="Collapsible"></sq-checkbox>
  </div>
  `
})
export class CommentsConfiguratorComponent {
  @Input() context: ConfiguratorContext;

  get config(): ComponentConfig {
    return this.context.config;
  }

  ngOnChanges(): void {
    // Initialize the config (when a new facet is created)
    if(!this.config.title) {
        this.config.title = "Comments";
        this.config.icon = "fas fa-comments";
        this.config.condition = {
          field: "id",
          type: "equals",
          values: [{value: "", not: true}]
        };
        this.config.classes = "mb-3";
    }
  }

  configChanged() {
      this.context.configChanged();
  }

}
