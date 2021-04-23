import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { finalize, first, takeUntil } from 'rxjs/operators';
import { Templates } from 'src/app/interfaces/templates';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { ListMatchesService } from 'src/app/services/listMatches/list-matches.service';
import { SingleMatchesService } from 'src/app/services/singleMatches/single-matches.service';
import { TemplatesService } from 'src/app/services/templates/templates.service';

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-edit-templates',
  templateUrl: './edit-templates.component.html',
  styleUrls: ['./edit-templates.component.css']
})
export class EditTemplatesComponent implements OnInit, OnDestroy {
    matchDateLimit: string;
    matchTimeLimit: string;
    file: File;
    flagSelected: string | ArrayBuffer;
    task: AngularFireUploadTask;
    downloadURL: Observable<string>;

    newTemplate = {} as Templates;
    templates = []; // ToDo: eliminar
    
    // ToDo: nueva variable, eliminar las innecesarias
    template = {}  as Templates;
    templateMatches = [];
    codeTemplate: string;
    matches = [];
    user = {} as User;

    listMatches = []; // ToDo: eliminar

    minDate: { year: number, month: number, day: number };

    private unsubscribe$ = new Subject<void>();

    constructor(
        private storage: AngularFireStorage,
        private afs: AngularFirestore,
        public firebase: FirebaseApp,
        public auth: AuthService,
        private router: Router,
        private templatesService: TemplatesService,
        private singleMatchesService: SingleMatchesService,
        private listMatchesService: ListMatchesService,
        private activatedRoute: ActivatedRoute,
        ) {
    }

    // tslint:disable-next-line:typedef
    ngOnInit() {
        this.getUser();
        this.getCodeTemplate();
        this.getTemplate();
        this.getTemplateMatches();
        this.getPublishSingleMatches();
    }

    private getUser(): void {
        this.user = this.firebase.auth().currentUser;
    }

    private getCodeTemplate(): void {
        this.activatedRoute.params.subscribe(
            (params: Params) => {
                this.codeTemplate = params.id;
        });
    }

    private getTemplate(): void {
        this.templatesService.getTemplateByCode(this.codeTemplate).pipe(first()).subscribe(
            res => {
                this.template = res
                console.log(this.template)
            },
            error => {
                console.log(error)
        });
    }

    private getTemplateMatches(): void {
        // si rompe, pasar a llamada manual takeFirst
        this.listMatchesService.getListMatchesByCodeTemplate(this.codeTemplate)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(res => {
            this.templateMatches = res;
        });
    }

    private getPublishSingleMatches(): void {
        this.singleMatchesService.getPublishedSingleMatches().subscribe(
            res => {
                const templateSingleMatches  = this.templateMatches.map(m => m.singleMatchId);
                this.matches = res.filter( m => !templateSingleMatches.includes(m.id));
            },
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
        // let day = '';
        // let month = '';

        // if (event.day < 10) {
        //     day = '0' + event.day;
        // } else {
        //     day = event.day;
        // }
        // if (event.month < 10) {
        //     month = '0' + event.month;
        // } else {
        //     month = event.month;
        // }
        // this.matchDateLimit = event.year + '-' + month + '-' + day + 'T';
    }

    // tslint:disable-next-line:typedef
    updateTimeMatch(event) {
        this.matchTimeLimit = event.value + ':00';
    }

    addTemplate(flagUrl: HTMLInputElement): void {
        // const dateTimeLimit = this.matchDateLimit + this.matchTimeLimit;
        // const newDateTimeLimit = new Date(dateTimeLimit);
        // const today = new Date();
        // this.newTemplate.bannerUrl = flagUrl.value;
        // this.newTemplate.codeTemplate = this.codeTemplate;
        // this.newTemplate.date = today;
        // this.newTemplate.limitDate = newDateTimeLimit;
        // this.newTemplate.status = '0';
        // this.newTemplate.publish = false;
        // this.newTemplate.filed = false;
        // this.templatesService.addTemplate(this.newTemplate);
        // this.flagSelected = '';
        // flagUrl.value = '';
        // this.router.navigate(['/templates']);
    }

    addList(event, m, codeTemplate): void {
        // /// date
        // const today = new Date();
        // let match = [];

        // // Get list matches by code penka and single match id
        // this.listMatchesService.getListMatchesByCodeTemplate(m.id, codeTemplate).subscribe(
        //     res => {
        //         match = res;
        //         console.log(match);

        //         if (match.length === 0) {
        //             this.listMatchesService.addMatch(
        //                 m.id,
        //                 m.codePenka = '',
        //                 this.codeTemplate,
        //                 this.user.uid,
        //                 this.user.displayName,
        //                 this.user.email,
        //                 this.user.photoURL,
        //                 today,
        //                 m.homeTeamId,
        //                 m.homeTeamName,
        //                 m.homeTeamAlias,
        //                 m.homeTeamFlag,
        //                 m.visitTeamId,
        //                 m.visitTeamName,
        //                 m.visitTeamAlias,
        //                 m.visitTeamFlag,
        //                 m.startDate,
        //                 m.limitDate,
        //                 status = '1'
        //             );

        //         } else {
        //             alert('Es partido ya fue seleccionado');
        //         }


        //     },
        //     error => console.log(error));
    }

    delete(id): void {
        // this.listMatchesService.deleteMatch(id);
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}