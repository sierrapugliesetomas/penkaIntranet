import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterPhase'
})
export class FilterPhasePipe implements PipeTransform {

    transform(items: Array<any>, phase: string): any {
        return items.filter(item => item.phase === phase);
    }

}
