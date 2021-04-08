import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FederationsService} from '../../../services/federation/federations.service';
import {CountriesService} from '../../../services/country/countries.service';
import {Country} from '../../../interfaces/country';

@Component({
    selector: 'app-edit-country',
    templateUrl: './edit-country.component.html',
    styleUrls: ['./edit-country.component.css']
})

export class EditCountryComponent implements OnInit {

    countryId: string;
    country = {} as Country;
    federations = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private federationsService: FederationsService,
        private countriesService: CountriesService,
        private router: Router) {
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe(
            (params: Params) => {
                this.countryId = params.id;
            }
        );
        this.countriesService.getCountryById(this.countryId).subscribe(
            res => this.country = res,
            error => console.log(error)
        );
        this.federationsService.getFederations().subscribe(
            res => this.federations = res,
            error => console.log(error)
        );
    }

    update() {
        this.countriesService.updateCountry(this.countryId, this.country);
        this.router.navigate(['countries']).then();
    }

    back() {
        this.router.navigate(['countries']).then();
    }
}
