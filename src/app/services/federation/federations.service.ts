import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Federation} from '../../interfaces/federation';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FederationsService {

    federationsCollection: AngularFirestoreCollection<Federation>;
    federations: Observable<Federation[]>;

    constructor(private afs: AngularFirestore) {
        this.federationsCollection = afs.collection<Federation>('federations', ref => ref.orderBy('name'));
        this.federations = this.federationsCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Federation;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    getFederations() {
        return this.federations;
    }

    getFederationById(id) {
        return this.federationsCollection.doc(id).valueChanges();
    }

    addFederation(federation: Federation) {
        this.federationsCollection.add(federation).then();
    }

    deleteFederation(id) {
        this.federationsCollection.doc(id).delete().then();
    }

    updateFederation(id, federation) {
        this.federationsCollection.doc(id).update(federation).then();
    }
}
