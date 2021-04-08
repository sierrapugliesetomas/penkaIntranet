import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterTeam'
})
export class FilterTeamPipe implements PipeTransform {

    transform(items: Array<any>, name: string): any {
        return items.filter(item => item.teamName === name);
    }

}
