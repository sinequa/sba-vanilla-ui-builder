import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { ComponentConfig } from "@sinequa/ngx-ui-builder";
import { Observable, of } from "rxjs";
import faIcons from './fontawesomeicons.json';

declare interface ComponentWithIconConfig extends ComponentConfig {
  icon?: string;
}

@Component({
  selector: 'sq-icon-selector',
  template: `
<label for="icon">Icon <span *ngIf="config.icon">(<i #rendered [ngClass]="config.icon"></i>)</span></label>
<input type="text"
  #inputElement
  class="form-control"
  id="icon"
  autocomplete="off"
  spellcheck="off"
  [(ngModel)]="config.icon"
  (ngModelChangeDebounced)="iconChanged()">
<uib-autocomplete [inputElement]="inputElement" [suggestGenerator]="suggestGenerator" (select)="select($event)">
  <ng-template #itemTpl let-suggest><i class="fas fa-fw" [ngClass]="suggest"></i> {{suggest}}</ng-template>
</uib-autocomplete>
   `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconSelectorComponent {
  @Input() config: ComponentWithIconConfig;
  @Output() configChanged = new EventEmitter<{icon: string, iconCode: string}>();

  @ViewChild("rendered") rendered: ElementRef;

  iconChanged() {
    // To get the icon code, we inspect the CSS 'content' property
    const rawCode = getComputedStyle(this.rendered.nativeElement, 'before').content;
    const iconCode = rawCode.startsWith("\"")? rawCode.slice(1,2) : '';
    this.configChanged.emit({icon: this.config.icon || '', iconCode});
  }

  select(suggest: string) {
    this.config.icon = suggest;
    setTimeout(() => this.iconChanged(), 10); // Let Angular render the icon so that we can extract its character code from the DOM
  }

  suggestGenerator = (input: string): Observable<string[]> => {
    const faPattern = /\b(fa[sr]\s+)?(fa-)?([\w-]+)/g;
    const match = faPattern.exec(input);
    const token = match?.[3];
    const hasFontCode = !!match?.[1];
    let suggests: string[] = [];
    if(token) {
      const icons = faIcons as string[];
      suggests = icons.filter(i => i.includes(token.toLowerCase()))
        .sort((a,b) => a.indexOf(token.toLowerCase()) - b.indexOf(token.toLowerCase()))
        .map(i => input.replace(faPattern, hasFontCode? "$1fa-"+i : "fas fa-"+i));
    }
    return of(suggests);
  }
}
