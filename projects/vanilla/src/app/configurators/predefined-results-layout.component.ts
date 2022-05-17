import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ComponentConfig, ConfigService } from "@sinequa/ngx-ui-builder";
import { RESULTS_VIEWS_CONFIG } from "../../config";
import { AppConfigService } from "../app-config.service";

@Component({
    selector: 'sq-predefined-results-layouts',
    template: `
<h6>Apply a predefined view:</h6>
<div>
    <button *ngFor="let view of views"
        class="btn btn-outline-primary me-2"
        (click)="applyView(view.config)">
        <i [ngClass]="view.icon"></i> {{view.name}}
    </button>
</div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PredefinedResultsLayoutComponent {

    constructor(
        public appConfigService: AppConfigService,
        public configService: ConfigService
    ){}

    get views() {
        return RESULTS_VIEWS_CONFIG;
    }

    applyView(view: ComponentConfig[]) {
        this.configService.updateConfig(view);
    }

}
