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
        .where('status', 'in', ['1','2','9'])
        .where('singleMatchesId', 'array-contains', singleMatchId))
        .get().pipe(
            map(actions => actions.docs.map(a => {
                const data = a.data() as Penka;
                const id = a.id;
                return {id, ...data};
            }))
        );
    }

    getPenkasByCodeTemplate(codeTemplate) {
        return this.afs.collection<Penka>('penkas', ref => ref
            .where('codeTemplate', '==', codeTemplate)
            .where('status', 'in', ['1','2'])
            .orderBy('dateLimit', 'asc'))
            .get()
            .pipe(
                map(actions => actions.docs.map(a => {
                    const data = a.data() as Penka;
                    const id = a.id;
                    return {id, ...data};
                }))
            );
    }

    updateStatus(id, status) {
        if (status === '2') {
            const finishDate = new Date();
            this.penkasCollection.doc(id).update({status, finishDate}).catch(error => console.log(error));
        }
        else  {
            this.penkasCollection.doc(id).update({status}).catch(error => console.log(error));
        }
    }

    updateFinishDate(id: string, finishDate: Date): void {
        this.penkasCollection.doc(id).update({finishDate}).catch();
    }
}
