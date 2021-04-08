import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Tournament} from '../../interfaces/tournament';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TournamentService {

    tournamentCollection: AngularFirestoreCollection<Tournament>;
    tournaments: Observable<Tournament[]>;

    constructor(private afs: AngularFirestore) {
        this.tournamentCollection = afs.collection<Tournament>('tournaments');
        this.tournaments = this.tournamentCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Tournament;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    /* Tournament*/
    getTournaments() {
        return this.tournaments;
    }

    getTournamentById(id) {
        return this.tournamentCollection.doc(id).valueChanges();
    }

    getTournamentsDuplicated(name) {
        return this.afs.collection<Tournament>('tournaments', ref => ref.where('name', '==', name)).valueChanges();
    }

    addTournament(tournament: Tournament) {
        this.tournamentCollection.add(tournament).then();
    }

    deleteTournament(id) {
        this.tournamentCollection.doc(id).delete().then();
    }

    updateTournament(id, tournament: Tournament) {
        this.tournamentCollection.doc(id).update(tournament).then();
    }
}
