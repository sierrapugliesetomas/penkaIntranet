import {Component, Input, OnInit} from '@angular/core';
import {Tournament} from '../../../interfaces/tournament';
import {TournamentTeams} from '../../../interfaces/tournament-teams';
import {TournamentGroupsService} from '../../../services/Tournament/tournament-groups.service';
import {TournamentGroups} from '../../../interfaces/tournament-groups';
import {TournamentTeamsService} from '../../../services/Tournament/tournament-teams.service';
import {CountriesService} from '../../../services/country/countries.service';
import {FederationsService} from '../../../services/federation/federations.service';
import {TournamentResultsService} from '../../../services/Tournament/tournament-results.service';
import {LeaguesService} from '../../../services/league/leagues.service';
import {ClubsService} from '../../../services/club/clubs.service';

@Component({
    selector: 'app-teams',
    templateUrl: './teams.component.html',
    styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {

    @Input() tournamentId: string;
    @Input() tournament = {} as Tournament;
    @Input() state: boolean;

    teams = [];
    team = {} as TournamentTeams;

    groups = [];
    group = {} as TournamentGroups;

    countries = [];
    federations = [];
    leagues = [];
    clubs = [];

    typeTeam: string;

    constructor(
        private tournamentTeamsService: TournamentTeamsService,
        private tournamentGroupsService: TournamentGroupsService,
        private tournamentResultsService: TournamentResultsService,
        private countriesService: CountriesService,
        private leaguesService: LeaguesService,
        private clubService: ClubsService,
        private federationsService: FederationsService) {
    }

    ngOnInit() {
        this.tournamentTeamsService.getTeams().subscribe(
            res => this.teams = res,
            error => console.log(error));

        this.tournamentGroupsService.getGroups().subscribe(
            res => this.groups = res,
            error => console.log(error));

        this.federationsService.getFederations().subscribe(
            res => this.federations = res,
            error => console.log(error));
    }

    pickTypeTeam(event) {
        this.typeTeam = event.value;
    }

    onFilterCountry(event) {
        let query = null;

        if (event.value === '') {
            query = this.countriesService.getCountries();
        } else {
            query = this.countriesService.getCountriesFiltered(event.value);
        }

        query.subscribe(res => {
            this.countries = res;
        });
    }

    onFilterLeague(event) {
        let query = null;

        if (event.value === '') {
            query = this.leaguesService.getLeagues();
        } else {
            query = this.leaguesService.getLeaguesFilteredByFederation(event.value);
        }

        query.subscribe(res => {
            this.leagues = res;
        });
    }

    onFilterClub(event) {
        let query = null;

        if (event.value === '') {
            query = this.clubService.getClubs();
        } else {
            query = this.clubService.getClubsFiltered(event.value);
        }

        query.subscribe(res => {
            this.leagues = res;
        });
    }

    updateTeamGroups(event, t) {
        let newTeamSelected: any;
        let result: any;

        this.tournamentTeamsService.getTeamByTeamId(event.value, t.tournamentName).subscribe(
            res => {
                result = res;
                if (result.length < 1) {
                    this.countriesService.getCountryById(event.value).subscribe(
                        country => {
                            newTeamSelected = country;
                            // tslint:disable-next-line:max-line-length
                            this.tournamentTeamsService.updateTeam(t.id, event.value, newTeamSelected.name, newTeamSelected.flagUrl, this.tournamentId);
                            // tslint:disable-next-line:max-line-length
                            this.tournamentResultsService.addResultGroups(this.tournamentId, this.tournament.name, this.tournament.phaseFinals, t.group, event.value, newTeamSelected.name, newTeamSelected.flagUrl);
                        }, error => console.log(error));
                }
            }, error => console.log(error));
    }

    updateTeamFinals(event, t) {
        let newTeamSelected: any;
        let result: any;

        this.tournamentTeamsService.getTeamByTeamId(event.value, t.tournamentName).subscribe(
            res => {
                result = res;
                if (result.length < 1) {
                    this.countriesService.getCountryById(event.value).subscribe(
                        country => {
                            newTeamSelected = country;
                            // tslint:disable-next-line:max-line-length
                            this.tournamentTeamsService.updateTeam(t.id, event.value, newTeamSelected.name, newTeamSelected.flagUrl, this.tournamentId);
                            // tslint:disable-next-line:max-line-length
                            this.tournamentResultsService.addResultFinals(this.tournamentId, this.tournament.name, this.tournament.phaseFinals, t.group, event.value, newTeamSelected.name, newTeamSelected.flagUrl);
                        }, error => console.log(error));
                }
            }, error => console.log(error));
    }
}
