import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterGroup'
})
export class FilterGroupPipe implements PipeTransform {

    transform(items: Array<any>, name: string): any {
        return items.filter(item => item.group === name);
    }
}
