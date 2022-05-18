import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { ComponentConfig } from "@sinequa/ngx-ui-builder";
import { Observable, of } from "rxjs";
import faIcons from './fontawesomeicons.json';

declare interface ComponentWithIconConfig extends ComponentConfig {
    icon?: string;
}

@Component({
    selector: 'sq-icon-selector',
    template: `
<label for="icon">Icon <span *ngIf="config.icon">(<i [ngClass]="config.icon"></i>)</span></label>
<input type="text"
    #inputElement
    class="form-control"
    id="icon"
    autocomplete="off"
    spellcheck="off"
    [(ngModel)]="config.icon"
    (ngModelChangeDebounced)="iconChanged()">
<uib-autocomplete [inputElement]="inputElement" [suggestGenerator]="suggestGenerator" (select)="select($event)">
    <ng-template #itemTpl let-suggest><i class="fa-fw" [ngClass]="suggest"></i> {{suggest}}</ng-template>
</uib-autocomplete>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconSelectorComponent {
    @Input() config: ComponentWithIconConfig;
    @Output() configChanged = new EventEmitter();

    iconChanged() {
        this.configChanged.emit();
    }

    select(suggest: string) {
        this.config.icon = suggest;
        this.iconChanged();
    }

    suggestGenerator = (input: string): Observable<string[]> => {
        const faPattern = /\bfa-([\w-]+)/g;
        const match = faPattern.exec(input);
        const token = match?.[1];
        let suggests: string[] = [];
        if(token) {
            const icons = faIcons as string[];
            suggests = icons.filter(i => i.startsWith(token.toLowerCase()))
                .map(i => input.replace(faPattern, "fa-"+i))
        }
        return of(suggests);
    }
}
