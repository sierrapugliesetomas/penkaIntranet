import {Component, OnDestroy, OnInit} from '@angular/core';
import {SingleMatchesService} from '../../services/singleMatches/single-matches.service';
import {GambleService} from '../../services/gamble/gamble.service';
import {Gamble} from '../../interfaces/gamble';
import {Subject} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';
import {CompetitionService} from '../../services/competition/competition.service';

@Component({
    selector: 'app-single-matches',
    templateUrl: './single-matches.component.html',
    styleUrls: ['./single-matches.component.css']
})
export class SingleMatchesComponent implements OnInit, OnDestroy {
    datepicker = '';
    searchText: string;

    singleMatches = [];
    competitions = [];

    private unsubscribe$ = new Subject<void>();

    constructor(
        private singleMatchesService: SingleMatchesService,
        private gambleService: GambleService,
        private competitionService: CompetitionService) {
    }

    ngOnInit(): void {
        this.singleMatchesService.getSingleMatches()
        .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                res => {
                    this.singleMatches = res;
                }, error => console.log(error));

        this.competitionService.getCompetitions()
            .subscribe(
                res => {
                    this.competitions = res;
                }, error => console.log(error));
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    updateDateMatch(event, id): void {
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const startDate = event.day + ' de ' + months[(event.month - 1)] + ' de ' + event.year;
        this.singleMatchesService.updateDateMatch(id, startDate);
    }

    publish(id): void {
        if (confirm('Esta seguro que desea Publicar el Partido?')) {
            this.singleMatchesService.publish(id);
        }
    }

    // tslint:disable-next-line:typedef
    gameStatus(event, match) {
        if (event.value === '2') {
            if (confirm('Desea confirmar el partido por finalizado?')) {
                this.singleMatchesService.updateStatus(match.id, event.value);
            }
        } else if (event.value === '1') {
            if (confirm('Desea modificar el partido?')) {
                this.singleMatchesService.updateStatus(match.id, event.value);
            }
        }

        /* get gambles match */
        let gamble = [] as Gamble[];
        let score = 0;

        this.gambleService.getGamblesBySingleMatchId(match.id)
            .pipe(
                take(1)
            )
            .subscribe(
            res => {
                gamble = res;

                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < gamble.length; i++) {
                    /* gamble PRO */
                    if (gamble[i].penkaFormat === 'PRO') {
                        // exact result
                        if ((match.homeTeamScore === gamble[i].homeTeamScore) && (match.visitTeamScore === gamble[i].visitTeamScore)) {
                            score = 5;
                        } // draw or winner but not exact result
                        else if ((match.draw === true && gamble[i].draw) || (match.winnerId === gamble[i].winnerTeamId)) {
                            score = 3;
                        } else {
                            score = 0;
                        }
                    }
                    /* gamble MEDIUM*/
                    if (gamble[i].penkaFormat === 'MEDIUM') {
                        if (match.draw === true || match.winnerId === gamble[i].winnerTeamId) {
                            score = 3;
                        } else {
                            score = 0;
                        }
                    }
                    /*************************/
                    this.gambleService.updateScoreAchieve(gamble[i].id, score, '2');
                }
            });
    }

    updateHomeScore(event, id): void {
        let match: any = [];

        this.singleMatchesService.getSingleMatchById(id)
            .pipe(
                take(1)
            )
            .subscribe(
                res => {

                    match = res;
                    this.singleMatchesService.updateHomeScore(id, Number(event.value));
                    match.homeTeamScore = Number(event.value);

                    if (match.homeTeamScore > match.visitTeamScore) {
                        this.singleMatchesService.updateWinner(id, match.homeTeamId, match.homeTeamName, match.homeTeamFlag);
                        this.singleMatchesService.updateLoser(id, match.visitTeamId, match.visitTeamName, match.visitTeamFlag);
                        this.singleMatchesService.updateDraw(id, false);

                    } else if (match.homeTeamScore < match.visitTeamScore) {
                        this.singleMatchesService.updateWinner(id, match.visitTeamId, match.visitTeamName, match.visitTeamFlag);
                        this.singleMatchesService.updateLoser(id, match.homeTeamId, match.homeTeamName, match.homeTeamFlag);
                        this.singleMatchesService.updateDraw(id, false);

                    } else if (match.homeTeamScore === match.visitTeamScore) {
                        this.singleMatchesService.updateWinner(id, '', '', '');
                        this.singleMatchesService.updateLoser(id, '', '', '');
                        this.singleMatchesService.updateDraw(id, true);
                    }
                });
    }

    updateVisitScore(event, id): void {
        let match: any = [];
        this.singleMatchesService.getSingleMatchById(id)
            .pipe(
                take(1)
            )
            .subscribe(
                res => {
                    match = res;
                    this.singleMatchesService.updateVisitScore(id, Number(event.value));
                    match.visitTeamScore = Number(event.value);
                    if (match.homeTeamScore > match.visitTeamScore) {
                        this.singleMatchesService.updateWinner(id, match.homeTeamId, match.homeTeamName, match.homeTeamFlag);
                        this.singleMatchesService.updateLoser(id, match.visitTeamId, match.visitTeamName, match.visitTeamFlag);
                        this.singleMatchesService.updateDraw(id, false);

                    } else if (match.homeTeamScore < match.visitTeamScore) {
                        this.singleMatchesService.updateWinner(id, match.visitTeamId, match.visitTeamName, match.visitTeamFlag);
                        this.singleMatchesService.updateLoser(id, match.homeTeamId, match.homeTeamName, match.homeTeamFlag);
                        this.singleMatchesService.updateDraw(id, false);

                    } else if (match.homeTeamScore === match.visitTeamScore) {
                        this.singleMatchesService.updateWinner(id, '', '', '');
                        this.singleMatchesService.updateLoser(id, '', '', '');
                        this.singleMatchesService.updateDraw(id, true);
                    }
                });
    }

}
