import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TournamentMatchesService} from '../../../../services/Tournament/tournament-matches.service';
import {TournamentMatches} from '../../../../interfaces/tournament-matches';
import {PlayersService} from '../../../../services/player/players.service';
import {MatchesLineUpService} from '../../../../services/Tournament/matches-line-up.service';

@Component({
    selector: 'app-edit-match',
    templateUrl: './edit-match.component.html',
    styleUrls: ['./edit-match.component.css']
})
export class EditMatchComponent implements OnInit {

    matchId: string;
    match = {} as TournamentMatches;
    players = [];
    matchesLineUp = [];


    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private tournamentMatchesService: TournamentMatchesService,
        private playersService: PlayersService,
        private matchesLineUpService: MatchesLineUpService) {
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe(
            (params: Params) => {
                this.matchId = params.id;
            }
        );
        this.tournamentMatchesService.getMatchById(this.matchId).subscribe(
            res => this.match = res,
            error => console.log(error));
        this.playersService.getPlayers().subscribe(
            res => this.players = res,
            error => console.log(error));
        this.matchesLineUpService.getMatchesLineUp().subscribe(
            res => this.matchesLineUp = res,
            error => console.log(error));
    }

    update() {
        this.tournamentMatchesService.updateMatch(this.matchId, this.match);
        this.router.navigate(['tournamentsMatches/edit/' + this.match.tournamentId])
            .catch(error => console.log(error));
    }

    goal(event, player, match) {
        let lineUp: any;
        this.matchesLineUpService.getMatchesLineUpByPlayer(player.id, match.id).subscribe(
            res => {
                lineUp = res;
                if (lineUp.length === null) {
                    this.matchesLineUpService.addMatchesLineUp(match.tournamentId, match.tournamentName, match.id, player.id, player.name, event.value);
                } else {
                    this.matchesLineUpService.updateGoal(lineUp[0].id, event.value);

                }
            }, error => console.log(error));
    }

    mvp(event, player) {

    }

}
