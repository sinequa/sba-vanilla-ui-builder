import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'app-translation-item',
  templateUrl: './translation-item.component.html'
})
export class TranslationItemComponent implements OnChanges {

  @Input() item: any;
  @Input() level: number = 0;
  @Input() filter: string;
  @Input() path: string[]

  @Output() updated = new EventEmitter<{ path: string[], value: string }>();

  marginPx = 10;

  currentPath: string[]

  constructor() { }

  ngOnChanges() {
    if (this.path && this.item) {
      this.currentPath = this.path.concat(this.item.key);
    }
  }

  isString(value: any): boolean {
    return typeof value === 'string';
  }

  updatedValue(value: string) {
    this.updated.emit({ path: this.currentPath, value });
  }

}
