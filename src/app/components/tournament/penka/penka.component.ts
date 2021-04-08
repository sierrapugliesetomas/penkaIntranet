import { Component, Input, OnInit } from '@angular/core';
import { Tournament } from '../../../interfaces/tournament';
import { TournamentResultsService } from '../../../services/Tournament/tournament-results.service';
import { PlayersService } from '../../../services/player/players.service';

@Component({
    selector: 'app-penka',
    templateUrl: './penka.component.html',
    styleUrls: ['./penka.component.css']
})
export class PenkaComponent implements OnInit {
    @Input() tournamentId: string;
    @Input() tournament = {} as Tournament;
    @Input() state: boolean;

    results = [];
    players = [];
    public goalScorer: any;
    filterPlayer = '';

    constructor(
        private tournamentResultService: TournamentResultsService,
        private playerServices: PlayersService) {
    }

    ngOnInit() {
        this.tournamentResultService.getResults().subscribe(
            res => this.results = res,
            error => console.log(error));

        this.playerServices.getPlayers().subscribe(
            res => this.players = res,
            error => console.log(error));
    }

}
