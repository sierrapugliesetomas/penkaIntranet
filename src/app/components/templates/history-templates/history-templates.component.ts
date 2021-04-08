import {Component, OnInit} from '@angular/core';
import {User} from '../../../interfaces/user';
import {FirebaseApp} from '@angular/fire';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {TemplatesService} from '../../../services/templates/templates.service';
import {SingleMatchesService} from '../../../services/singleMatches/single-matches.service';
import {ListMatchesService} from '../../../services/listMatches/list-matches.service';

@Component({
    selector: 'app-history-templates',
    templateUrl: './history-templates.component.html',
    styleUrls: ['./history-templates.component.css']
})
export class HistoryTemplatesComponent implements OnInit {


    templates = [];
    codePenka: string;

    user = {} as User;
    listMatches = [];

    constructor(
        public firebase: FirebaseApp,
        public auth: AuthService,
        private router: Router,
        private templatesService: TemplatesService,
        private singleMatchesService: SingleMatchesService,
        private listMatchesService: ListMatchesService) {
    }

    ngOnInit(): void {
        this.templatesService.getTemplate().subscribe(
            res => this.templates = res,
            error => console.log(error));

        this.listMatchesService.getListMatches().subscribe(
            res => this.listMatches = res,
            error => console.log(error));
    }

    showMatches(codePenka): void {
        this.codePenka = codePenka;
    }

    delete(id): void {
        if (confirm('Esta seguro que desea eliminar el Template?')) {
            this.templatesService.delete(id);
        }
    }

}
