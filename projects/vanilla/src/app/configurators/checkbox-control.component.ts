import { Component, Input, Output, EventEmitter } from "@angular/core";
import { ConfiguratorContext } from "@sinequa/ngx-ui-builder";

@Component({
    selector: 'sq-checkbox',
    template: `
<div class="form-check mb-2">
    <input class="form-check-input" type="checkbox" [id]="property" [(ngModel)]="!!context.config[property]" (ngModelChange)="onModelChanged($event)">
    <label class="form-check-label" [for]="property">{{label || property}}</label>
</div>
    `
})
export class CheckboxControlComponent {
    @Input() context: ConfiguratorContext;
    @Input() property: string;
    @Input() label?: string;

    @Output() modelChanged = new EventEmitter<boolean>();

    onModelChanged(value: boolean) {
        this.context.configChanged();
        this.modelChanged.next(value);
    }
}