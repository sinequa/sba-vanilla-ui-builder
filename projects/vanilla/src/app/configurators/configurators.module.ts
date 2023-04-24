import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IntlModule } from "@sinequa/core/intl";
import { CheckboxComponent, ColorPickerComponent, ImageSelectorComponent, MultiSelectComponent, NgModelChangeDebouncedDirective } from "@sinequa/ngx-ui-builder";
import { FacetHeaderConfiguratorComponent } from "./facet-header-configurator.component"
import { FacetConfiguratorComponent } from "./facet-configurator.component";
import { FacetMultiConfiguratorComponent } from "./facet-multi-configurator.component";
import { HomeFacetConfiguratorComponent } from "./home-facet-configurator.component";
import { GlobalConfiguratorComponent } from "./app-configuration/global-configurator.component";
import { MenuConfiguratorComponent } from "./menu-configurator.component";
import { MetadataConfiguratorComponent } from "./metadata-configurator.component";
import { PredefinedResultsLayoutComponent } from "./predefined-results-layout.component";
import { PreviewConfiguratorComponent } from "./preview-configurator.component";
import { SearchFormConfiguratorComponent } from "./search-form-configurator.component";
import { ChartConfiguratorComponent } from "./chart-configurator.component";
import { TimelineConfiguratorComponent } from "./timeline-configurator.component";
import { HeatmapConfiguratorComponent } from "./heatmap-configurator.component";
import { SlideBuilderConfiguratorComponent } from "./slide-builder-configurator.component";
import { CommentsConfiguratorComponent } from "./comments-configurator.component";
import { NetworkConfiguratorComponent } from "./network-configurator.component";
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
    ImageSelectorComponent
  ],
  declarations: [
    FacetHeaderConfiguratorComponent,
    FacetConfiguratorComponent,
    FacetMultiConfiguratorComponent,
    MetadataConfiguratorComponent,
    SearchFormConfiguratorComponent,
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
    NetworkConfiguratorComponent
  ],
  exports: [
    FacetHeaderConfiguratorComponent,
    FacetConfiguratorComponent,
    FacetMultiConfiguratorComponent,
    MetadataConfiguratorComponent,
    SearchFormConfiguratorComponent,
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

    ControlsModule // Export so that controls can be used directly in the application
  ]
})
export class ConfiguratorsModule {}
