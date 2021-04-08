import {Component, OnInit} from '@angular/core';
import {Templates} from '../../../interfaces/templates';
import {User} from '../../../interfaces/user';
import {FirebaseApp} from '@angular/fire';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {TemplatesService} from '../../../services/templates/templates.service';
import {SingleMatchesService} from '../../../services/singleMatches/single-matches.service';
import {ListMatchesService} from '../../../services/listMatches/list-matches.service';
import {finalize} from 'rxjs/operators';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';

interface HtmlInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

@Component({
    selector: 'app-new-templates',
    templateUrl: './new-templates.component.html',
    styleUrls: ['./new-templates.component.css']
})
export class NewTemplatesComponent implements OnInit {
    matchDateLimit: string;
    matchTimeLimit: string;
    file: File;
    flagSelected: string | ArrayBuffer;
    task: AngularFireUploadTask;
    downloadURL: Observable<string>;

    newTemplate = {} as Templates;
    templates = [];
    codeTemplate: string;
    matches = [];
    user = {} as User;
    listMatches = [];

    minDate: { year: number, month: number, day: number };

    constructor(
        private storage: AngularFireStorage,
        private afs: AngularFirestore,
        public firebase: FirebaseApp,
        public auth: AuthService,
        private router: Router,
        private templatesService: TemplatesService,
        private singleMatchesService: SingleMatchesService,
        private listMatchesService: ListMatchesService) {
    }

    // tslint:disable-next-line:typedef
    ngOnInit() {
        this.user = this.firebase.auth().currentUser;
        this.codeTemplate = '';
        const characters = 'KvWxYz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < charactersLength; i++) {
            this.codeTemplate += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        this.templatesService.getTemplate().subscribe(
            res => this.templates = res,
            error => console.log(error));

        this.singleMatchesService.getSingleMatches().subscribe(
            res => this.matches = res,
            error => console.log(error));

        this.listMatchesService.getListMatches().subscribe(
            res => this.listMatches = res,
            error => console.log(error));

    }

    onFlagSelected(event: HtmlInputEvent): void {
        if (event.target.files && event.target.files[0]) {
            this.file = (event.target.files[0] as File);
            const reader = new FileReader();
            reader.onload = e => this.flagSelected = reader.result;
            reader.readAsDataURL(this.file);
            const path = `templates/${Date.now()}_${this.file.name}`;
            const ref = this.storage.ref(path);
            this.task = this.storage.upload(path, this.file);
            this.task.snapshotChanges().pipe(
                finalize(() => this.downloadURL = ref.getDownloadURL())
            ).subscribe();
        }
    }

    // tslint:disable-next-line:typedef
    updateDateMatch(event) {
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

    // tslint:disable-next-line:typedef
    updateTimeMatch(event) {
        this.matchTimeLimit = event.value + ':00';
    }

    addTemplate(flagUrl: HTMLInputElement): void {
        const dateTimeLimit = this.matchDateLimit + this.matchTimeLimit;
        const newDateTimeLimit = new Date(dateTimeLimit);
        const today = new Date();
        this.newTemplate.bannerUrl = flagUrl.value;
        this.newTemplate.codeTemplate = this.codeTemplate;
        this.newTemplate.date = today;
        this.newTemplate.limitDate = newDateTimeLimit;
        this.newTemplate.status = '0';
        this.newTemplate.publish = false;
        this.newTemplate.filed = false;
        this.templatesService.addTemplate(this.newTemplate);
        this.flagSelected = '';
        flagUrl.value = '';
        this.router.navigate(['/templates']);
    }

    addList(event, m, codeTemplate): void {
        /// date
        const today = new Date();
        let match = [];

        // Get list matches by code penka and single match id
        this.listMatchesService.getListMatchesByCodeTemplate(m.id, codeTemplate).subscribe(
            res => {
                match = res;
                console.log(match);

                if (match.length === 0) {
                    this.listMatchesService.addMatch(
                        m.id,
                        m.codePenka = '',
                        this.codeTemplate,
                        this.user.uid,
                        this.user.displayName,
                        this.user.email,
                        this.user.photoURL,
                        today,
                        m.homeTeamId,
                        m.homeTeamName,
                        m.homeTeamAlias,
                        m.homeTeamFlag,
                        m.visitTeamId,
                        m.visitTeamName,
                        m.visitTeamAlias,
                        m.visitTeamFlag,
                        m.startDate,
                        m.limitDate,
                        status = '1'
                    );

                } else {
                    alert('Es partido ya fue seleccionado');
                }


            },
            error => console.log(error));
    }

    delete(id): void {
        this.listMatchesService.deleteMatch(id);
    }
}
