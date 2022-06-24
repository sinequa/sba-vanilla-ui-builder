import { Component, Input } from "@angular/core";
import { ConfiguratorContext } from "@sinequa/ngx-ui-builder";

@Component({
  selector: "sq-img-selector",
  template: `
<div class="form-group">
  <label for="img-{{param}}">{{description}}</label>
  <input type="text"
    class="form-control mb-1"
    id="img-{{param}}"
    autocomplete="off"
    spellcheck="off"
    [(ngModel)]="context.config[param]"
    (ngModelChangeDebounced)="onChange($event)">
  <input type="file" class="form-control-file" accept="image/png, image/jpeg, image/gif" (change)="onImageLoaded($event)">
</div>
    `
})
export class ImgSelectorComponent {
  @Input() context: ConfiguratorContext;
  @Input() param: string;
  @Input() description: string;

  onImageLoaded(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.context.config[this.param] = reader.result;
          this.context.configChanged();
        }
      }
      reader.readAsDataURL(file);
    }
  }

  onChange(value: string) {
    this.context.configChanged();
  }
}
