import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IntlModule } from "@sinequa/core/intl";
import { CheckboxControlComponent } from "./checkbox-control.component";
import { FacetConfiguratorComponent } from "./facet-configurator.component";
import { MetadataConfiguratorComponent } from "./metadata-configurator.component";
import { SearchFormConfiguratorComponent } from "./search-form-configurator.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IntlModule
    ],
    declarations: [
        FacetConfiguratorComponent,
        MetadataConfiguratorComponent,
        CheckboxControlComponent,
        SearchFormConfiguratorComponent
    ],
    exports: [
        FacetConfiguratorComponent,
        MetadataConfiguratorComponent,
        CheckboxControlComponent,
        SearchFormConfiguratorComponent
    ]
})
export class ConfiguratorsModule {}