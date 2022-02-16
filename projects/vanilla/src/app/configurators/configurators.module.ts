import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IntlModule } from "@sinequa/core/intl";
import { CheckboxControlComponent } from "./checkbox-control.component";
import { FacetConfiguratorComponent } from "./facet-configurator.component";
import { FacetMultiConfiguratorComponent } from "./facet-multi-configurator.component";
import { IconSelectorComponent } from "./icon-selector.component";
import { MetadataConfiguratorComponent } from "./metadata-configurator.component";
import { PredefinedResultsLayoutComponent } from "./predefined-results-layout.component";
import { SearchFormConfiguratorComponent } from "./search-form-configurator.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IntlModule
    ],
    declarations: [
        FacetConfiguratorComponent,
        FacetMultiConfiguratorComponent,
        MetadataConfiguratorComponent,
        CheckboxControlComponent,
        SearchFormConfiguratorComponent,
        PredefinedResultsLayoutComponent,
        IconSelectorComponent
    ],
    exports: [
        FacetConfiguratorComponent,
        FacetMultiConfiguratorComponent,
        MetadataConfiguratorComponent,
        CheckboxControlComponent,
        SearchFormConfiguratorComponent,
        PredefinedResultsLayoutComponent,
        IconSelectorComponent
    ]
})
export class ConfiguratorsModule {}