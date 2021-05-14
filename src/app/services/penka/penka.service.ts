import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Penka} from '../../interfaces/penka';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PenkaService {

    penkasCollection: AngularFirestoreCollection<Penka>;
    penkas: Observable<Penka[]>;

    constructor(private afs: AngularFirestore) {
        this.penkasCollection = afs.collection<Penka>('penkas');
        this.penkas = this.penkasCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Penka;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    getPenkas() {
        return this.penkas;
    }

    getPenkaBySingleMatch(singleMatchId) {
        return this.afs.collection<Penka>('penkas', ref => ref.where('singleMatchId', '==', singleMatchId))
            .snapshotChanges().pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as Penka;
                    const id = a.payload.doc.id;
                    return {id, ...data};
                }))
            );
    }

    getPenkaByCodePenka(codePenka) {
        return this.afs.collection<Penka>('penkas', ref => ref.where('codePenka', '==', codePenka))
            .snapshotChanges().pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as Penka;
                    const id = a.payload.doc.id;
                    return {id, ...data};
                }))
            );
    }

    getPenkasBySingleMatchId(singleMatchId) {
        return this.afs.collection<Penka>('penkas', ref => ref
        .where('status', '==', '1')
        .where('singleMatchesId', 'array-contains', singleMatchId)).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Penka;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    getPenkasByCodeTemplate(codeTemplate): any {
        return this.afs.collection<Penka>('penkas', ref => ref
            .where('codeTemplate', '==', codeTemplate)
            .where('status', '==', '1')
            .orderBy('dateLimit', 'asc'))
            .snapshotChanges().pipe(map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as Penka;
                    const id = a.payload.doc.id;
                    return {id, ...data};
                }))
            );
    }

    updateStatus(id, status) {
        this.penkasCollection.doc(id).update({status}).catch(error => console.log(error));
    }
}
