import {Component, OnInit} from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {Competition} from '../../interfaces/competition';
import {CompetitionService} from '../../services/competition/competition.service';

interface HtmlInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

@Component({
    selector: 'app-competitions',
    templateUrl: './competitions.component.html',
    styleUrls: ['./competitions.component.css']
})
export class CompetitionsComponent implements OnInit {

    file: File;
    flagSelected: string | ArrayBuffer;
    task: AngularFireUploadTask;
    downloadURL: Observable<string>;

    newCompetition = {} as Competition;
    competitions = [];

    constructor(
        private storage: AngularFireStorage,
        private afs: AngularFirestore,
        private competitionsService: CompetitionService,
        private router: Router) {
    }

    ngOnInit() {
        this.competitionsService.getCompetitions().subscribe(
            res => this.competitions = res,
            error => console.log(error));
    }

    add(flagUrl: HTMLInputElement) {
        this.newCompetition.flagUrl = flagUrl.value;
        this.competitionsService.addCompetition(this.newCompetition);
        this.newCompetition = {} as Competition;
        this.flagSelected = '';
        flagUrl.value = '';
    }

    delete(event, competition: Competition) {
        if (confirm('Desea borrar: "' + competition.name + '"')) {
            this.competitionsService.deleteCompetition(competition.id);
            return this.storage.storage.refFromURL(competition.flagUrl).delete();
        }
    }

    edit(event, competition: Competition) {
        this.router.navigate(['competition/edit/' + competition.id]).then();
    }

    onFlagSelected(event: HtmlInputEvent): void {
        if (event.target.files && event.target.files[0]) {
            this.file = (event.target.files[0] as File);
            const reader = new FileReader();
            reader.onload = e => this.flagSelected = reader.result;
            reader.readAsDataURL(this.file);
            const path = `competitions/${Date.now()}_${this.file.name}`;
            const ref = this.storage.ref(path);
            this.task = this.storage.upload(path, this.file);
            this.task.snapshotChanges().pipe(
                finalize(() => this.downloadURL = ref.getDownloadURL())
            ).subscribe();
        }
    }

}
