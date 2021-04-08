import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {Gamble} from '../../interfaces/gamble';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class GambleService {

    gambleCollection: AngularFirestoreCollection<Gamble>;
    gamble: Observable<Gamble[]>;

    constructor(private afs: AngularFirestore) {
        this.gambleCollection = afs.collection<Gamble>('gambles');
        this.gamble = this.gambleCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Gamble;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    getGambles() {
        return this.gamble;
    }

    getGamblesByCodePenka(codePenka) {
        return this.afs.collection<Gamble>('gambles', ref => ref.where('codePenka', '==', codePenka))
            .snapshotChanges().pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as Gamble;
                    const id = a.payload.doc.id;
                    return {id, ...data};
                }))
            );
    }

    // tslint:disable-next-line:typedef
    getGamblesBySingleMatchId(singleMatchId) {
        return this.afs.collection<Gamble>('gambles', ref => ref.where('singleMatchId', '==', singleMatchId))
            .snapshotChanges().pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as Gamble;
                    const id = a.payload.doc.id;
                    return {id, ...data};
                }))
            );
    }

    // tslint:disable-next-line:typedef
    updateScoreAchieve(id, scoreAchieved: number, status: string) {
        this.gambleCollection.doc(id).update({scoreAchieved, status}).then();
    }

    // tslint:disable-next-line:typedef
    updateGambleFinish(id, status) {
        this.gambleCollection.doc(id).update({status}).then();
    }


}
