import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
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
export class ColorPickerControlComponent implements OnChanges {
  @Input() context: ConfiguratorContext;
  @Input() property: string;
  @Input() label?: string;

  _path: string[];

  get color() {
    let val = this.context.config;
    for(let p of this._path) {
      val = val[p];
    }
    return <string><unknown>val;
  }

  set color(value: string) {
    if(value === "#ffffff") {
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
