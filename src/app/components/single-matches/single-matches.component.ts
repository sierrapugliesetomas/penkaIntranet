import {Component, OnDestroy, OnInit} from '@angular/core';
import {SingleMatchesService} from '../../services/singleMatches/single-matches.service';
import {GambleService} from '../../services/gamble/gamble.service';
import {Gamble} from '../../interfaces/gamble';
import {Subject} from 'rxjs';
import {take} from 'rxjs/operators';
import {CompetitionService} from '../../services/competition/competition.service';
import { ParticipantsService } from 'src/app/services/participants/participants.service';
import { SingleMatch } from 'src/app/interfaces/single-match';

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
        private competitionService: CompetitionService,
        private participantsService: ParticipantsService) {
    }

    ngOnInit(): void {
        this.singleMatchesService.getSingleMatches()
        .pipe((take(1)))
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
            let updatedMatch: SingleMatch = this.singleMatches.find(match => match.id === id);
            updatedMatch.publish = true;
            this.singleMatchesService.publish(id);
        }
    }

    // tslint:disable-next-line:typedef
    gameStatus(event, match) {
       
        let updatedMatch = this.singleMatches.find(m => m.id == match.id);
        if (event.value === '2') {
            if (confirm('Desea confirmar el partido por finalizado?')) {
                updatedMatch.status = event.value;
                this.singleMatchesService.updateStatus(match.id, event.value);
            }
        } else if (event.value === '1') {
            if (confirm('Desea modificar el partido?')) {
                updatedMatch.status = event.value;
                this.singleMatchesService.updateStatus(match.id, event.value);
                // TODO: hacer un update del accumulatedScore de todas las participaciones que tenian este partido o apuesta.
                // dividir la parte de update status con la de calcular los puntajes
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

    updateTeamsScores(id, homeTeamScore: number, visitTeamScore: number): void {
        if (confirm('Desea actualizar resultado del partido?')) {
            let match: SingleMatch = this.singleMatches.find(m => m.id === id);
            match.homeTeamScore = Number(homeTeamScore);
            match.visitTeamScore = Number(visitTeamScore);
            
            if (match.homeTeamScore !== match.visitTeamScore) {
                match.winnerId = match.homeTeamScore > match.visitTeamScore ? match.homeTeamId : match.visitTeamId;
                match.winnerName = match.homeTeamScore > match.visitTeamScore ? match.homeTeamName : match.visitTeamName;
                match.winnerFlag = match.homeTeamScore > match.visitTeamScore ? match.homeTeamFlag : match.visitTeamFlag;
                
                match.loserId = match.homeTeamScore < match.visitTeamScore ? match.homeTeamId : match.visitTeamId;
                match.loserName = match.homeTeamScore < match.visitTeamScore ? match.homeTeamName : match.visitTeamName;
                match.loserFlag = match.homeTeamScore < match.visitTeamScore ? match.homeTeamFlag : match.visitTeamFlag;
                
                match.draw = false;

            } else {
                // draw
                match.winnerId = '';
                match.winnerFlag = '';
                match.winnerName = '';
                
                match.loserId = '';
                match.loserFlag = '';
                match.loserName = '';

                match.draw = true;
            }
            this.singleMatchesService.updateAllTeamsScores(match);
        }
    }
}
