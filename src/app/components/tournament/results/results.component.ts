import {Component, Input, OnInit} from '@angular/core';
import {Tournament} from '../../../interfaces/tournament';
import {TournamentService} from '../../../services/Tournament/tournament.service';
import {TournamentGroupsService} from '../../../services/Tournament/tournament-groups.service';
import {TournamentResultsService} from '../../../services/Tournament/tournament-results.service';
import {TournamentTeamsService} from '../../../services/Tournament/tournament-teams.service';

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
    @Input() tournamentId: string;
    @Input() tournament = {} as Tournament;
    @Input() state: boolean;

    matches = [];
    groups = [];
    teams = [];
    results = [];

    constructor(
        private tournamentService: TournamentService,
        private tournamentTeamsService: TournamentTeamsService,
        private tournamentGroupsService: TournamentGroupsService,
        private tournamentResultsService: TournamentResultsService) {
    }

    ngOnInit() {
        this.tournamentTeamsService.getTeams().subscribe(
            res => this.teams = res,
            error => console.log(error));

        this.tournamentGroupsService.getGroups().subscribe(
            res => this.groups = res,
            error => console.log(error));

        this.tournamentResultsService.getResults().subscribe(
            res => this.results = res,
            error => console.log(error));
    }

    updateResults(resultId, teamId, groupName, tournamentId) {
        let homeArray: any = [];
        let visitArray: any = [];
        let matchesHome: number;
        let matchesVisit: number;
        let matchesPlayed: number;

        /* matches Played */
        this.tournamentResultsService.getMatchesHome(teamId, groupName, tournamentId).subscribe(
            resHome => {
                homeArray = resHome;
                matchesHome = homeArray.length;

                this.tournamentResultsService.getMatchesVisit(teamId, groupName, tournamentId).subscribe(
                    resVisit => {
                        visitArray = resVisit;
                        matchesVisit = visitArray.length;

                        matchesPlayed = matchesHome + matchesVisit;
                        this.tournamentResultsService.updateMatchPlayed(resultId, matchesPlayed);
                    }, error => console.log(error));

            }, error => console.log(error));


        let matchesWon: number;
        let matchesLost: number;
        let matchesDrawHome: number;
        let matchesDrawVisit: number;
        let matchesDraw: number;
        let wonArray: any = [];
        let lostArray: any = [];
        let drawArrayHome: any = [];
        let drawArrayVisit: any = [];


        /* matches Won */
        this.tournamentResultsService.getMatchesWon(teamId, groupName, tournamentId).subscribe(
            res => {
                wonArray = res;
                matchesWon = wonArray.length;
                this.tournamentResultsService.updateWins(resultId, matchesWon);
            }, error => console.log(error));

        /* matches Lost */
        this.tournamentResultsService.getMatchesLost(teamId, groupName, tournamentId).subscribe(
            res => {
                lostArray = res;
                matchesLost = lostArray.length;
                this.tournamentResultsService.updateLoses(resultId, matchesLost);
            }, error => console.log(error));

        /* matches Draw */
        this.tournamentResultsService.getMatchesDrawHome(teamId, groupName, tournamentId).subscribe(
            resHome => {
                drawArrayHome = resHome;
                matchesDrawHome = drawArrayHome.length;

                this.tournamentResultsService.getMatchesDrawVisit(teamId, groupName, tournamentId).subscribe(
                    resVisit => {
                        drawArrayVisit = resVisit;
                        matchesDrawVisit = drawArrayVisit.length;

                        matchesDraw = matchesDrawHome + matchesDrawVisit;
                        this.tournamentResultsService.updateDraws(resultId, matchesDraw);
                    }, error => console.log(error));

            }, error => console.log(error));

        /* Positive, Negative and Average Goals */
        let homeArrayGoals: any = [];
        let visitArrayGoals: any = [];
        let positiveGoalsH = 0;
        let positiveGoalsV = 0;
        let positiveGoals = 0;
        let negativeGoalsH = 0;
        let negativeGoalsV = 0;
        let negativeGoals = 0;
        let averageGoals = 0;
        let homeScore = 0;
        let visitScore = 0;

        this.tournamentResultsService.getMatchesHome(teamId, groupName, tournamentId).subscribe(
            resHome => {
                homeArrayGoals = resHome;
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < homeArrayGoals.length; i++) {
                    homeScore = +(homeArrayGoals[i].homeScore);
                    visitScore = +(homeArrayGoals[i].visitScore);
                    positiveGoalsH = positiveGoalsH + homeScore;
                    negativeGoalsH = negativeGoalsH + visitScore;
                }


                this.tournamentResultsService.getMatchesVisit(teamId, groupName, tournamentId).subscribe(
                    resVisit => {
                        visitArrayGoals = resVisit;

                        // tslint:disable-next-line:prefer-for-of
                        for (let k = 0; k < visitArrayGoals.length; k++) {
                            visitScore = +(visitArrayGoals[k].visitScore);
                            homeScore = +(visitArrayGoals[k].homeScore);
                            positiveGoalsV = positiveGoalsV + visitScore;
                            negativeGoalsV = negativeGoalsV + homeScore;
                        }

                        positiveGoals = positiveGoalsH + positiveGoalsV;
                        negativeGoals = negativeGoalsH + negativeGoalsV;
                        averageGoals = (positiveGoals - negativeGoals);

                        this.tournamentResultsService.updateGoals(resultId, positiveGoals, negativeGoals, averageGoals);
                    }, error => console.log(error));
            }
        );

        /* Points */
        let pointArray: any = [];
        let pointsWon: number;
        let pointsTotal: number;
        let nMatchesWon: number;
        let nMatchesDrawH: number;
        let nMatchesDrawV: number;

        this.tournamentResultsService.getMatchesWon(teamId, groupName, tournamentId).subscribe(
            res => {
                pointArray = res;
                nMatchesWon = pointArray.length;
                pointsWon = nMatchesWon * 3;

                this.tournamentResultsService.getMatchesDrawHome(teamId, groupName, tournamentId).subscribe(
                    res1 => {
                        pointArray = res1;
                        nMatchesDrawH = pointArray.length;

                        this.tournamentResultsService.getMatchesDrawVisit(teamId, groupName, tournamentId).subscribe(
                            res2 => {
                                pointArray = res2;
                                nMatchesDrawV = pointArray.length;
                                pointsTotal = pointsWon + nMatchesDrawH + nMatchesDrawV;

                                this.tournamentResultsService.updatePoints(resultId, pointsTotal);

                            }, error => console.log(error));

                    }, error => console.log(error));

            }, error => console.log(error));

    }

    classifiedTeam(event, id) {
        let classified: boolean;
        if (event.value === '1') {
            classified = true;
        } else {
            classified = false;
        }
        this.tournamentResultsService.updateClassified(id, classified);
    }

}
