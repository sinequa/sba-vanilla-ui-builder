import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IntlModule } from "@sinequa/core/intl";
import { FacetConfiguratorComponent } from "./facet-configurator.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IntlModule
    ],
    declarations: [
        FacetConfiguratorComponent
    ],
    exports: [
        FacetConfiguratorComponent
    ]
})
export class ConfiguratorsModule {}