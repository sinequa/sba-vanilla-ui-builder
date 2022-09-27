import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IntlModule } from "@sinequa/core/intl";
import { UtilsModule } from "@sinequa/ngx-ui-builder";
import { ColorPickerModule } from "ngx-color-picker";
import { CheckboxControlComponent } from "./checkbox-control.component";
import { ColorPickerControlComponent } from "./color-picker-control.component";
import { FacetConfiguratorComponent } from "./facet-configurator.component";
import { FacetMultiConfiguratorComponent } from "./facet-multi-configurator.component";
import { HomeFacetConfiguratorComponent } from "./home-facet-configurator.component";
import { GlobalConfiguratorComponent } from "./global-configurator.component";
import { IconSelectorComponent } from "./icon-selector.component";
import { ImgSelectorComponent } from "./img-selector.component";
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

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IntlModule,
        UtilsModule,
        ColorPickerModule
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
        HomeFacetConfiguratorComponent,
        PreviewConfiguratorComponent,
        ColorPickerControlComponent,
        GlobalConfiguratorComponent,
        ChartConfiguratorComponent,
        TimelineConfiguratorComponent,
        HeatmapConfiguratorComponent,
        SlideBuilderConfiguratorComponent,
        CommentsConfiguratorComponent,
        NetworkConfiguratorComponent
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
        HomeFacetConfiguratorComponent,
        PreviewConfiguratorComponent,
        ColorPickerControlComponent,
        GlobalConfiguratorComponent,
        ChartConfiguratorComponent,
        TimelineConfiguratorComponent,
        HeatmapConfiguratorComponent,
        SlideBuilderConfiguratorComponent,
        CommentsConfiguratorComponent,
        NetworkConfiguratorComponent
    ]
})
export class ConfiguratorsModule {}
