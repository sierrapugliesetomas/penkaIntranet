import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {League} from '../../interfaces/league';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class LeaguesService {

    leaguesCollection: AngularFirestoreCollection<League>;
    leagues: Observable<League[]>;

    constructor(private afs: AngularFirestore) {
        this.leaguesCollection = afs.collection<League>('leagues', ref => ref.orderBy('name'));
        this.leagues = this.leaguesCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as League;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    getLeagues() {
        return this.leagues;
    }

    getLeagueById(id) {
        return this.leaguesCollection.doc(id).valueChanges();
    }

    getLeaguesFiltered(filter: any) {
        return this.afs.collection<League>('leagues', ref => ref.where('country', '==', filter)).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as League;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    getLeaguesFilteredByFederation(filter: any) {
        return this.afs.collection<League>('leagues', ref => ref.where('federation', '==', filter)).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as League;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }


    addLeague(league: League) {
        this.leaguesCollection.add(league).then();
    }

    deleteLeague(id) {
        this.leaguesCollection.doc(id).delete().then();
    }

    updateLeague(id, league) {
        this.leaguesCollection.doc(id).update(league).then();
    }
}
