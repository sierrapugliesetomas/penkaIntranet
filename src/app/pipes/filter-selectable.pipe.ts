import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterSelectable'
})
export class FilterSelectablePipe implements PipeTransform {

    transform(items: Array<any>, status: boolean): any {
        return items.filter(item => item.nationalTeam === status);
    }

}
