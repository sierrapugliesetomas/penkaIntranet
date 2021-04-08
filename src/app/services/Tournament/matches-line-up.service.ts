import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {MatchesLineUp} from '../../interfaces/matches-line-up';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class MatchesLineUpService {

    matchesLineUpCollection: AngularFirestoreCollection<MatchesLineUp>;
    matchesLineUp: Observable<MatchesLineUp[]>;

    constructor(private afs: AngularFirestore) {
        this.matchesLineUpCollection = afs.collection<MatchesLineUp>('matchesLineUp');
        this.matchesLineUp = this.matchesLineUpCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as MatchesLineUp;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    getMatchesLineUp() {
        return this.matchesLineUp;
    }

    getMatchesLineUpByPlayer(playerId, matchId) {
        return this.afs.collection('matchesLineUp', ref => ref.where('PlayerId', '==', playerId).where('matchId', '==', matchId))
            .snapshotChanges().pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as MatchesLineUp;
                    const id = a.payload.doc.id;
                    return {id, ...data};
                }))
            );
    }

    addMatchesLineUp(tournamentId, tournamentName, matchId, playerId, playerName, goals) {
        this.matchesLineUpCollection.add({
            tournamentId,
            tournamentName,
            matchId,
            playerId,
            playerName,
            goals,
            redCards: 0,
            redYellow: 0,
            mvp: 0
        }).catch(error => console.log(error));
    }

    updateGoal(id, goals) {
        this.matchesLineUpCollection.doc(id).update(goals).catch(error => console.log(error));
    }

    updateRedCard(id, card) {
        this.matchesLineUpCollection.doc(id).update(card).catch(error => console.log(error));
    }

    updateYellowCard(id, cards) {
        this.matchesLineUpCollection.doc(id).update(cards).catch(error => console.log(error));
    }

    updateMvp(id, mvp) {
        this.matchesLineUpCollection.doc(id).update(mvp).catch(error => console.log(error));
    }
}
