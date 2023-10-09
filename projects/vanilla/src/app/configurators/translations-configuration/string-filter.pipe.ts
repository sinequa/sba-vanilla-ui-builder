import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: "sqStringFilter"})
export class StringFilterPipe implements PipeTransform {
    transform(items: any[], filter: string): any {
        if (!filter) return items;
        return items.filter(item => JSON.stringify(item).toLowerCase().indexOf(filter.toLowerCase().trim()) !== -1);
    }
}