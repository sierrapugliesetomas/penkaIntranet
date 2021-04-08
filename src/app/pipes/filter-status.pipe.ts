import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterStatus'
})
export class FilterStatusPipe implements PipeTransform {

    transform(items: Array<any>, status: string): any {
        return items.filter(item => item.status === status);
    }

}
