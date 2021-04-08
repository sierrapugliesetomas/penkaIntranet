import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterMvp'
})
export class FilterMvpPipe implements PipeTransform {

    transform(items: Array<any>, mvp: boolean): any {
        return items.filter(item => item.mvp === mvp);
    }


}
