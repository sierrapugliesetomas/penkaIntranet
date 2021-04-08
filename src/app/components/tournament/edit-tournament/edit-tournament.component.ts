import {Component, OnInit} from '@angular/core';
import {Tournament} from '../../../interfaces/tournament';
import {TournamentService} from '../../../services/Tournament/tournament.service';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
    selector: 'app-edit-tournament',
    templateUrl: './edit-tournament.component.html',
    styleUrls: ['./edit-tournament.component.css']
})
export class EditTournamentComponent implements OnInit {

    tournamentId: string;
    tournament = {} as Tournament;
    active = 1;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private tournamentService: TournamentService) {
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe(
            (params: Params) => {
                this.tournamentId = params.id;
            });

        this.tournamentService.getTournamentById(this.tournamentId).subscribe(
            res => this.tournament = res,
            error => console.log(error));
    }

}
