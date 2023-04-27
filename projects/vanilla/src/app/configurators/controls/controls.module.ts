import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IntlModule } from "@sinequa/core/intl";
import { AutocompleteComponent, NgModelChangeDebouncedDirective } from "@sinequa/ngx-ui-builder";
import { IconSelectorComponent } from "./icon-selector.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IntlModule,
    NgModelChangeDebouncedDirective,
    AutocompleteComponent
  ],
  declarations: [
    IconSelectorComponent,
  ],
  exports: [
    IconSelectorComponent,
  ]
})
export class ControlsModule {}
