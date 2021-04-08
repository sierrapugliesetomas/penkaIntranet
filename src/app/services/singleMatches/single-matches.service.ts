import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {SingleMatch} from '../../interfaces/single-match';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SingleMatchesService {

    singleMatchesCollection: AngularFirestoreCollection<SingleMatch>;
    singleMatches: Observable<SingleMatch[]>;

    constructor(private afs: AngularFirestore) {
        this.singleMatchesCollection = afs.collection<SingleMatch>('singleMatches', ref => ref
            .where('status', '==', '1')
            .orderBy('startDate', 'asc'));
        this.singleMatches = this.singleMatchesCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as SingleMatch;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }


    // tslint:disable-next-line:typedef
    getSingleMatches() {
        return this.singleMatches;
    }

    getSingleMatchById(id) {
        return this.singleMatchesCollection.doc(id).valueChanges();
    }

    addMatch(singleMatch: SingleMatch) {
        this.singleMatchesCollection.add(singleMatch)
            .catch(error => console.log(error));
    }

    deleteMatch(id) {
        this.singleMatchesCollection.doc(id).delete()
            .catch(error => console.log(error));
    }

    updateDateMatch(id, startDate): void {
        this.singleMatchesCollection.doc(id).update({startDate, status: '0', selected: 'selected'}).catch(error => console.log(error));
    }

    /*updateTimeMatch(id): any {
        this.singleMatchesCollection.doc(id).update().catch(error => console.log(error));
    }*/

    updateStatus(id, status) {
        this.singleMatchesCollection.doc(id).update({status}).catch(error => console.log(error));
    }

    updateHomeScore(id, score: number) {
        this.singleMatchesCollection.doc(id).update({homeTeamScore: score}).catch(error => console.log(error));
    }

    updateVisitScore(id, score: number) {
        this.singleMatchesCollection.doc(id).update({visitTeamScore: score}).catch(error => console.log(error));
    }

    updateWinner(id, winnerId, winnerName, winnerFlag) {
        this.singleMatchesCollection.doc(id).update({
            winnerId,
            winnerName,
            winnerFlag
        }).catch(error => console.log(error));
    }

    updateLoser(id, loserId, loserName, loserFlag) {
        this.singleMatchesCollection.doc(id).update({
            loserId,
            loserName,
            loserFlag
        }).catch(error => console.log(error));
    }

    updateDraw(id, draw) {
        this.singleMatchesCollection.doc(id).update({draw}).catch(error => console.log(error));
    }

    publish(id) {
        this.singleMatchesCollection.doc(id).update({publish: true}).catch(error => console.log(error));
    }
}
