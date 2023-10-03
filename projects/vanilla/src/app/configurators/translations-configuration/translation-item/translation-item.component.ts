import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { ConfirmType, ModalButton, ModalResult, ModalService, PromptOptions } from '@sinequa/core/modal';

@Component({
  selector: 'app-translation-item',
  templateUrl: './translation-item.component.html',
  styles: [`
  .sq-item-info:hover {
    background-color: rgb(248, 249, 250);
  }

  .item-key {
    font-weight: 600;
  }
  `]
})
export class TranslationItemComponent implements OnChanges {

  @Input() item: any;
  @Input() level: number = 0;
  @Input() filter: string;
  @Input() path: string[]

  @Output() updated = new EventEmitter<{ path: string[], value: string }>();
  @Output() removed = new EventEmitter<string>();

  marginPx = 10;

  currentPath: string[]

  constructor(private modalService: ModalService) { }

  ngOnChanges() {
    if (this.path && this.item) {
      this.currentPath = this.path.concat(this.item.key);
    }
  }

  isString(value: any): boolean {
    return typeof value === 'string';
  }

  editValue() {
    const model: PromptOptions = {
      title: this.item.key,
      message: 'Edit the value',
      buttons: [],
      output: this.item.value,
      validators: [Validators.required]
    };

    this.modalService.prompt(model).then(res => {
      if (res === ModalResult.OK) {
        this.item.value = model.output;
        this.updated.emit({ path: this.currentPath, value: model.output });
      }
    });
  }

  addItem() {
    this.modalService.confirm({
      confirmType: ConfirmType.Info,
      title: "Item type",
      message: "Do you want to add a translation key or a node?",
      buttons: [
        new ModalButton({result: ModalResult.Yes, text: 'Key'}),
        new ModalButton({result: ModalResult.No, text: 'Node'}),
      ]
    }).then(res => {
      if (res === ModalResult.Yes) { // translation
        let model: PromptOptions = {
          message: 'Translation key',
          buttons: [],
          output: '',
          validators: [Validators.required]
        };

        // Fetch the item key
        this.modalService.prompt(model).then(res => {
          if (res === ModalResult.OK) {
            const key = model.output;
            model.output = '';
            model.message = 'Translation value';

            // Fetch the item value
            this.modalService.prompt(model).then(res => {
              if (res === ModalResult.OK) {
                const item = {};
                item[key] = model.output;

                this.item.value = {
                  ...this.item.value,
                  ...item
                }

                this.updated.emit({ path: this.currentPath, value: this.item.value });
              }
            });
          }
        });
      } else if (res === ModalResult.No) { // node
        const model: PromptOptions = {
          message: 'Node key',
          buttons: [],
          output: '',
          validators: [Validators.required]
        };

        // Fetch the node key
        this.modalService.prompt(model).then(res => {
          if (res === ModalResult.OK) {
            const item = {};
            item[model.output] = {};

            this.item.value = {
              ...this.item.value,
              ...item
            };

            this.updated.emit({ path: this.currentPath, value: this.item.value });
          }
        });
      }
    });
  }

  removeItem(isNode: boolean) {
    const message = isNode ? 'This will delete the node and all of its sub items' : 'This will delete this item';
    this.modalService.confirm({
      confirmType: ConfirmType.Warning,
      title: `Are you sure you want to remove ${this.item.key}?`,
      message,
      buttons: [
        new ModalButton({result: ModalResult.Cancel, primary: true}),
        new ModalButton({result: ModalResult.OK}),
      ]
    }).then(res => {
      if (res === ModalResult.OK) {
        this.removed.emit(this.item.key);
      }
    });
  }

  performRemoval(key: string) {
    delete this.item.value[key];
    this.updated.emit({ path: this.currentPath, value: this.item.value });
  }

}
