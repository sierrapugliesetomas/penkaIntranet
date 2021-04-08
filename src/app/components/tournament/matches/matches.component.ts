import {Component, Input, OnInit} from '@angular/core';
import {Tournament} from '../../../interfaces/tournament';
import {TournamentMatchesService} from '../../../services/Tournament/tournament-matches.service';
import {CountriesService} from '../../../services/country/countries.service';
import {TournamentGroupsService} from '../../../services/Tournament/tournament-groups.service';
import {TournamentService} from '../../../services/Tournament/tournament.service';
import {TournamentTeamsService} from '../../../services/Tournament/tournament-teams.service';
import {NgbCalendar} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-matches',
    templateUrl: './matches.component.html',
    styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {

    @Input() tournamentId: string;
    @Input() tournament = {} as Tournament;
    @Input() state: boolean;

    statusMatch = true;

    matches = [];
    federations = [];
    countries = [];
    groups = [];
    teams = [];

    constructor(
        private calendar: NgbCalendar,
        private tournamentService: TournamentService,
        private countriesService: CountriesService,
        private tournamentGroupsService: TournamentGroupsService,
        private tournamentMatchesService: TournamentMatchesService,
        private tournamentTeamsService: TournamentTeamsService) {
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
    }

    updateHomeTeam(event, id) {
        const status = '1';
        let country: any = [];
        this.countriesService.getCountryById(event.value).subscribe(
            res => {
                country = res;
                this.tournamentMatchesService.updateHomeTeam(id, event.value, country.name, country.flagUrl, this.tournamentId, status);
            }, error => console.log(error));
    }

    updateVisitTeam(event, id) {
        let country: any = [];
        this.countriesService.getCountryById(event.value).subscribe(
            res => {
                country = res;
                this.tournamentMatchesService.updateVisitTeam(id, event.value, country.name, country.flagUrl, this.tournamentId);
            }, error => console.log(error));
    }

    updateHomeScore(event, id) {
        let match: any = [];

        this.tournamentMatchesService.getMatchById(id).subscribe(
            res => {
                match = res;
                if (match.homeScore > match.visitScore) {
                    this.tournamentMatchesService.updateHomeScore(id, event.value);
                    this.tournamentMatchesService.updateWinner(id, match.homeTeamId, match.homeTeamName, match.homeFlag);
                    this.tournamentMatchesService.updateLoser(id, match.visitTeamId, match.visitTeamName, match.visitFlag);
                    this.tournamentMatchesService.updateDraw(id, false);

                } else if (match.homeScore < match.visitScore) {
                    this.tournamentMatchesService.updateHomeScore(id, event.value);
                    this.tournamentMatchesService.updateWinner(id, match.visitTeamId, match.visitTeamName, match.visitFlag);
                    this.tournamentMatchesService.updateLoser(id, match.homeTeamId, match.homeTeamName, match.homeFlag);
                    this.tournamentMatchesService.updateDraw(id, false);

                } else if (match.homeScore === match.visitScore) {
                    this.tournamentMatchesService.updateHomeScore(id, event.value);
                    this.tournamentMatchesService.updateWinner(id, '', '', '');
                    this.tournamentMatchesService.updateLoser(id, '', '', '');
                    this.tournamentMatchesService.updateDraw(id, true);
                }

            }, error => console.log(error));
    }

    updateVisitScore(event, id) {
        let match: any = [];

        this.tournamentMatchesService.getMatchById(id).subscribe(
            res => {
                match = res;
                if (match.homeScore > match.visitScore) {
                    this.tournamentMatchesService.updateVisitScore(id, event.value);
                    this.tournamentMatchesService.updateWinner(id, match.homeTeamId, match.homeTeamName, match.homeFlag);
                    this.tournamentMatchesService.updateLoser(id, match.visitTeamId, match.visitTeamName, match.visitFlag);
                    this.tournamentMatchesService.updateDraw(id, false);

                } else if (match.homeScore < match.visitScore) {
                    this.tournamentMatchesService.updateVisitScore(id, event.value);
                    this.tournamentMatchesService.updateWinner(id, match.visitTeamId, match.visitTeamName, match.visitFlag);
                    this.tournamentMatchesService.updateLoser(id, match.homeTeamId, match.homeTeamName, match.homeFlag);
                    this.tournamentMatchesService.updateDraw(id, false);

                } else if (match.homeScore === match.visitScore) {
                    this.tournamentMatchesService.updateVisitScore(id, event.value);
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
    }

}
