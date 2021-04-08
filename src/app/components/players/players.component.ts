import {Component, OnInit} from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {Player} from '../../interfaces/player';
import {AngularFirestore} from '@angular/fire/firestore';
import {LeaguesService} from '../../services/league/leagues.service';
import {ClubsService} from '../../services/club/clubs.service';
import {Router} from '@angular/router';
import {CountriesService} from '../../services/country/countries.service';
import {PlayersService} from '../../services/player/players.service';
import {finalize} from 'rxjs/operators';
import {FederationsService} from '../../services/federation/federations.service';

interface HtmlInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

@Component({
    selector: 'app-players',
    templateUrl: './players.component.html',
    styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {

    file: File;
    photoSelected: string | ArrayBuffer;
    task: AngularFireUploadTask;
    downloadURL: Observable<string>;

    federations = [];
    clubs = [];
    countries = [];
    leagues = [];
    players = [];
    newPlayer = {} as Player;

    constructor(
        private storage: AngularFireStorage,
        private afs: AngularFirestore,
        private playersService: PlayersService,
        private leaguesService: LeaguesService,
        private countriesService: CountriesService,
        private clubsService: ClubsService,
        private federationsService: FederationsService,
        private router: Router) {
    }

    ngOnInit() {
        this.playersService.getPlayers().subscribe(
            res => this.players = res,
            error => console.log(error)
        );
        this.leaguesService.getLeagues().subscribe(
            res => this.leagues = res,
            error => console.log(error)
        );
        this.federationsService.getFederations().subscribe(
            res => this.federations = res,
            error => console.log(error)
        );
    }

    add(photoUrl: HTMLInputElement) {
        this.newPlayer.active = true;
        this.newPlayer.nationalTeam = false;
        this.newPlayer.photoUrl = photoUrl.value;
        this.playersService.addPlayer(this.newPlayer);
        this.newPlayer = {} as Player;
        this.photoSelected = '';
        photoUrl.value = '';
    }

    delete(event, player: Player) {
        if (confirm('Desea borrar: "' + player.name + '"')) {
            this.playersService.deletePlayer(player.id);
            return this.storage.storage.refFromURL(player.photoUrl).delete();
        }
    }

    edit(event, player: Player) {
        this.router.navigate(['players/edit/' + player.id]).then();
    }

    onFlagSelected(event: HtmlInputEvent): void {
        if (event.target.files && event.target.files[0]) {
            this.file = (event.target.files[0] as File);
            const reader = new FileReader();
            reader.onload = e => this.photoSelected = reader.result;
            reader.readAsDataURL(this.file);
            const path = `players/${Date.now()}_${this.file.name}`;
            const ref = this.storage.ref(path);
            this.task = this.storage.upload(path, this.file);
            this.task.snapshotChanges().pipe(
                finalize(() => this.downloadURL = ref.getDownloadURL())
            ).subscribe();
        }
    }

    onFilterPlayerByCountry(event) {
        let query = null;
        if (event.value === '') {
            query = this.playersService.getPlayers();
        } else {
            query = this.playersService.getPlayersFiltered(event.value);
        }
        query.subscribe(res => {
            this.players = res;
        });
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
