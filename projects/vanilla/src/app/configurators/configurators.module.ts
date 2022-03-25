import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IntlModule } from "@sinequa/core/intl";
import { UtilsModule } from "ngx-ui-builder";
import { CheckboxControlComponent } from "./checkbox-control.component";
import { FacetConfiguratorComponent } from "./facet-configurator.component";
import { FacetMultiConfiguratorComponent } from "./facet-multi-configurator.component";
import { IconSelectorComponent } from "./icon-selector.component";
import { ImgSelectorComponent } from "./img-selector.component";
import { MetadataConfiguratorComponent } from "./metadata-configurator.component";
import { PredefinedResultsLayoutComponent } from "./predefined-results-layout.component";
import { SearchFormConfiguratorComponent } from "./search-form-configurator.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IntlModule,
        UtilsModule
    ],
    declarations: [
        FacetConfiguratorComponent,
        FacetMultiConfiguratorComponent,
        MetadataConfiguratorComponent,
        CheckboxControlComponent,
        SearchFormConfiguratorComponent,
        PredefinedResultsLayoutComponent,
        IconSelectorComponent,
        ImgSelectorComponent
    ],
    exports: [
        FacetConfiguratorComponent,
        FacetMultiConfiguratorComponent,
        MetadataConfiguratorComponent,
        CheckboxControlComponent,
        SearchFormConfiguratorComponent,
        PredefinedResultsLayoutComponent,
        IconSelectorComponent,
        ImgSelectorComponent
    ]
})
export class ConfiguratorsModule {}