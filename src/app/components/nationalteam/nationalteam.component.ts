import {Component, OnInit} from '@angular/core';
import {CountriesService} from '../../services/country/countries.service';
import {FederationsService} from '../../services/federation/federations.service';
import {PlayersService} from '../../services/player/players.service';
import {Country} from '../../interfaces/country';
import {NationalteamsService} from '../../services/nationalTeam/nationalteams.service';

@Component({
    selector: 'app-nationalteam',
    templateUrl: './nationalteam.component.html',
    styleUrls: ['./nationalteam.component.css']
})
export class NationalteamComponent implements OnInit {

    countries = [];
    federations = [];
    players = [];
    country = {} as Country;
    nationalteams = [];

    constructor(
        private countriesService: CountriesService,
        private federationsService: FederationsService,
        private playersService: PlayersService,
        private nationalteamsService: NationalteamsService) {

    }

    ngOnInit() {
        this.federationsService.getFederations().subscribe(
            res => this.federations = res,
            error => console.log(error)
        );
        this.nationalteamsService.getNationalTeams().subscribe(
            res => this.nationalteams = res,
            error => console.log(error)
        );
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

    onFilterPlayer(event) {
        let query = null;
        if (event.value === '') {
            query = this.playersService.getPlayers();
        } else {
            query = this.playersService.getPlayersNationalTeams(event.value);
        }
        query.subscribe(res => {
            this.players = res;
        });
    }

    add(event, player) {
        player.nationalTeam = true;
        this.nationalteamsService.addNationalTeam(player.id, player.name, player.country, player.photoUrl);
        this.playersService.addNationalTeam(player.id);
    }

    delete(event, player) {
        this.nationalteamsService.deleteNationalTeam(player.id);
        this.playersService.dropNationalTeam(player.playerId);
    }
}
