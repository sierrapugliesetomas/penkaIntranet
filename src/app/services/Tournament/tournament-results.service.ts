import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {TournamentResults} from '../../interfaces/tournament-results';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {TournamentMatches} from '../../interfaces/tournament-matches';


@Injectable({
    providedIn: 'root'
})
export class TournamentResultsService {

    resultsCollection: AngularFirestoreCollection<TournamentResults>;
    results: Observable<TournamentResults[]>;

    constructor(private afs: AngularFirestore) {
        this.resultsCollection = afs.collection<TournamentResults>('tournamentResults', ref => ref.orderBy('points', 'desc'));
        this.results = this.resultsCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as TournamentResults;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    addResultGroups(tournamentId, tournamentName, tournamentPhaseFinals, group, teamId, teamName, teamFlagUrl) {
        this.resultsCollection.add({
            tournamentId,
            tournamentName,
            tournamentPhaseFinals,
            group,
            teamId,
            teamName,
            teamFlagUrl,
            teamPodium: '',
            matchesPlayed: 0,
            matchesWon: 0,
            matchesDraw: 0,
            matchesLost: 0,
            positiveGoals: 0,
            negativeGoals: 0,
            averageGoals: 0,
            points: 0,
            classified: false
        }).then();
    }

    addResultFinals(tournamentId, tournamentName, tournamentPhaseFinals, group, teamId, teamName, teamFlagUrl) {
        this.resultsCollection.add({
            tournamentId,
            tournamentName,
            tournamentPhaseFinals,
            group,
            teamId,
            teamName,
            teamFlagUrl,
            teamPodium: '',
            matchesPlayed: 0,
            matchesWon: 0,
            matchesDraw: 0,
            matchesLost: 0,
            positiveGoals: 0,
            negativeGoals: 0,
            averageGoals: 0,
            points: 0,
            classified: true
        }).then();
    }

    getResults() {
        return this.results;
    }

    getResultById(id) {
        return this.resultsCollection.doc(id).valueChanges();
    }

    getResultByTeam(teamId: string, tournamentId: string) {
        return this.afs.collection<TournamentResults>('tournamentResults', ref => ref.where(
            'teamId', '==', teamId).where('tournamentId', '==', tournamentId))
            .snapshotChanges().pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as TournamentResults;
                    const id = a.payload.doc.id;
                    return {id, ...data};
                }))
            );
    }


    getResultsClassified(tournamentId: string) {
        return this.afs.collection<TournamentResults>('tournamentResults', ref => ref.where(
            'classified', '==', true).where('tournamentId', '==', tournamentId))
            .snapshotChanges().pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as TournamentResults;
                    const id = a.payload.doc.id;
                    return {id, ...data};
                }))
            );
    }

    /* counting matches played */
    getMatchesHome(teamId, groupName, tournamentId) {
        return this.afs.collection<TournamentMatches>('tournamentMatches', ref => ref.where(
            'homeTeamId', '==', teamId).where('phase', '==', 'groups')
            .where('tournamentId', '==', tournamentId).where('group', '==', groupName))
            .snapshotChanges().pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as TournamentMatches;
                    const id = a.payload.doc.id;
                    return {id, ...data};
                }))
            );
    }

    getMatchesVisit(teamId, groupName, tournamentId) {
        return this.afs.collection<TournamentMatches>('tournamentMatches', ref => ref.where(
            'visitTeamId', '==', teamId).where('phase', '==', 'groups')
            .where('tournamentId', '==', tournamentId).where('group', '==', groupName))
            .snapshotChanges().pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as TournamentMatches;
                    const id = a.payload.doc.id;
                    return {id, ...data};
                }))
            );
    }

    /* counting matches Won --- counting Goals */
    getMatchesWon(teamId, groupName, tournamentId) {
        return this.afs.collection<TournamentMatches>('tournamentMatches', ref => ref.where(
            'winnerId', '==', teamId).where('phase', '==', 'groups')
            .where('tournamentId', '==', tournamentId).where('group', '==', groupName))
            .snapshotChanges().pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as TournamentMatches;
                    const id = a.payload.doc.id;
                    return {id, ...data};
                }))
            );
    }

    /* counting matches Lost --- counting Goals */
    getMatchesLost(teamId, groupName, tournamentId) {
        return this.afs.collection<TournamentMatches>('tournamentMatches', ref => ref.where(
            'loserId', '==', teamId).where('phase', '==', 'groups')
            .where('tournamentId', '==', tournamentId).where('group', '==', groupName))
            .snapshotChanges().pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as TournamentMatches;
                    const id = a.payload.doc.id;
                    return {id, ...data};
                }))
            );
    }

    /* counting matches Draw Home --- counting Goals */
    getMatchesDrawHome(teamId, groupName, tournamentId) {
        return this.afs.collection<TournamentMatches>('tournamentMatches', ref => ref.where(
            'homeTeamId', '==', teamId).where('phase', '==', 'groups')
            .where('draw', '==', true).where('tournamentId', '==', tournamentId)
            .where('group', '==', groupName)).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as TournamentMatches;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    /* counting matches Draw Visit --- counting Goals */
    getMatchesDrawVisit(teamId, groupName, tournamentId) {
        return this.afs.collection<TournamentMatches>('tournamentMatches', ref => ref.where(
            'visitTeamId', '==', teamId).where('phase', '==', 'groups')
            .where('draw', '==', true).where('tournamentId', '==', tournamentId)
            .where('group', '==', groupName)).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as TournamentMatches;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    getMatchesPlayedVisit(teamId) {
        return this.afs.collection<TournamentMatches>('tournamentMatches', ref => ref.where(
            'teamId', '==', teamId).limit(1)).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as TournamentResults;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }


    addGoalScorer(tournamentId, tournamentName, playerId, playerName, playerPhotoUrl, playerCountry) {
        this.afs.collection('tournamentGoalScorer').add({
            tournamentId,
            tournamentName,
            playerId,
            playerName,
            playerPhotoUrl,
            playerCountry
        }).then();
    }


    /*////////// updates results //////////*/

    updateMatchPlayed(id: string, matchesPlayed) {
        this.resultsCollection.doc(id).update({matchesPlayed})
            .then(() => console.log('Match Updated'))
            .catch(error => console.log(error));
    }

    updateWins(id: string, matchesWon) {
        this.resultsCollection.doc(id).update({matchesWon})
            .then(() => console.log('Match Updated'))
            .catch(error => console.log(error));
    }

    updateLoses(id: string, matchesLost) {
        this.resultsCollection.doc(id).update({matchesLost})
            .then(() => console.log('Match Updated'))
            .catch(error => console.log(error));
    }

    updateDraws(id: string, matchesDraw) {
        this.resultsCollection.doc(id).update({matchesDraw})
            .then(() => console.log('Match Updated'))
            .catch(error => console.log(error));
    }

    updateGoals(id: string, positiveGoals: number, negativeGoals: number, averageGoals: number) {
        this.resultsCollection.doc(id).update({positiveGoals, negativeGoals, averageGoals})
            .then(() => console.log('Match Updated'))
            .catch(error => console.log(error));
    }

    updatePoints(id: string, points: number) {
        this.resultsCollection.doc(id).update({points})
            .then(() => console.log('Match Updated'))
            .catch(error => console.log(error));
    }

    updateClassified(id: string, classified: boolean) {
        this.resultsCollection.doc(id).update({classified})
            .then(() => console.log('Match Updated'))
            .catch(error => console.log(error));
    }

    /*updateStage(id: string, tournamentStage: string) {
        this.resultsCollection.doc(id).update({tournamentStage})
            .then(() => console.log('Match Updated'))
            .catch(error => console.log(error));
    }*/

    updatePodium(id: string, teamPodium: string) {
        this.resultsCollection.doc(id).update({teamPodium})
            .then(() => console.log('Match Updated'))
            .catch(error => console.log(error));
    }

    deleteResult(resultId) {
        this.resultsCollection.doc(resultId).delete().catch(error => console.log(error));
    }

}
