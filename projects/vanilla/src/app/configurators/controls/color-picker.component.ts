import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { ConfiguratorContext } from "@sinequa/ngx-ui-builder";

@Component({
  selector: 'sq-color-picker',
  template: `
  <label for="color-{{property}}" class="form-label" *ngIf="label">{{label}}</label>
  <div class="color-picker-wrapper mb-2">
    <input [uib-tooltip]="tooltip" i18n-uib-tooltip i18n
      type="color"
      id="color-{{property}}"
      class="form-control-color"
      [(ngModel)]="color"
      (ngModelChangeDebounced)="context.configChanged()"/>
  </div>
  `,
  styles: [`
    :host {
      width: 100px;
    }

    .color-picker-wrapper {
      overflow: hidden;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      box-shadow: 1px 1px 3px 0px grey;
      margin: auto;
    }

    .color-picker-wrapper input[type=color] {
      width: 150%;
      height: 150%;
      padding: 0;
      margin: -25%;
    }
  `]
})
export class ColorPickerComponent implements OnChanges {
  @Input() context: ConfiguratorContext;
  @Input() property: string;
  @Input() label?: string;
  @Input() defaultColor = '#ffffff';
  @Input() tooltip?: string;

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
