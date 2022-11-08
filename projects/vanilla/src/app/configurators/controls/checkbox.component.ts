import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import { ConfiguratorContext } from "@sinequa/ngx-ui-builder";

@Component({
  selector: 'sq-checkbox',
  template: `
<div class="form-check mb-2">
  <input class="form-check-input" type="checkbox" [id]="property" [(ngModel)]="model">
  <label class="form-check-label" [for]="property">{{label || property}}</label>
</div>
    `
})
export class CheckboxComponent implements OnChanges {
  @Input() context: ConfiguratorContext;
  @Input() property: string;
  @Input() label?: string;

  @Output() modelChanged = new EventEmitter<boolean>();

  _path: string[];

  get model(): boolean {
    let val = this.context.config;
    for (let p of this._path) {
      val = val[p];
    }
    return !!val;
  }

  set model(value: boolean) {
    let val = this.context.config;
    let i = 0;
    for (; i < this._path.length - 1; i++) {
      val = val[this._path[i]];
    }
    if (value !== val[this._path[i]]) {
      val[this._path[i]] = value;
      this.context.configChanged();
      this.modelChanged.emit(value);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._path = this.property.split('.');
  }
}
