import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IntlModule } from "@sinequa/core/intl";
import { UtilsModule } from "@sinequa/ngx-ui-builder";
import { CheckboxComponent } from "./checkbox.component";
import { ColorPickerComponent } from "./color-picker.component";
import { IconSelectorComponent } from "./icon-selector.component";
import { ImgSelectorComponent } from "./img-selector.component";
import { MultiSelectComponent } from "./multi-select.component";
import { DndModule } from "ngx-drag-drop";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IntlModule,
    UtilsModule,
    DndModule
  ],
  declarations: [
    CheckboxComponent,
    IconSelectorComponent,
    ImgSelectorComponent,
    ColorPickerComponent,
    MultiSelectComponent
  ],
  exports: [
    CheckboxComponent,
    IconSelectorComponent,
    ImgSelectorComponent,
    ColorPickerComponent,
    MultiSelectComponent
  ]
})
export class ControlsModule {}
