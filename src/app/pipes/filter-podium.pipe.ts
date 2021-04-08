import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterPodium'
})
export class FilterPodiumPipe implements PipeTransform {

    transform(items: Array<any>, podium: string): any {
        return items.filter(item => item.teamPodium === podium);
    }

}
