import {Component, OnInit} from '@angular/core';
import {Player} from '../../../interfaces/player';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FederationsService} from '../../../services/federation/federations.service';
import {LeaguesService} from '../../../services/league/leagues.service';
import {PlayersService} from '../../../services/player/players.service';
import {CountriesService} from '../../../services/country/countries.service';
import {ClubsService} from '../../../services/club/clubs.service';

@Component({
    selector: 'app-edit-player',
    templateUrl: './edit-player.component.html',
    styleUrls: ['./edit-player.component.css']
})
export class EditPlayerComponent implements OnInit {

    playerId: string;
    player = {} as Player;
    federations = [];
    leagues = [];
    countries = [];
    clubs = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private federationsService: FederationsService,
        private leaguesService: LeaguesService,
        private playersService: PlayersService,
        private countriesService: CountriesService,
        private clubsService: ClubsService) {
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe(
            (params: Params) => {
                this.playerId = params.id;
            }
        );
        this.playersService.getPlayerById(this.playerId).subscribe(
            res => this.player = res,
            error => console.log(error)
        );
        this.federationsService.getFederations().subscribe(
            res => this.federations = res,
            error => console.log(error)
        );
        this.leaguesService.getLeagues().subscribe(
            res => this.leagues = res,
            error => console.log(error)
        );
    }

    update() {
        this.playersService.updatePlayer(this.playerId, this.player);
        this.router.navigate(['players']).then();
    }

    back() {
        this.router.navigate(['players']).then();
    }

    filterCountry(event) {
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

    filterClub(event) {
        let query = null;
        if (event.value === '') {
            query = this.clubsService.getClubs();
        } else {
            query = this.clubsService.getClubsFiltered(event.value);
        }
        query.subscribe(res => {
            this.clubs = res;
        });
    }

}
