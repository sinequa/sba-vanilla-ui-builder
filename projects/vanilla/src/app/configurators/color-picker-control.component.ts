import { Component, Input } from "@angular/core";
import { ConfiguratorContext } from "@sinequa/ngx-ui-builder";

@Component({
  selector: 'sq-color-picker',
  template: `
  <label for="color-{{property}}" *ngIf="label">{{label}}</label>
  <input id="color-{{property}}"
    class="form-control mb-2"
    [(colorPicker)]="color"
    (colorPickerSelect)="context.configChanged()"
    [style.background]="color"/>
  `
})
export class ColorPickerControlComponent {
  @Input() context: ConfiguratorContext;
  @Input() property: string;
  @Input() label?: string;

  get color() {
    return this.context.config[this.property];
  }

  set color(value: string) {
    if(value === "#ffffff") {
      value = '';
    }
    this.context.config[this.property] = value;
  }

}
