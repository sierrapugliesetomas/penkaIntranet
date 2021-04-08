import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterStage'
})
export class FilterStagePipe implements PipeTransform {

    transform(items: Array<any>, stage: string): any {
        return items.filter(item => item.tournamentPhaseFinals === stage);
    }

}
