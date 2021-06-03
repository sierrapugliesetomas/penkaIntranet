import {Component, OnDestroy, OnInit} from '@angular/core';
import {TemplatesService} from '../../services/templates/templates.service';
import {SingleMatchesService} from '../../services/singleMatches/single-matches.service';
import {ListMatchesService} from '../../services/listMatches/list-matches.service';
import {AuthService} from '../../services/auth.service';
import {FirebaseApp} from '@angular/fire';
import {Router} from '@angular/router';
import {User} from '../../interfaces/user';
import {Subject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {Templates} from '../../interfaces/templates';
import {ListMatches} from '../../interfaces/list-matches';
import { SingleMatch } from 'src/app/interfaces/single-match';
import { PenkaService } from 'src/app/services/penka/penka.service';
import { ParticipantsService } from 'src/app/services/participants/participants.service';
import { Penka } from 'src/app/interfaces/penka';
import { Participant } from 'src/app/interfaces/participant';
import { PenkaRequest } from 'src/app/interfaces/penka-request';
import { NotificationService } from 'src/app/services/notification/notification.service';

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

    singleMatches = {} as SingleMatch[];

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
        private listMatchesService: ListMatchesService,
        private penkaService: PenkaService,
        private participantService: ParticipantsService,
        private notificationService: NotificationService) {

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
        
        this.singleMatchesService.getSingleMatchesPublishByStatus('1')
        .pipe(
            takeUntil(this.unsubscribe$)
        )
        .subscribe(
            res => {
                this.singleMatches = res;
            });
    
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    showMatches(codeTemplate):void {
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

    goToEdit(codeTemplate): void {
        this.router.navigate(['templates/edit/' + codeTemplate])
    }

    async finnishTemplate(codeTemplate: string) {
        if (!this.hasOpenMatches(codeTemplate)) {
            if (confirm('Esta seguro que desea finalizar el Template?')) {
                this.penkaService.getPenkasByCodeTemplate(codeTemplate).pipe(first()).subscribe((relatedPenkas: Penka[]) => {
                    relatedPenkas.forEach(penka => {
                        this.penkaService.updateStatus(penka.id, '2');
                        this.updatePenkaParticipations(penka)
                    });
                });
            }

        } else {
            alert('Este template aún tiene partidos por jugar');
        }
            
    }

    private hasOpenMatches(codeTemplate: string): boolean {
        const relatedSingleMatchesIds = this.listMatches.filter(match => match.codeTemplate === codeTemplate).map(match => match.singleMatchId);
        const openMatch = this.singleMatches.find(match => relatedSingleMatchesIds.includes(match.id));
        
        return openMatch !== undefined;
    }

    private updatePenkaParticipations(penka: Penka): void {
        this.participantService.getParticipantByCodePenka(penka.codePenka)
        .pipe(first())
        .subscribe((participants: Participant[]) => {
            participants.forEach(p => {
                this.participantService.updateStatus(p.id, '2')
                this.participantService.updateFinishDate(p.id, new Date());
                this.penkaFinishUserNotification(p, penka);
            });
            this.setWinners(participants);
        });
    }

    private setWinners(participants: Participant[]) {
        let winners = [];
        const places = ['primero', 'segundo', 'tercero'];
        let placesIndex = 0;
        let previousScore = 0;
        
        for (let index = 0; (index < participants.length && placesIndex < 3); index++) {
            let actual = participants[index];

            if (previousScore === 0 || previousScore === actual.accumulatedScore ) {
                this.participantService.updatePlace(actual.id, places[placesIndex]);
                previousScore = actual.accumulatedScore;
                winners.push(actual);

            } else {
                if(winners.length < 3) {
                    placesIndex++;
                    previousScore = actual.accumulatedScore;
                    winners.push(actual);
                    this.participantService.updatePlace(actual.id, places[placesIndex]);
                }
            }
        }
    }

    private penkaFinishUserNotification(
        participant: Participant,
        penka: Penka
    ): void {
        let notification: PenkaRequest = {};
        notification.codePenka = penka.codePenka;
        notification.penkaName = penka.name;
        notification.makerId = penka.makerId;
        notification.makerName = penka.makerName;
        notification.makerEmail = penka.makerEmail;
        notification.makerPhoto = penka.makerPhoto;
        notification.userId = participant.userId;
        notification.userName = participant.userName;
        notification.userEmail = participant.userEmail;
        notification.userPhoto = participant.userPhoto;
        notification.message = '';
        notification.date = new Date();
        notification.status = '10';
        notification.timesShow = 0;
        this.notificationService.addNotification(notification);
    }
}
