import {Component, Input, OnInit} from '@angular/core';
import {Tournament} from '../../../interfaces/tournament';
import {TournamentService} from '../../../services/Tournament/tournament.service';
import {CountriesService} from '../../../services/country/countries.service';
import {TournamentGroupsService} from '../../../services/Tournament/tournament-groups.service';
import {TournamentMatchesService} from '../../../services/Tournament/tournament-matches.service';
import {TournamentTeamsService} from '../../../services/Tournament/tournament-teams.service';
import {TournamentResultsService} from '../../../services/Tournament/tournament-results.service';
import {NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {TournamentMatches} from '../../../interfaces/tournament-matches';
import {TournamentGroups} from '../../../interfaces/tournament-groups';

@Component({
    selector: 'app-matches-finals',
    templateUrl: './matches-finals.component.html',
    styleUrls: ['./matches-finals.component.css']
})
export class MatchesFinalsComponent implements OnInit {
    @Input() tournamentId: string;
    @Input() tournament = {} as Tournament;
    @Input() state: boolean;

    matches = [];
    match = {} as TournamentMatches;
    federations = [];
    countries = [];
    groups = [];
    group = {} as TournamentGroups;
    teams = [];
    results = [];

    constructor(
        private calendar: NgbCalendar,
        private tournamentService: TournamentService,
        private countriesService: CountriesService,
        private tournamentGroupsService: TournamentGroupsService,
        private tournamentMatchesService: TournamentMatchesService,
        private tournamentTeamsService: TournamentTeamsService,
        private tournamentResultsService: TournamentResultsService,
        private router: Router) {
    }

    ngOnInit() {
        this.tournamentTeamsService.getTeams().subscribe(
            res => this.teams = res,
            error => console.log(error));
        this.tournamentMatchesService.getMatches().subscribe(
            res => this.matches = res,
            error => console.log(error));
        this.tournamentGroupsService.getGroups().subscribe(
            res => this.groups = res,
            error => console.log(error));
        this.tournamentResultsService.getResultsClassified(this.tournamentId).subscribe(
            res => this.results = res,
            error => console.log(error));
    }


    updateHomeTeam(event, id) {
        let country: any = [];
        const status = '1';
        this.countriesService.getCountryById(event.value).subscribe(
            res => {
                country = res,
                    this.tournamentMatchesService.updateHomeTeam(id, event.value, country.name, country.flagUrl, this.tournamentId, status);
            }, error => console.log(error));
    }

    updateVisitTeam(event, id) {
        let country: any = [];
        this.countriesService.getCountryById(event.value).subscribe(
            res => {
                country = res,
                    this.tournamentMatchesService.updateVisitTeam(id, event.value, country.name, country.flagUrl, this.tournamentId);
            }, error => console.log(error));
    }

    updateHomeScore(event, id) {
        let match: any = [];
        this.tournamentMatchesService.updateHomeScore(id, event.value);

        this.tournamentMatchesService.getMatchById(id).subscribe(
            res => {
                match = res;
                if (match.homeScore > match.visitScore) {
                    this.tournamentMatchesService.updateWinner(id, match.homeTeamId, match.homeTeamName, match.homeFlag);
                    this.tournamentMatchesService.updateLoser(id, match.visitTeamId, match.visitTeamName, match.visitFlag);
                    this.tournamentMatchesService.updateDraw(id, false);

                } else if (match.homeScore < match.visitScore) {
                    this.tournamentMatchesService.updateWinner(id, match.visitTeamId, match.visitTeamName, match.visitFlag);
                    this.tournamentMatchesService.updateLoser(id, match.homeTeamId, match.homeTeamName, match.homeFlag);
                    this.tournamentMatchesService.updateDraw(id, false);

                } else if (match.homeScore === match.visitScore) {
                    this.tournamentMatchesService.updateWinner(id, '', '', '');
                    this.tournamentMatchesService.updateLoser(id, '', '', '');
                    this.tournamentMatchesService.updateDraw(id, true);
                }

            }, error => console.log(error));
    }

    updateVisitScore(event, id) {
        let match: any = [];
        this.tournamentMatchesService.updateVisitScore(id, event.value);

        this.tournamentMatchesService.getMatchById(id).subscribe(
            res => {
                match = res;
                if (match.homeScore > match.visitScore) {
                    this.tournamentMatchesService.updateWinner(id, match.homeTeamId, match.homeTeamName, match.homeFlag);
                    this.tournamentMatchesService.updateLoser(id, match.visitTeamId, match.visitTeamName, match.visitFlag);
                    this.tournamentMatchesService.updateDraw(id, false);

                } else if (match.homeScore < match.visitScore) {
                    this.tournamentMatchesService.updateWinner(id, match.visitTeamId, match.visitTeamName, match.visitFlag);
                    this.tournamentMatchesService.updateLoser(id, match.homeTeamId, match.homeTeamName, match.homeFlag);
                    this.tournamentMatchesService.updateDraw(id, false);

                } else if (match.homeScore === match.visitScore) {
                    this.tournamentMatchesService.updateWinner(id, '', '', '');
                    this.tournamentMatchesService.updateLoser(id, '', '', '');
                    this.tournamentMatchesService.updateDraw(id, true);
                }

            }, error => console.log(error));
    }

    updateDateMatch(event, id) {
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const startDate = event.day + ' de ' + months[(event.month - 1)] + ' de ' + event.year;
        this.tournamentMatchesService.updateDateMatch(id, startDate);
    }

    updateTimeMatch(event, id) {
        this.tournamentMatchesService.updateTimeMatch(id, event.value);
    }

    gameStatus(event, match) {

        if (event.value === '1') {
            if (confirm('Desea confirmar el partido por finalizado?')) {
                this.tournamentMatchesService.updateStatus(match.id, event.value);
            }
        } else if (event.value === '0') {
            if (confirm('Desea modificar el partido?')) {
                this.tournamentMatchesService.updateStatus(match.id, event.value);
            }
        }

        let matchArray: any = [];
        let resultArray: any = [];
        let tournamentStage: string;
        let podium: string;

        this.tournamentMatchesService.getMatchById(match.id).subscribe(
            res => {
                matchArray = res;
                console.log(matchArray.phase);

                switch (matchArray.phase) {
                    case '16vos de final':
                        this.tournamentResultsService.getResultByTeam(matchArray.winnerId, this.tournamentId).subscribe(
                            result => {
                                resultArray = result;
                                tournamentStage = '8vos de final';
                                /* this.tournamentResultsService.updateStage(resultArray[0].id, tournamentStage); */

                            }, error => console.log(error));
                        break;
                    case '8vos de final':
                        this.tournamentResultsService.getResultByTeam(matchArray.winnerId, this.tournamentId).subscribe(
                            result => {
                                resultArray = result;
                                tournamentStage = '4tos de final';
                                /* this.tournamentResultsService.updateStage(resultArray[0].id, tournamentStage); */

                            }, error => console.log(error));
                        break;
                    case '4tos de final':
                        this.tournamentResultsService.getResultByTeam(matchArray.winnerId, this.tournamentId).subscribe(
                            result => {
                                resultArray = result;
                                tournamentStage = 'Semifinal';
                                /* this.tournamentResultsService.updateStage(resultArray[0].id, tournamentStage); */

                            }, error => console.log(error));
                        break;
                    case 'Semifinal':
                        this.tournamentResultsService.getResultByTeam(matchArray.winnerId, this.tournamentId).subscribe(
                            result => {
                                resultArray = result;
                                tournamentStage = 'Final';
                                /* this.tournamentResultsService.updateStage(resultArray[0].id, tournamentStage); */

                            }, error => console.log(error));
                        this.tournamentResultsService.getResultByTeam(matchArray.loserId, this.tournamentId).subscribe(
                            result => {
                                resultArray = result;
                                tournamentStage = '3er Lugar';
                                /* this.tournamentResultsService.updateStage(resultArray[0].id, tournamentStage); */

                            }, error => console.log(error));
                        break;
                    case '3er Lugar':
                        this.tournamentResultsService.getResultByTeam(matchArray.winnerId, this.tournamentId).subscribe(
                            result => {
                                resultArray = result;
                                podium = 'thirdPlace';
                                this.tournamentResultsService.updatePodium(resultArray[0].id, podium);

                            }, error => console.log(error));

                        break;
                    case 'Final':
                        this.tournamentResultsService.getResultByTeam(matchArray.winnerId, this.tournamentId).subscribe(
                            result => {
                                resultArray = result;
                                podium = 'firstPlace';
                                this.tournamentResultsService.updatePodium(resultArray[0].id, podium);

                            }, error => console.log(error));
                        this.tournamentResultsService.getResultByTeam(matchArray.loserId, this.tournamentId).subscribe(
                            result => {
                                resultArray = result;
                                podium = 'secondPlace';
                                this.tournamentResultsService.updatePodium(resultArray[0].id, podium);

                            }, error => console.log(error));
                        break;
                    default:

                }

            }, error => console.log(error));


    }


}
