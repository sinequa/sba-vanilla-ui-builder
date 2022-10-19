import { Component, forwardRef, HostBinding, Input, OnChanges, SimpleChanges } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { DndDropEvent } from "ngx-drag-drop";

@Component({
  selector: "sq-select-multi",
  template: `
  <div [dndDropzone]="[selectId]" *ngIf="enableReorder" (dndDrop)="onDrop($event)">
    <div dndPlaceholderRef></div>
    <div *ngFor="let option of _optionsSelected; let i=index"
      [dndDraggable]="i"
      [dndType]="selectId"
      class="d-flex align-items-center">
      <ng-container *ngIf="option !== null">
        <i class="fas fa-grip-vertical fa-fw text-muted" dndHandle></i>
        <ng-container *ngTemplateOutlet="optionTpl; context:{
          $implicit: {
            value: valueField? option[valueField] : option,
            display: displayField? option[displayField] : option,
            i:i
          }
        }"></ng-container>
      </ng-container>
    </div>
  </div>

  <ng-container *ngFor="let option of _options; let i=index"
    [ngTemplateOutlet]="optionTpl"
    [ngTemplateOutletContext]="{
      $implicit: {
        value: valueField? option[valueField] : option,
        display: displayField? option[displayField] : option,
        i:i+(_optionsSelected?.length||0)
      }
    }">
  </ng-container>

  <ng-template #optionTpl let-item>
    <div class="form-check">
      <input id="{{selectId}}-{{item.i}}"
        type="checkbox"
        class="form-check-input"
        [checked]="isChecked(item.value)"
        (change)="onChecked(item.value, $any($event).target.checked)"
        (blur)="onTouched()"/>
      <label class="form-check-label" for="{{selectId}}-{{item.i}}">
        {{item.display}}
      </label>
    </div>
  </ng-template>
  `,
  styles: [`
  [dndhandle] {
    cursor: grab;
  }
  [dndPlaceholderRef] {
    height: 1rem;
    background: #ccc;
    border: dotted 3px #999;
    transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
  }
  :host {
    max-height: var(--multi-select-max-height);
    overflow: auto;
    margin-bottom: 0.5rem;
  }
  `],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultiSelectComponent),
    multi: true
  }],
  host: {
    class: "form-control"
  }
})
export class MultiSelectComponent<T> implements OnChanges, ControlValueAccessor {
  @Input() options: T[] | undefined;
  @Input() enableReorder = false;
  @Input() valueField?: string;
  @Input() displayField?: string;
  @Input() compareWith: (a: T, b:T) => boolean = Object.is;
  @Input() @HostBinding("style.--multi-select-max-height") maxHeight = "300px";

  // Copy of options, so we can change the order without affecting the original list of options
  // If the options change, the order is reinitiliazed.
  _options: T[] | undefined;
  _optionsSelected: (T|null)[] | undefined;

  _values: T[] | undefined;

  static idCpt = 0;
  _id: number;

  get selectId() {
    return `select-${this._id}`;
  }

  constructor(){
    this._id = MultiSelectComponent.idCpt++;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.options) {
      this._options = undefined;
      this.updateOptions();
    }
  }

  updateOptions() {
    if(this.options) {
      this._options = [...this.options];
      if(this.enableReorder && this._values) {
        this._optionsSelected = [];
        for(let val of this._values) {
          const i = this._options.findIndex(o => this.compareWith(val, this.valueField? o[this.valueField] : o));
          if(i !== -1) {
            const [o] = this._options.splice(i, 1);
            this._optionsSelected.push(o);
          }
          else { // val is missing from the list of options... (this can happen with incomplete list of metadata)
            this._optionsSelected.push(null);
          }
        }
      }
    }
  }

  isChecked(item: T): boolean {
    if(!this._values) return false;
    return this._values.findIndex(v => this.compareWith(v, item)) !== -1;
  }

  onChecked(option: T, checked: boolean) {
    if(!this._values) {
      this._values = [];
    }
    if(checked) {
      this._values.push(option);
    }
    else {
      this._values.splice(this._values.indexOf(option), 1);
    }
    this.triggerChange();
  }

  onDrop(event: DndDropEvent) {
    const oldIdx = event.data;
    const newIdx = event.index;
    if(this._values && typeof oldIdx === 'number' && typeof newIdx === 'number' && oldIdx !== newIdx) {
      const [obj] = this._values.splice(oldIdx, 1);
      this._values?.splice(newIdx<oldIdx? newIdx : newIdx-1, 0, obj);
      this.triggerChange();
    }
  }

  triggerChange() {
    this.updateOptions();
    this.onChange(this._values);
  }

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(obj: T[]): void {
    this._values = obj;
    this.updateOptions();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
