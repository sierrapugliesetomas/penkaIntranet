import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {FirstPlace} from '../../interfaces/first-place';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FirstPlaceService {

    firstPlaceCollection: AngularFirestoreCollection<FirstPlace>;
    firstPlaces: Observable<FirstPlace[]>;

    constructor(private afs: AngularFirestore) {
        this.firstPlaceCollection = afs.collection<FirstPlace>('firstPlaces', ref => ref.orderBy('name'));
        this.firstPlaces = this.firstPlaceCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as FirstPlace;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    getFirstPlaces() {
        return this.firstPlaces;
    }

    getFirstPlaceById(id) {
        return this.firstPlaceCollection.doc(id).valueChanges();
    }

    addFirstPlace(firstPlace: FirstPlace) {
        this.firstPlaceCollection.add(firstPlace).then();
    }

    deleteFirstPlace(id) {
        this.firstPlaceCollection.doc(id).delete().then();
    }

}
