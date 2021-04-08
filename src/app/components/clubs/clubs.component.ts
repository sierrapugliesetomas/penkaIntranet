import {Component, OnInit} from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {Club} from '../../interfaces/club';
import {AngularFirestore} from '@angular/fire/firestore';
import {LeaguesService} from '../../services/league/leagues.service';
import {Router} from '@angular/router';
import {ClubsService} from '../../services/club/clubs.service';
import {finalize} from 'rxjs/operators';

interface HtmlInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

@Component({
    selector: 'app-clubs',
    templateUrl: './clubs.component.html',
    styleUrls: ['./clubs.component.css']
})
export class ClubsComponent implements OnInit {

    file: File;
    flagSelected: string | ArrayBuffer;
    task: AngularFireUploadTask;
    downloadURL: Observable<string>;

    clubs = [];
    leagues = [];
    newClub = {} as Club;

    constructor(
        private storage: AngularFireStorage,
        private afs: AngularFirestore,
        private leaguesService: LeaguesService,
        private clubsService: ClubsService,
        private router: Router) {
    }

    ngOnInit() {
        this.clubsService.getClubs().subscribe(
            res => this.clubs = res,
            error => console.log(error)
        );
        this.leaguesService.getLeagues().subscribe(
            res => this.leagues = res,
            error => console.log(error)
        );
    }

    add(flagUrl: HTMLInputElement) {
        this.newClub.flagUrl = flagUrl.value;
        this.clubsService.addClub(this.newClub);
        this.newClub = {} as Club;
        this.flagSelected = '';
        flagUrl.value = '';
    }

    delete(event, club: Club) {
        if (confirm('Desea borrar: "' + club.name + '"')) {
            this.clubsService.deleteClub(club.id);
            return this.storage.storage.refFromURL(club.flagUrl).delete();
        }
    }

    edit(event, club: Club) {
        this.router.navigate(['clubs/edit/' + club.id]).then();
    }

    onFlagSelected(event: HtmlInputEvent): void {
        if (event.target.files && event.target.files[0]) {
            this.file = (event.target.files[0] as File);
            const reader = new FileReader();
            reader.onload = e => this.flagSelected = reader.result;
            reader.readAsDataURL(this.file);
            const path = `clubs/${Date.now()}_${this.file.name}`;
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
            query = this.clubsService.getClubs();
        } else {
            query = this.clubsService.getClubsFiltered(event.value);
        }
        query.subscribe(res => {
            this.clubs = res;
        });
    }
}
