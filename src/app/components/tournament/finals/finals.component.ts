import {Component, Input, OnInit} from '@angular/core';
import {Tournament} from '../../../interfaces/tournament';

@Component({
    selector: 'app-finals',
    templateUrl: './finals.component.html',
    styleUrls: ['./finals.component.css']
})
export class FinalsComponent implements OnInit {
    @Input() tournamentId: string;
    @Input() tournament = {} as Tournament;
    @Input() state: boolean;

    constructor() {
    }

    ngOnInit(): void {
    }

}
