import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterPlayer'
})
export class FilterPlayerPipe implements PipeTransform {

    transform(items: Array<any>, playerId: string): any {
        return items.filter(item => item.playerId === playerId);
    }

}
