import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterNationalteam'
})
export class FilterNationalteamPipe implements PipeTransform {

    transform(items: Array<any>, name: string): any {
        return items.filter(item => item.country === name);
    }

}
