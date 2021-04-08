import {Component, OnInit} from '@angular/core';
import {TournamentService} from '../../services/Tournament/tournament.service';
import {Router} from '@angular/router';
import {Tournament} from '../../interfaces/tournament';
import {TournamentTeamsService} from '../../services/Tournament/tournament-teams.service';
import {TournamentGroupsService} from '../../services/Tournament/tournament-groups.service';
import {TournamentMatchesService} from '../../services/Tournament/tournament-matches.service';
import {TournamentResultsService} from '../../services/Tournament/tournament-results.service';

@Component({
    selector: 'app-tournament',
    templateUrl: './tournament.component.html',
    styleUrls: ['./tournament.component.css']
})
export class TournamentComponent implements OnInit {

    tournaments = [];

    constructor(
        private tournamentService: TournamentService,
        private tournamentTeamsService: TournamentTeamsService,
        private tournamentGroupsService: TournamentGroupsService,
        private tournamentMatchesService: TournamentMatchesService,
        private tournamentResultsService: TournamentResultsService,
        private router: Router) {
    }

    ngOnInit() {
        this.tournamentService.getTournaments().subscribe(
            res => this.tournaments = res,
            error => console.log(error));
    }

    delete(event, tournament: Tournament) {
        let teamsArray: any = [];
        let matchesArray: any = [];
        let resultsArray: any = [];
        let groupsArray: any = [];

        if (confirm('Esta seguro de eliminar el torneo: "' + tournament.name + '"')) {

            this.tournamentTeamsService.getTeams().subscribe(
                res => {
                    teamsArray = res;
                    // tslint:disable-next-line:prefer-for-of
                    for (let i = 0; i < teamsArray.length; i++) {
                        if (teamsArray[i].tournamentName === tournament.name) {
                            this.tournamentTeamsService.deleteTeam(teamsArray[i].id);
                        }
                    }
                }, error => console.log(error));

            this.tournamentGroupsService.getGroups().subscribe(
                res => {
                    groupsArray = res;
                    // tslint:disable-next-line:prefer-for-of
                    for (let i = 0; i < groupsArray.length; i++) {
                        if (groupsArray[i].tournamentName === tournament.name) {
                            this.tournamentGroupsService.deleteGroup(groupsArray[i].id);
                        }
                    }
                }, error => console.log(error));

            this.tournamentMatchesService.getMatches().subscribe(
                res => {
                    matchesArray = res;
                    // tslint:disable-next-line:prefer-for-of
                    for (let i = 0; i < matchesArray.length; i++) {
                        if (matchesArray[i].tournamentName === tournament.name) {
                            this.tournamentMatchesService.deleteMatch(matchesArray[i].id);
                        }
                    }
                }, error => console.log(error));

            this.tournamentResultsService.getResults().subscribe(
                res => {
                    resultsArray = res;
                    // tslint:disable-next-line:prefer-for-of
                    for (let i = 0; i < resultsArray.length; i++) {
                        if (resultsArray[i].tournamentName === tournament.name) {
                            this.tournamentResultsService.deleteResult(resultsArray[i].id);
                        }
                    }
                }, error => console.log(error));

            this.tournamentService.deleteTournament(tournament.id);
        }
    }

    edit(event, tournament: Tournament) {
        this.router.navigate(['tournaments/edit/' + tournament.id]).catch(error => console.log(error));
    }

}
