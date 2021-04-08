import {Component, OnInit} from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {League} from '../../interfaces/league';
import {AngularFirestore} from '@angular/fire/firestore';
import {LeaguesService} from '../../services/league/leagues.service';
import {CountriesService} from '../../services/country/countries.service';
import {Router} from '@angular/router';
import {finalize} from 'rxjs/operators';

interface HtmlInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

@Component({
    selector: 'app-leagues',
    templateUrl: './leagues.component.html',
    styleUrls: ['./leagues.component.css']
})
export class LeaguesComponent implements OnInit {

    file: File;
    flagSelected: string | ArrayBuffer;
    task: AngularFireUploadTask;
    downloadURL: Observable<string>;

    leagues = [];
    countries = [];
    newLeague = {} as League;

    constructor(
        private storage: AngularFireStorage,
        private afs: AngularFirestore,
        private leaguesService: LeaguesService,
        private countriesService: CountriesService,
        private router: Router) {
    }

    ngOnInit() {
        this.leaguesService.getLeagues().subscribe(
            res => this.leagues = res,
            error => console.log(error)
        );
        this.countriesService.getCountries().subscribe(
            res => this.countries = res,
            error => console.log()
        );
    }

    add(flagUrl: HTMLInputElement) {
        this.newLeague.flagUrl = flagUrl.value;
        this.leaguesService.addLeague(this.newLeague);
        this.newLeague = {} as League;
        this.flagSelected = '';
        flagUrl.value = '';
    }

    delete(event, league: League) {
        if (confirm('Desea borrar: "' + league.name + '"')) {
            this.leaguesService.deleteLeague(league.id);
            return this.storage.storage.refFromURL(league.flagUrl).delete();
        }
    }

    edit(event, league: League) {
        this.router.navigate(['leagues/edit/' + league.id]).then();
    }

    onFlagSelected(event: HtmlInputEvent): void {
        if (event.target.files && event.target.files[0]) {
            this.file = (event.target.files[0] as File);
            const reader = new FileReader();
            reader.onload = e => this.flagSelected = reader.result;
            reader.readAsDataURL(this.file);
            const path = `leagues/${Date.now()}_${this.file.name}`;
            const ref = this.storage.ref(path);
            this.task = this.storage.upload(path, this.file);
            this.task.snapshotChanges().pipe(
                finalize(() => this.downloadURL = ref.getDownloadURL())
            ).subscribe();
        }
    }
}
