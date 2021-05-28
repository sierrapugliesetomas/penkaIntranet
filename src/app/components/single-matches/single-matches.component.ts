import { Component, OnDestroy, OnInit } from '@angular/core';
import { SingleMatchesService } from '../../services/singleMatches/single-matches.service';
import { GambleService } from '../../services/gamble/gamble.service';
import { Gamble } from '../../interfaces/gamble';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CompetitionService } from '../../services/competition/competition.service';
import { ParticipantsService } from 'src/app/services/participants/participants.service';
import { SingleMatch } from 'src/app/interfaces/single-match';
import { Participant } from '../../interfaces/participant';
import { PenkaService } from 'src/app/services/penka/penka.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { PenkaRequest } from 'src/app/interfaces/penka-request';
import { Penka } from 'src/app/interfaces/penka';

@Component({
    selector: 'app-single-matches',
    templateUrl: './single-matches.component.html',
    styleUrls: ['./single-matches.component.css'],
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
        private penkasService: PenkaService,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.getSingleMatches();
        this.getCompetitions();
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    getSingleMatches(): void {
        this.singleMatchesService
            .getSingleMatchesByStatus(this.statusFilter)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                (res) => {
                    this.singleMatches = res;
                },
                (error) => console.log(error)
            );
    }

    private getCompetitions(): void {
        this.competitionService.getCompetitions().subscribe(
            (res) => {
                this.competitions = res;
            },
            (error) => console.log(error)
        );
    }

    updateDateMatch(event, id): void {
        const months = [
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre',
        ];
        const startDate =
            event.day + ' de ' + months[event.month - 1] + ' de ' + event.year;
        this.singleMatchesService.updateDateMatch(id, startDate);
    }

    publish(id): void {
        if (confirm('Esta seguro que desea Publicar el Partido?')) {
            this.singleMatchesService.publish(id);
            let updatedMatch: SingleMatch = this.singleMatches.find(
                (match) => match.id === id
            );
            updatedMatch.publish = true;
        }
    }

    // tslint:disable-next-line:typedef
    gameStatus(event, match) {
        let updatedMatch = this.singleMatches.find((m) => m.id == match.id);
        if (event.value === '2') {
            if (confirm('Desea confirmar el partido por finalizado?')) {
                updatedMatch.status = event.value;
                this.singleMatchesService.updateStatus(match.id, event.value);
                this.updateGamblesStatus(updatedMatch);
            } else {
                event.value = match.status; // old value, prevent change select
            }
        } else if (event.value === '1') {
            if (confirm('Desea publicar nuevamente el partido?')) {
                updatedMatch.status = event.value;
                this.singleMatchesService.updateStatus(match.id, event.value);
                this.updateGamblesStatus(updatedMatch);
            } else {
                event.value = match.status; // old value, prevent change select
            }
        }
    }

    private async updateGamblesStatus(match) {
        /* get gambles match */
        let gambles = await this.gambleService
            .getGamblesBySingleMatchId(match.id)
            .toPromise();

        let score;
        gambles.forEach((gamble) => {
            score = this.getGambleScore(gamble, match);

            if (match.status === '1') {
                // revert finished gamble
                score = score * -1;
                this.gambleService.updateScoreAchieve(gamble.id, 0, match.status);
            } else {
                // status 2
                this.gambleService.updateScoreAchieve(gamble.id, score, match.status);
            }
            this.updateParticipantAccumulatedScore(gamble, score, match);
        });

        this.updatePenkasStatus(match);
    }

    private getGambleScore(gamble: Gamble, match: SingleMatch) {
        /* gamble PRO */
        let score;
        if (gamble.penkaFormat === 'PRO') {
            // exact result
            if (
                match.homeTeamScore === gamble.homeTeamScore &&
                match.visitTeamScore === gamble.visitTeamScore
            ) {
                score = 5;
            } // draw or winner but not exact result
            else if (
                (match.draw === true && gamble.draw) ||
                match.winnerId === gamble.winnerTeamId
            ) {
                score = 3;
            } else {
                score = 0;
            }
        }
        /* gamble MEDIUM*/
        if (gamble.penkaFormat === 'MEDIUM') {
            if (
                (match.draw === true && gamble.draw) ||
                match.winnerId === gamble.winnerTeamId
            ) {
                score = 3;
            } else {
                score = 0;
            }
        }
        return score;
        /*************************/
    }

    private async updateParticipantAccumulatedScore(
        gamble: Gamble,
        score: number,
        match
    ) {
        // add gamble score to participant accumulatedScore
        let participant = await this.participantsService
            .getParticipantByGamble(gamble.userId, gamble.codePenka)
            .toPromise();

        if (participant.length > 0) {
            let newScore = participant[0].accumulatedScore + score;
            this.participantsService.updateScore(participant[0].id, newScore);
        }
    }

    async updateTeamsScores(
        id,
        newHomeTeamScore: number,
        newVisitTeamScore: number
    ) {
        if (confirm('Desea actualizar resultado del partido?')) {
            let match: SingleMatch = this.singleMatches.find((m) => m.id === id);
            // parse string from select
            newHomeTeamScore = Number(newHomeTeamScore);
            newVisitTeamScore = Number(newVisitTeamScore);

            if (match.status === '2') {
                let relatedGambles = await this.gambleService
                    .getGamblesBySingleMatchId(match.id)
                    .toPromise();
                let relatedPenkasIds = [
                    ...new Set(relatedGambles.map((gamble) => gamble.codePenka)),
                ];
                let relatedParticipant = await this.participantsService
                    .getAllParticipantsOnce()
                    .toPromise();
                relatedParticipant = relatedParticipant.filter((part) =>
                    relatedPenkasIds.includes(part.codePenka)
                );

                let oldAccumulatedScore: number;

                relatedGambles.forEach((gamble: Gamble) => {
                    let indexToUpdate = relatedParticipant.findIndex(
                        (p) =>
                            p.userId === gamble.userId && p.codePenka === gamble.codePenka
                    );
                    if (indexToUpdate !== -1) {
                        oldAccumulatedScore =
                            relatedParticipant[indexToUpdate].accumulatedScore -
                            gamble.scoreAchieved;
                        relatedParticipant[indexToUpdate].accumulatedScore =
                            oldAccumulatedScore;
                        relatedParticipant[indexToUpdate].place = '';
                    }
                });

                // setear nuevo ganador/perdedor/empate del partido
                match.homeTeamScore = newHomeTeamScore;
                match.visitTeamScore = newVisitTeamScore;
                match = this.setMatchWinnerTeam(match);

                // update nuevo puntaje en gambles
                relatedGambles.forEach((gamble) => {
                    gamble.scoreAchieved = this.getGambleScore(gamble, match);
                    let updateIndex = relatedParticipant.findIndex(
                        (p) =>
                            p.userId === gamble.userId && p.codePenka === gamble.codePenka
                    );
                    if (updateIndex !== -1) {
                        relatedParticipant[updateIndex].accumulatedScore =
                            relatedParticipant[updateIndex].accumulatedScore +
                            gamble.scoreAchieved;
                        this.gambleService.update(gamble);
                        this.participantsService.update(relatedParticipant[updateIndex]);
                    }
                });

                relatedPenkasIds.forEach(async (codePenka) => {
                    let participantList = await this.participantsService
                        .getParticipantByCodePenka(codePenka)
                        .toPromise();

                    if (participantList.length > 0 && participantList[0].status === '2') {
                        this.setWinners(participantList);
                    }
                });
            } else {
                // partido aun no finalizado
                match.homeTeamScore = newHomeTeamScore;
                match.visitTeamScore = newVisitTeamScore;
                this.setMatchWinnerTeam(match);
            }
        }
    }

    private setMatchWinnerTeam(match: SingleMatch) {
        if (match.homeTeamScore !== match.visitTeamScore) {
            match.winnerId =
                match.homeTeamScore > match.visitTeamScore
                    ? match.homeTeamId
                    : match.visitTeamId;
            match.winnerName =
                match.homeTeamScore > match.visitTeamScore
                    ? match.homeTeamName
                    : match.visitTeamName;
            match.winnerFlag =
                match.homeTeamScore > match.visitTeamScore
                    ? match.homeTeamFlag
                    : match.visitTeamFlag;

            match.loserId =
                match.homeTeamScore < match.visitTeamScore
                    ? match.homeTeamId
                    : match.visitTeamId;
            match.loserName =
                match.homeTeamScore < match.visitTeamScore
                    ? match.homeTeamName
                    : match.visitTeamName;
            match.loserFlag =
                match.homeTeamScore < match.visitTeamScore
                    ? match.homeTeamFlag
                    : match.visitTeamFlag;

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

        return match;
    }

    private async updatePenkasStatus(match: SingleMatch) {
        // finish/close all associated penkas to this match
        const relatedPenkas = await this.penkasService
            .getPenkasBySingleMatchId(match.id)
            .toPromise();

        relatedPenkas.forEach(async (p) => {
            let openMatches = await this.singleMatchesService
                .getSingleMatchesByStatusOnce('1')
                .toPromise();
            openMatches = openMatches.filter((sm) =>
                p.singleMatchesId.includes(sm.id)
            );

            if (
                (openMatches.length === 0 && p.status === '1') ||
                (openMatches.length === 1 && p.status === '2')
            ) {
                this.updateParticipationStatus(p, match);
            }
        });
    }

    private async updateParticipationStatus(p, match) {
        let participants = await this.participantsService
            .getParticipantByCodePenka(p.codePenka)
            .toPromise();

        participants.forEach((participant) => {
            this.participantsService.updateStatus(participant.id, match.status);
            if (match.status === '2') {
                this.penkaFinishUserNotification(participant, p);
            }
        });

        if (match.status === '2') {
            this.setWinners(participants);
        } else {
            participants.forEach((p) =>
                this.participantsService.updatePlace(p.id, '')
            );
        }
        this.penkasService.updateStatus(p.id, match.status);
    }

    private setWinners(participants: Participant[]) {
        let winners = [];
        const places = ['primero', 'segundo', 'tercero'];
        let placesIndex = 0;
        let previousScore = 0;

        for (
            let index = 0;
            index < participants.length && placesIndex < 3;
            index++
        ) {
            let actual = participants[index];

            if (previousScore === 0 || previousScore === actual.accumulatedScore) {
                this.participantsService.updatePlace(actual.id, places[placesIndex]);
                previousScore = actual.accumulatedScore;
                winners.push(actual);
            } else {
                if (winners.length < 3) {
                    placesIndex++;
                    previousScore = actual.accumulatedScore;
                    winners.push(actual);
                    this.participantsService.updatePlace(actual.id, places[placesIndex]);
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
