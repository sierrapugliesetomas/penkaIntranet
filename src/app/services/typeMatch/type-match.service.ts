import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {TypeMatch} from '../../interfaces/type-match';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TypeMatchService {

    typeMatchCollection: AngularFirestoreCollection<TypeMatch>;
    typeMatches: Observable<TypeMatch[]>;

    constructor(private afs: AngularFirestore) {
        this.typeMatchCollection = afs.collection<TypeMatch>('typeMatches', ref => ref.orderBy('name'));
        this.typeMatches = this.typeMatchCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as TypeMatch;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    getTypeMatches() {
        return this.typeMatches;
    }

    getTypeMatchById(id) {
        return this.typeMatchCollection.doc(id).valueChanges();
    }

    addTypeMatch(typeMatch: TypeMatch) {
        this.typeMatchCollection.add(typeMatch).then();
    }

    deleteTypeMatch(id) {
        this.typeMatchCollection.doc(id).delete().then();
    }
}
