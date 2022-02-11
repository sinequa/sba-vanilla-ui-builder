import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IntlModule } from "@sinequa/core/intl";
import { FacetConfiguratorComponent } from "./facet-configurator.component";
import { MetadataConfiguratorComponent } from "./metadata-configurator.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IntlModule
    ],
    declarations: [
        FacetConfiguratorComponent,
        MetadataConfiguratorComponent
    ],
    exports: [
        FacetConfiguratorComponent,
        MetadataConfiguratorComponent
    ]
})
export class ConfiguratorsModule {}