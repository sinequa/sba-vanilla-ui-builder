import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IntlModule } from "@sinequa/core/intl";
import { CheckboxComponent, ColorPickerComponent, ImageSelectorComponent, MultiSelectComponent, NgModelChangeDebouncedDirective, uibModule } from "@sinequa/ngx-ui-builder";
import { FacetHeaderConfiguratorComponent } from "./facet-header-configurator.component"
import { FacetConfiguratorComponent } from "./facet-configurator.component";
import { FacetMultiConfiguratorComponent } from "./facet-multi-configurator.component";
import { HomeFacetConfiguratorComponent } from "./home-facet-configurator.component";
import { GlobalConfiguratorComponent } from "./app-configuration/global-configurator.component";
import { MenuConfiguratorComponent } from "./menu-configurator.component";
import { MetadataConfiguratorComponent } from "./metadata-configurator.component";
import { PredefinedResultsLayoutComponent } from "./predefined-results-layout.component";
import { PreviewConfiguratorComponent } from "./preview-configurator.component";
import { SearchFormLegacyConfiguratorComponent } from "./search-form-legacy-configurator.component";
import { AdvancedSearchFormConfiguratorComponent } from "./advanced-search-form-configurator.component";
import { ChartConfiguratorComponent } from "./chart-configurator.component";
import { TimelineConfiguratorComponent } from "./timeline-configurator.component";
import { HeatmapConfiguratorComponent } from "./heatmap-configurator.component";
import { SlideBuilderConfiguratorComponent } from "./slide-builder-configurator.component";
import { CommentsConfiguratorComponent } from "./comments-configurator.component";
import { NetworkConfiguratorComponent } from "./network-configurator.component";
import { StringFilterPipe } from "./translations-configuration/string-filter.pipe";
import { TranslationsConfiguratorComponent } from './translations-configuration/translations-configurator.component';
import { TranslationItemComponent } from './translations-configuration/translation-item/translation-item.component';
import { ControlsModule } from "./controls/controls.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IntlModule,
    ControlsModule,

    NgModelChangeDebouncedDirective,
    ColorPickerComponent,
    CheckboxComponent,
    MultiSelectComponent,
    ImageSelectorComponent,
    uibModule
  ],
  declarations: [
    FacetHeaderConfiguratorComponent,
    FacetConfiguratorComponent,
    FacetMultiConfiguratorComponent,
    MetadataConfiguratorComponent,
    SearchFormLegacyConfiguratorComponent,
    AdvancedSearchFormConfiguratorComponent,
    PredefinedResultsLayoutComponent,
    MenuConfiguratorComponent,
    HomeFacetConfiguratorComponent,
    PreviewConfiguratorComponent,
    GlobalConfiguratorComponent,
    ChartConfiguratorComponent,
    TimelineConfiguratorComponent,
    HeatmapConfiguratorComponent,
    SlideBuilderConfiguratorComponent,
    CommentsConfiguratorComponent,
    NetworkConfiguratorComponent,
    TranslationsConfiguratorComponent,
    TranslationItemComponent,
    StringFilterPipe
  ],
  exports: [
    FacetHeaderConfiguratorComponent,
    FacetConfiguratorComponent,
    FacetMultiConfiguratorComponent,
    MetadataConfiguratorComponent,
    SearchFormLegacyConfiguratorComponent,
    AdvancedSearchFormConfiguratorComponent,
    PredefinedResultsLayoutComponent,
    MenuConfiguratorComponent,
    HomeFacetConfiguratorComponent,
    PreviewConfiguratorComponent,
    GlobalConfiguratorComponent,
    ChartConfiguratorComponent,
    TimelineConfiguratorComponent,
    HeatmapConfiguratorComponent,
    SlideBuilderConfiguratorComponent,
    CommentsConfiguratorComponent,
    NetworkConfiguratorComponent,
    TranslationsConfiguratorComponent,
    TranslationItemComponent,
    StringFilterPipe,

    ControlsModule // Export so that controls can be used directly in the application
  ]
})
export class ConfiguratorsModule {}
