import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { SingleMatch } from 'src/app/interfaces/single-match';
import { Templates } from 'src/app/interfaces/templates';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { ClubsService } from 'src/app/services/club/clubs.service';
import { CountriesService } from 'src/app/services/country/countries.service';
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
    // ToDo: nueva variable, eliminar las innecesarias
    template = {}  as Templates;
    templateMatches = [];
    codeTemplate: string;
    matches = [];
    user = {} as User;
    clubsAndCountries = [];
    form: FormGroup;

    minDate: { year: number, month: number, day: number };

    private unsubscribe$ = new Subject<void>();

    constructor(
        public firebase: FirebaseApp,
        public auth: AuthService,
        private templatesService: TemplatesService,
        private singleMatchesService: SingleMatchesService,
        private listMatchesService: ListMatchesService,
        private clubsService: ClubsService,
        private countriesService: CountriesService,
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        ) {
    }

    // tslint:disable-next-line:typedef
    ngOnInit() {
        this.getUser();
        this.initForm();
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
                this.template = res[0]
                this.mvp.setValue(this.template.mvp);
                this.maximumScorer.setValue(this.template.maximumScorer);
                // ToDo: no se actualiza la vista del input, si su valor
                this.champion.setValue(this.template.championName);
                this.champion.updateValueAndValidity();
                // ----------------------------------
            },
            error => {
                console.log(error)
        });
    }

    private getTemplateMatches(): void {
        this.listMatchesService.getListMatchesByCodeTemplate(this.codeTemplate)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(res => {
            this.templateMatches = res;
            this.getTeams();
        });
    }

    private getPublishSingleMatches(): void {
        this.singleMatchesService.getPublishedSingleMatches()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
            res => {
                const templateSingleMatches  = this.templateMatches.map(m => m.singleMatchId);
                this.matches = res.filter( m => !templateSingleMatches.includes(m.id));
            },
            error => console.log(error));
    }

    private initForm(): void {
        this.form = this.formBuilder.group({
            mvp: [],
            maximumScorer: [],
            champion: [],
        });
    }

    private getTeams() {
        let idList = [];
        this.clubsAndCountries = [];

        this.templateMatches.forEach((m: SingleMatch) => {
            if(!idList.includes(m.homeTeamId)) {
                idList.push(m.homeTeamId);
            } 

            if(!idList.includes(m.visitTeamId)) {
                idList.push(m.visitTeamId)
            }
        });

        this.clubsService.getClubs()
        .pipe(first())
        .subscribe(
            res => {
                res.forEach(c => {
                    if (idList.includes(c.id)) {
                        this.clubsAndCountries.push(c);
                    }
                })
                console.log(this.clubsAndCountries);
        });

        this.countriesService.getCountries()
        .pipe(first())
        .subscribe(
            res => {
                res.forEach(c => {
                    if(idList.includes(c.id)) {
                        this.clubsAndCountries.push(c);
                    }
                })
                console.log(this.clubsAndCountries);
            })
    }

    // tslint:disable-next-line:typedef

    addList(event, m, codeTemplate): void {
        /// date
        const today = new Date();
        let match = [];

        // Get list matches by code penka and single match id
        this.listMatchesService.getListMatchesByCodeTemplateAndSingleMatchId(m.id, codeTemplate)
        .pipe(first())
        .subscribe(
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
                this.getPublishSingleMatches();

                } else {
                    alert('Es partido ya fue seleccionado');
                }


            },
            error => console.log(error));
    }

    delete(id): void {
        this.listMatchesService.deleteMatch(id);
        this.getPublishSingleMatches();
    }

    saveForm(): void {
        if(this.form.valid) {
            this.templatesService.updateMvp(this.template.id, this.mvp.value);
            this.templatesService.updateMaximumScorer(this.template.id, this.maximumScorer.value);
            this.templatesService.updateChampion(this.template.id, this.clubsAndCountries.find(c => c.id === this.champion.value));
        }
    }

    get maximumScorer(): AbstractControl {
        return this.form.controls.maximumScorer;
    }

    get mvp(): AbstractControl {
        return this.form.controls.mvp;
    }

    get champion(): AbstractControl {
        return this.form.controls.champion;
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}