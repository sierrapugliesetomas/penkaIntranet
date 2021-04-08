import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterTournament'
})
export class FilterTournamentPipe implements PipeTransform {

    transform(items: Array<any>, name: string): any {
        return items.filter(item => item.tournamentName === name);
    }
}
