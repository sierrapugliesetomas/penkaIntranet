import {Component, OnInit} from '@angular/core';
import {CountriesService} from '../../../services/country/countries.service';
import {FederationsService} from '../../../services/federation/federations.service';
import {LeaguesService} from '../../../services/league/leagues.service';
import {ClubsService} from '../../../services/club/clubs.service';
import {SingleMatch} from '../../../interfaces/single-match';
import {SingleMatchesService} from '../../../services/singleMatches/single-matches.service';
import {Router} from '@angular/router';
import {TournamentService} from '../../../services/Tournament/tournament.service';
import {CompetitionService} from '../../../services/competition/competition.service';

@Component({
    selector: 'app-new-single-match',
    templateUrl: './new-single-match.component.html',
    styleUrls: ['./new-single-match.component.css']
})
export class NewSingleMatchComponent implements OnInit {

    matchDate: string;
    matchTime: string;
    matchDateLimit: string;
    matchTimeLimit: string;

    countries = [];
    clubs = [];
    federations = [];
    leagues = [];
    tournaments = [];
    competitions = [];

    newSingleMatch = {} as SingleMatch;

    minDate: { year: number, month: number, day: number };


    constructor(
        private tournamentService: TournamentService,
        private countriesService: CountriesService,
        private federationsService: FederationsService,
        private leaguesService: LeaguesService,
        private clubService: ClubsService,
        private singleMatchesService: SingleMatchesService,
        private competitionsService: CompetitionService,
        private router: Router) {

        const current = new Date();
        this.minDate = {
            year: current.getFullYear(),
            month: current.getMonth() + 1,
            day: current.getDate()
        };

    }

    ngOnInit(): void {
        this.tournamentService.getTournaments().subscribe(
            res => this.tournaments = res,
            error => console.log(error));

        this.federationsService.getFederations().subscribe(
            res => this.federations = res,
            error => console.log(error));

        this.leaguesService.getLeagues().subscribe(
            res => this.leagues = res,
            error => console.log(error));

        this.competitionsService.getCompetitions().subscribe(
            res => this.competitions = res,
            error => console.log(error));
    }

    typeTeam(event): void {
        this.newSingleMatch.typeTeam = event.value;
    }

    homeTeamNational(event): void {
        let country: any = [];
        this.countriesService.getCountryById(event.value).subscribe(
            res => {
                country = res;
                this.newSingleMatch.homeTeamId = event.value;
                this.newSingleMatch.homeTeamName = country.name;
                this.newSingleMatch.homeTeamAlias = country.alias;
                this.newSingleMatch.homeTeamFlag = country.flagUrl;
                this.newSingleMatch.homeTeamScore = null;
            }, error => console.log(error));
    }

    visitTeamNational(event): void {
        let country: any = [];
        this.countriesService.getCountryById(event.value).subscribe(
            res => {
                country = res;
                this.newSingleMatch.visitTeamId = event.value;
                this.newSingleMatch.visitTeamName = country.name;
                this.newSingleMatch.visitTeamAlias = country.alias;
                this.newSingleMatch.visitTeamFlag = country.flagUrl;
                this.newSingleMatch.visitTeamScore = null;
            }, error => console.log(error));
    }

    homeTeamClub(event): void {
        let club: any = [];
        this.clubService.getClubById(event.value).subscribe(
            res => {
                club = res;
                this.newSingleMatch.homeTeamId = event.value;
                this.newSingleMatch.homeTeamName = club.name;
                this.newSingleMatch.homeTeamAlias = club.alias;
                this.newSingleMatch.homeTeamFlag = club.flagUrl;
                this.newSingleMatch.homeTeamScore = null;
            }, error => console.log(error));
    }

    visitTeamClub(event): void {
        let club: any = [];
        this.clubService.getClubById(event.value).subscribe(
            res => {
                club = res;
                this.newSingleMatch.visitTeamId = event.value;
                this.newSingleMatch.visitTeamName = club.name;
                this.newSingleMatch.visitTeamAlias = club.alias;
                this.newSingleMatch.visitTeamFlag = club.flagUrl;
                this.newSingleMatch.visitTeamScore = null;
            }, error => console.log(error));
    }

    filterCountry(event): void {
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

    filterClub(event): void {
        let query = null;
        if (event.value === '') {
            query = this.clubService.getClubs();
        } else {
            query = this.clubService.getClubsFiltered(event.value);
        }
        query.subscribe(res => {
            this.clubs = res;
        });
    }

    updateDateMatch(event): void {
        let day = '';
        let month = '';

        if (event.day < 10) {
            day = '0' + event.day;
        } else {
            day = event.day;
        }
        if (event.month < 10) {
            month = '0' + event.month;
        } else {
            month = event.month;
        }
        this.matchDate = event.year + '-' + month + '-' + day + 'T';
    }

    updateTimeMatch(event): void {
        this.matchTime = event.value + ':00';
    }

    updateDateLimit(event): void {
        let day = '';
        let month = '';

        if (event.day < 10) {
            day = '0' + event.day;
        } else {
            day = event.day;
        }
        if (event.month < 10) {
            month = '0' + event.month;
        } else {
            month = event.month;
        }
        this.matchDateLimit = event.year + '-' + month + '-' + day + 'T';
    }

    updateTimeLimit(event): void {
        this.matchTimeLimit = event.value + ':00';
    }

    add(): void {
        const dateTimeLimit = this.matchDateLimit + this.matchTimeLimit;
        const newDateTimeLimit = new Date(dateTimeLimit);
        const dateTime = this.matchDate + this.matchTime;
        const newDateTime = new Date(dateTime);

        if (this.newSingleMatch.homeTeamId && this.newSingleMatch.visitTeamId) {
            this.newSingleMatch.status = '1';
            this.newSingleMatch.publish = false;
            this.newSingleMatch.selected = '';
            this.newSingleMatch.startDate = newDateTime;
            this.newSingleMatch.limitDate = newDateTimeLimit;
            this.singleMatchesService.addMatch(this.newSingleMatch);
            this.router.navigate(['singleMatches']);
        } else {
            alert('Debe llenar todos los campos');
        }
    }

}
