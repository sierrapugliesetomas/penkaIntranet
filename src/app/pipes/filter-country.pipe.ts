import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterCountry'
})
export class FilterCountryPipe implements PipeTransform {

    transform(items: Array<any>, name: string): any {
        return items.filter(item => item.country === name);
    }

}
