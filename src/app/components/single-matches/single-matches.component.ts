import {Component, OnDestroy, OnInit} from '@angular/core';
import {SingleMatchesService} from '../../services/singleMatches/single-matches.service';
import {GambleService} from '../../services/gamble/gamble.service';
import {Gamble} from '../../interfaces/gamble';
import {Subject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {CompetitionService} from '../../services/competition/competition.service';
import {ParticipantsService} from 'src/app/services/participants/participants.service';
import {SingleMatch} from 'src/app/interfaces/single-match';
import {Participant} from '../../interfaces/participant';
import {PenkaService} from 'src/app/services/penka/penka.service';

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

    statusFilter = '1';
    private unsubscribe$ = new Subject<void>();

    constructor(
        private singleMatchesService: SingleMatchesService,
        private gambleService: GambleService,
        private competitionService: CompetitionService,
        private participantsService: ParticipantsService,
        private penkasService: PenkaService) { }

    ngOnInit(): void {
        this.getSingleMatches();
        this.getCompetitions();
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    getSingleMatches(): void {
        this.singleMatchesService.getSingleMatchesByStatus(this.statusFilter)
            .pipe(takeUntil(this.unsubscribe$))
                .subscribe(
                    res => {
                        this.singleMatches = res;
                    }, error => console.log(error)
            );
    }

    private getCompetitions(): void {
        this.competitionService.getCompetitions()
            .subscribe(
                res => {
                    this.competitions = res;
                }, error => console.log(error)
            );
    }
    
    updateDateMatch(event, id): void {
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const startDate = event.day + ' de ' + months[(event.month - 1)] + ' de ' + event.year;
        this.singleMatchesService.updateDateMatch(id, startDate);
    }

    publish(id): void {
        if (confirm('Esta seguro que desea Publicar el Partido?')) {
            this.singleMatchesService.publish(id);
            let updatedMatch: SingleMatch = this.singleMatches.find(match => match.id === id);
            updatedMatch.publish = true;
        }
    }

    // tslint:disable-next-line:typedef
    gameStatus(event, match) {
        let updatedMatch = this.singleMatches.find(m => m.id == match.id);
        if (event.value === '2') {
            if (confirm('Desea confirmar el partido por finalizado?')) {
                updatedMatch.status = event.value;
                this.singleMatchesService.updateStatus(match.id, event.value);
                this.updateGamblesStatus(updatedMatch, event.value);
            } else {
                event.value = match.status; // old value, prevent change select
            }
        } else if (event.value === '1') {
            if (confirm('Desea publicar nuevamente el partido?')) {
                updatedMatch.status = event.value;
                this.singleMatchesService.updateStatus(match.id, event.value);
                this.updateGamblesStatus(updatedMatch, event.value);
            } else {
                event.value = match.status; // old value, prevent change select
            }
        }
    }

    updateGamblesStatus(match, newStatus): void {
        /* get gambles match */
        let gambles = [] as Gamble[];
        this.gambleService.getGamblesBySingleMatchId(match.id)
            .pipe(first())
            .subscribe(
            res => {
                gambles = res;
                let score;
                gambles.forEach(gamble => {
                    score = this.getGambleScore(gamble, match);
                
                    if(match.status === '1') {
                        // revert finished gamble
                        score = score * -1;
                        this.gambleService.updateScoreAchieve(gamble.id, 0, match.status);
    
                    } else {
                        // status 2
                        this.gambleService.updateScoreAchieve(gamble.id, score, match.status);
                    }
                    this.updateParticipantAccumulatedScore(gamble, score, match);
                });
            });
    }
    
    private getGambleScore(gamble: Gamble, match: SingleMatch ) {
        /* gamble PRO */
        let score;
        if (gamble.penkaFormat === 'PRO') {
            // exact result
            if ((match.homeTeamScore === gamble.homeTeamScore) && (match.visitTeamScore === gamble.visitTeamScore)) {
                score = 5;
            } // draw or winner but not exact result
            else if ((match.draw === true && gamble.draw) || (match.winnerId === gamble.winnerTeamId)) {
                score = 3;
            } else {
                score = 0;
            }
        }
        /* gamble MEDIUM*/
        if (gamble.penkaFormat === 'MEDIUM') {
            if (match.draw === true && gamble.draw || match.winnerId === gamble.winnerTeamId) {
                score = 3;
            } else {
                score = 0;
            }
        }
        return score;
        /*************************/
    }

    private updateParticipantAccumulatedScore(gamble: Gamble, score: number, match): void {
            // add gamble score to participant accumulatedScore 
            this.participantsService.getParticipantByGamble(gamble.userId, gamble.codePenka).pipe(first()).subscribe( 
                (participant: Participant[]) => {
                  if(participant.length > 0) {
                      let newScore =  participant[0].accumulatedScore + score;
                      this.participantsService.updateScore(participant[0].id, newScore);
                  }
                  // una vez finalizado el computo de puntajes, calculo los ganadores
                  this.updatePenkasStatus(match);
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

    private updatePenkasStatus(match: SingleMatch) {
        // finish/close all associated penkas to this match
        this.penkasService.getPenkasBySingleMatchId(match.id).pipe(first()).subscribe(
            res => {
                const relatedPenkas = res;
                relatedPenkas.forEach(p => {
                    this.singleMatchesService.getSingleMatchesByStatus('1').pipe(first()).subscribe(
                        res => {
                            const openMatches =  res.filter( sm => p.singleMatchesId.includes(sm.id));
                            if ((openMatches.length === 0 && p.status === '1') || (openMatches.length === 1 && p.status === '2')) {
                                this.updateParticipationStatus(p, match);
                            }
                        }
                    )
                });
        });
    }

    private updateParticipationStatus(p, match): void {
        this.participantsService.getParticipantByCodePenka(p.codePenka).pipe(first()).subscribe( // ToDO: verificar que traiga los resultados completos y no de a partes, sino aumentar take
            res => {
                const participants = res;
                participants.forEach(participant => this.participantsService.updateStatus(participant.id, match.status));
                
                if (match.status === '2') {
                    this.setWinners(participants);
                } else {
                    participants.forEach(p => this.participantsService.updatePlace(p.id, ''));
                }
            });
        this.penkasService.updateStatus(p.id, match.status);
    }
    

    private setWinners(participants: Participant[]) {
        let winners = [];
        const places = ['primero', 'segundo', 'tercero'];
        let placesIndex = 0;
        let previousScore = 0;
        
        for (let index = 0; (index < participants.length && placesIndex < 3); index++) {
            let actual = participants[index];

            if (previousScore === 0 || previousScore === actual.accumulatedScore ) {
                this.participantsService.updatePlace(actual.id, places[placesIndex]);
                previousScore = actual.accumulatedScore;
                winners.push(actual);

            } else {
                if(winners.length < 3) {
                    placesIndex++;
                    previousScore = actual.accumulatedScore;
                    winners.push(actual);
                    this.participantsService.updatePlace(actual.id, places[placesIndex]);
                }
            }
        }
    }
}
