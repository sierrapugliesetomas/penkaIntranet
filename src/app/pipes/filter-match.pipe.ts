import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterMatch'
})
export class FilterMatchPipe implements PipeTransform {

    transform(items: Array<any>, matchId: string): any {
        return items.filter(item => item.matchId === matchId);
    }

}
