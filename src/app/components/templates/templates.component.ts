import {Component, OnDestroy, OnInit} from '@angular/core';
import {TemplatesService} from '../../services/templates/templates.service';
import {SingleMatchesService} from '../../services/singleMatches/single-matches.service';
import {ListMatchesService} from '../../services/listMatches/list-matches.service';
import {AuthService} from '../../services/auth.service';
import {FirebaseApp} from '@angular/fire';
import {Router} from '@angular/router';
import {User} from '../../interfaces/user';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Templates} from '../../interfaces/templates';
import {ListMatches} from '../../interfaces/list-matches';

@Component({
    selector: 'app-templates',
    templateUrl: './templates.component.html',
    styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit, OnDestroy {


    templates = [] as Templates[];
    codeTemplate: string;

    user = {} as User;
    listMatches = [] as ListMatches[];

    private unsubscribe$ = new Subject<void>();

    today = new Date();
    day: string;
    month: string;
    year: string;
    hour: string;
    minute: string;
    date: string;
    time: string;

    constructor(
        public firebase: FirebaseApp,
        public auth: AuthService,
        private router: Router,
        private templatesService: TemplatesService,
        private singleMatchesService: SingleMatchesService,
        private listMatchesService: ListMatchesService) {

        if (this.today.getDate() < 10) {
            this.day = '0' + this.today.getDate();
        } else {
            this.day = '' + this.today.getDate();
        }
        if ((this.today.getMonth() + 1) < 10) {
            this.month = '0' + (this.today.getMonth() + 1);
        } else {
            this.month = '' + (this.today.getMonth() + 1);
        }
        this.year = '' + this.today.getFullYear();
        if (this.today.getHours() < 10) {
            this.hour = '0' + this.today.getHours();
        } else {
            this.hour = '' + this.today.getHours();
        }
        if (this.today.getMinutes() < 10) {
            this.minute = '0' + this.today.getMinutes();
        } else {
            this.minute = '' + this.today.getMinutes();
        }

        this.date = this.month + '-' + this.day + '-' + this.year;
        this.time = this.hour + ':' + this.minute;
    }

    ngOnInit(): void {
        this.templatesService.getTemplate()
            .pipe(
                takeUntil(this.unsubscribe$)
            )
            .subscribe(
                res => {
                    this.templates = res;
                });

        this.listMatchesService.getListMatches()
            .pipe(
                takeUntil(this.unsubscribe$)
            )
            .subscribe(
                res => {
                    this.listMatches = res;
                });
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    showMatches(codeTemplate) {
        this.codeTemplate = codeTemplate;
    }

    delete(id): any {
        if (confirm('Esta seguro que desea eliminar el Template?')) {
            this.templatesService.delete(id);
        }
    }

    publish(id): any {
        if (confirm('Esta seguro que desea Publicar el Template?')) {
            this.templatesService.publish(id);
        }
    }

    stock(id): any {
        if (confirm('Esta seguro que desea Archivar el Template?')) {
            this.templatesService.stock(id);
        }
    }
}
