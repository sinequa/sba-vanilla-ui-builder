import { Component, Input } from "@angular/core";
import { ConfiguratorContext } from "ngx-ui-builder";

@Component({
    selector: 'sq-checkbox',
    template: `
<div class="form-check mb-2">
    <input class="form-check-input" type="checkbox" [id]="property" [(ngModel)]="!!context.config[property]" (ngModelChange)="context.configChanged()">
    <label class="form-check-label" [for]="property">{{label || property}}</label>
</div>
    `
})
export class CheckboxControlComponent {
    @Input() context: ConfiguratorContext;
    @Input() property: string;
    @Input() label?: string;
}