import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterFiled'
})
export class FilterFiledPipe implements PipeTransform {

    transform(items: Array<any>, filed: boolean): any {
        return items.filter(item => item.filed === filed);
    }

}
