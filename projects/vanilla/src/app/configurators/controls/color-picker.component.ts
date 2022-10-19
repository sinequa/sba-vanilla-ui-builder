import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { ConfiguratorContext } from "@sinequa/ngx-ui-builder";

@Component({
  selector: 'sq-color-picker',
  template: `
  <label for="color-{{property}}" class="form-label" *ngIf="label">{{label}}</label>
  <input
    type="color"
    id="color-{{property}}"
    class="form-control form-control-color mb-2"
    [(ngModel)]="color"
    (ngModelChangeDebounced)="context.configChanged()"/>
  `
})
export class ColorPickerComponent implements OnChanges {
  @Input() context: ConfiguratorContext;
  @Input() property: string;
  @Input() label?: string;
  @Input() defaultColor = '#ffffff';

  _path: string[];

  get color() {
    let val = this.context.config;
    for(let p of this._path) {
      val = val[p];
    }
    return <string><unknown>val || this.defaultColor;
  }

  set color(value: string) {
    if(value.toLowerCase() === this.defaultColor.toLowerCase()) {
      value = '';
    }
    let val = this.context.config;
    let i=0;
    for(; i<this._path.length-1; i++) {
      val = val[this._path[i]];
    }
    if(value !== val[this._path[i]]) {
      val[this._path[i]] = value;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._path = this.property.split('.');
  }
}
