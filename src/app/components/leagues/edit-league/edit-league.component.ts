import {Component, OnInit} from '@angular/core';
import {League} from '../../../interfaces/league';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CountriesService} from '../../../services/country/countries.service';
import {LeaguesService} from '../../../services/league/leagues.service';

@Component({
    selector: 'app-edit-league',
    templateUrl: './edit-league.component.html',
    styleUrls: ['./edit-league.component.css']
})
export class EditLeagueComponent implements OnInit {

    leagueId: string;
    league = {} as League;
    countries = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private countriesService: CountriesService,
        private leaguesService: LeaguesService,
        private router: Router) {
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe(
            (params: Params) => {
                this.leagueId = params.id;
            }
        );
        this.leaguesService.getLeagueById(this.leagueId).subscribe(
            res => this.league = res,
            error => console.log(error)
        );
        this.countriesService.getCountries().subscribe(
            res => this.countries = res,
            error => console.log(error)
        );
    }

    update() {
        this.leaguesService.updateLeague(this.leagueId, this.league);
        this.router.navigate(['leagues']).then();
    }

    back() {
        this.router.navigate(['leagues']).then();
    }
}
