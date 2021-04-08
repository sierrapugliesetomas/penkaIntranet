import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterCodePenka'
})
export class FilterCodePenkaPipe implements PipeTransform {

    transform(items: Array<any>, codePenka: string): any {
        return items.filter(item => item.codePenka === codePenka);
    }

}
