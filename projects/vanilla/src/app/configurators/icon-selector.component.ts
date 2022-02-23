import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from "@angular/core";
import { ComponentConfig } from "ngx-ui-builder";
import faIcons from './fontawesomeicons.json';

declare interface ComponentWithIconConfig extends ComponentConfig {
    icon?: string;
}

@Component({
    selector: 'sq-icon-selector',
    template: `
<label for="icon">Icon <span *ngIf="config.icon">(<i [ngClass]="config.icon"></i>)</span></label>
<input type="text"
    class="form-control mb-2"
    id="icon"
    autocomplete="off"
    spellcheck="off"
    [(ngModel)]="config.icon"
    (ngModelChange)="iconChanged()"
    (focus)="onFocus()"
    (blur)="onBlur()">
<div class="position-relative" *ngIf="suggests?.length">
    <div class="card list-group list-group-flush position-absolute">
        <div *ngFor="let suggest of suggests" class="list-group-item-action px-2 py-1" (click)="select(suggest)">
            <i class="fa-fw" [ngClass]="suggest"></i> {{suggest}}
        </div>
    </div>
</div>
    `,
    styles: [`
.list-group {
    top: 0;
    width: 100%;
    max-height: 200px;
    overflow: auto;
}
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconSelectorComponent {
    @Input() config: ComponentWithIconConfig;
    @Output() configChanged = new EventEmitter();

    suggests?: string[];

    constructor(
        public cdref: ChangeDetectorRef
    ){}

    onFocus() {
        this.updateSuggests();
    }

    onBlur() {
        setTimeout(() => { // Set timeout is necessary because onBlur() is called before select() upon a click
            this.suggests = undefined;
            this.cdref.markForCheck();
        });
    }

    iconChanged() {
        this.updateSuggests();
        this.configChanged.next();
    }

    updateSuggests() {
        const value = this.config.icon || '';
        const faPattern = /\bfa-([\w-]+)/g;
        const match = faPattern.exec(value);
        const token = match?.[1];
        if(token) {
            const icons = faIcons as string[];
            this.suggests = icons.filter(i => i.startsWith(token.toLowerCase()))
                .map(i => value.replace(faPattern, "fa-"+i))
        }
        else {
            this.suggests = undefined;
        }
    }

    select(suggest: string) {
        this.config.icon = suggest;
        this.configChanged.next();
    }
}