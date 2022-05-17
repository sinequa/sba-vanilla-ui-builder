import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IntlModule } from "@sinequa/core/intl";
import { UtilsModule } from "@sinequa/ngx-ui-builder";
import { CheckboxControlComponent } from "./checkbox-control.component";
import { FacetConfiguratorComponent } from "./facet-configurator.component";
import { FacetMultiConfiguratorComponent } from "./facet-multi-configurator.component";
import { HomeFacetConfigurator } from "./home-facet-configurator.component";
import { IconSelectorComponent } from "./icon-selector.component";
import { ImgSelectorComponent } from "./img-selector.component";
import { MenuConfiguratorComponent } from "./menu-configurator.component";
import { MetadataConfiguratorComponent } from "./metadata-configurator.component";
import { PredefinedResultsLayoutComponent } from "./predefined-results-layout.component";
import { PreviewConfiguratorComponent } from "./preview-configurator.component";
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
        ImgSelectorComponent,
        MenuConfiguratorComponent,
        HomeFacetConfigurator,
        PreviewConfiguratorComponent
    ],
    exports: [
        FacetConfiguratorComponent,
        FacetMultiConfiguratorComponent,
        MetadataConfiguratorComponent,
        CheckboxControlComponent,
        SearchFormConfiguratorComponent,
        PredefinedResultsLayoutComponent,
        IconSelectorComponent,
        ImgSelectorComponent,
        MenuConfiguratorComponent,
        HomeFacetConfigurator,
        PreviewConfiguratorComponent
    ]
})
export class ConfiguratorsModule {}
