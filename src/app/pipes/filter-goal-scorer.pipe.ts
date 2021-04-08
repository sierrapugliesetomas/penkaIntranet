import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterGoalScorer'
})
export class FilterGoalScorerPipe implements PipeTransform {

    transform(value: any, arg: any): any {

        if (arg === '' || arg.length < 3) {
            return value;
        }

        const resultSearch = [];

        for (const search of value) {
            if (search.name.toLowerCase().indexOf(arg.toLowerCase()) > -1) {
                resultSearch.push(search);
            }
        }

        return resultSearch;
    }

}
