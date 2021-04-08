import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {TournamentMatches} from '../../interfaces/tournament-matches';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TournamentMatchesService {
    matchesCollection: AngularFirestoreCollection<TournamentMatches>;
    matches: Observable<TournamentMatches[]>;

    constructor(private afs: AngularFirestore) {
        this.matchesCollection = afs.collection<TournamentMatches>('tournamentMatches', ref => ref.orderBy('name', 'asc'));
        this.matches = this.matchesCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as TournamentMatches;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    addMatch(tournamentMatches: TournamentMatches) {
        this.matchesCollection.add(tournamentMatches).catch(error => console.log(error));
    }

    getMatches() {
        return this.matches;
    }

    getMatchById(id) {
        return this.matchesCollection.doc(id).valueChanges();
    }

    getMatchesByGroups(groupName, tournamentName): any {
        return this.afs.collection<TournamentMatches>('tournamentMatches', ref => ref
            .where('tournamentName', '==', tournamentName)
            .where('group', '==', groupName)).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as TournamentMatches;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    deleteMatch(matchId) {
        this.matchesCollection.doc(matchId).delete().catch(error => console.log(error));
    }

    updateMatch(id, tournamentMatches: TournamentMatches) {
        this.matchesCollection.doc(id).update(tournamentMatches).catch(error => console.log(error));
    }

    updateHomeTeam(id, homeTeamId, homeTeamName, homeFlag, tournamentId, status) {
        this.matchesCollection.doc(id).update({
            homeTeamId,
            homeTeamName,
            homeFlag,
            tournamentId,
            status
        }).catch(error => console.log(error));
    }

    updateVisitTeam(id, visitTeamId, visitTeamName, visitFlag, tournamentId) {
        this.matchesCollection.doc(id).update({
            visitTeamId,
            visitTeamName,
            visitFlag,
            tournamentId
        }).catch(error => console.log(error));
    }

    updateHomeScore(id, score: number) {
        this.matchesCollection.doc(id).update({homeScore: score}).catch(error => console.log(error));
    }

    updateVisitScore(id, score: number) {
        this.matchesCollection.doc(id).update({visitScore: score}).catch(error => console.log(error));
    }

    updateWinner(id, winnerId, winnerName, winnerFlag) {
        this.matchesCollection.doc(id).update({
            winnerId,
            winnerName,
            winnerFlag
        }).catch(error => console.log(error));
    }

    updateLoser(id, loserId, loserName, loserFlag) {
        this.matchesCollection.doc(id).update({
            loserId,
            loserName,
            loserFlag
        }).catch(error => console.log(error));
    }

    updateDraw(id, draw) {
        this.matchesCollection.doc(id).update({draw}).catch(error => console.log(error));
    }

    updateDateMatch(id, startDate) {
        this.matchesCollection.doc(id).update({startDate}).catch(error => console.log(error));
    }

    updateTimeMatch(id, startTime) {
        this.matchesCollection.doc(id).update({startTime}).catch(error => console.log(error));
    }

    updateStatus(id, status) {
        this.matchesCollection.doc(id).update({status}).catch(error => console.log(error));
    }

}
