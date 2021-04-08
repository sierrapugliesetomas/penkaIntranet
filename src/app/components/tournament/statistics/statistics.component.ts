import {Component, Input, OnInit} from '@angular/core';
import {Tournament} from '../../../interfaces/tournament';

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
    @Input() tournamentId: string;
    @Input() tournament = {} as Tournament;
    @Input() state: boolean;

    constructor() {
    }

    ngOnInit(): void {
    }

}
