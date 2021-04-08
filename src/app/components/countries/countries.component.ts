import {Component, OnInit} from '@angular/core';
import {Country} from '../../interfaces/country';
import {CountriesService} from '../../services/country/countries.service';
import {Router} from '@angular/router';
import {FederationsService} from '../../services/federation/federations.service';
import {Observable} from 'rxjs';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import {finalize} from 'rxjs/operators';


interface HtmlInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

@Component({
    selector: 'app-countries',
    templateUrl: './countries.component.html',
    styleUrls: ['./countries.component.css']
})

export class CountriesComponent implements OnInit {

    file: File;
    flagSelected: string | ArrayBuffer;
    task: AngularFireUploadTask;
    downloadURL: Observable<string>;

    countries = [];
    federations = [];
    newCountry = {} as Country;

    constructor(
        private storage: AngularFireStorage,
        private afs: AngularFirestore,
        private countriesService: CountriesService,
        private federationService: FederationsService,
        private router: Router) {
    }

    ngOnInit() {
        this.countriesService.getCountries().subscribe(
            res => this.countries = res,
            error => console.log(error)
        );
        this.federationService.getFederations().subscribe(
            res => this.federations = res,
            error => console.log(error)
        );
    }

    add(flagUrl: HTMLInputElement) {
        this.newCountry.flagUrl = flagUrl.value;
        this.countriesService.addCountry(this.newCountry);
        this.newCountry = {} as Country;
        this.flagSelected = '';
        flagUrl.value = '';
    }

    delete(event, country: Country) {
        if (confirm('Desea Borrar: "' + country.name + '"')) {
            this.countriesService.deleteCountry(country.id);
            return this.storage.storage.refFromURL(country.flagUrl).delete();
        }
    }

    edit(event, country: Country) {
        this.router.navigate(['countries/edit/' + country.id]).then();
    }

    onFlagSelected(event: HtmlInputEvent): void {
        if (event.target.files && event.target.files[0]) {
            this.file = (event.target.files[0] as File);
            const reader = new FileReader();
            reader.onload = e => this.flagSelected = reader.result;
            reader.readAsDataURL(this.file);
            const path = `countries/${Date.now()}_${this.file.name}`;
            const ref = this.storage.ref(path);
            this.task = this.storage.upload(path, this.file);
            this.task.snapshotChanges().pipe(
                finalize(() => this.downloadURL = ref.getDownloadURL())
            ).subscribe();
        }
    }

    onFilter(event) {
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
}
