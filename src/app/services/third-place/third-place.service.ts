import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {ThirdPlace} from '../../interfaces/third-place';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ThirdPlaceService {

    thirdPlaceCollection: AngularFirestoreCollection<ThirdPlace>;
    thirdPlaces: Observable<ThirdPlace[]>;

    constructor(private afs: AngularFirestore) {
        this.thirdPlaceCollection = afs.collection<ThirdPlace>('thirdPlaces', ref => ref.orderBy('name'));
        this.thirdPlaces = this.thirdPlaceCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as ThirdPlace;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    getThirdPlaces() {
        return this.thirdPlaces;
    }

    getThirdPlaceById(id) {
        return this.thirdPlaceCollection.doc(id).valueChanges();
    }

    addThirdPlace(thirdPlace: ThirdPlace) {
        this.thirdPlaceCollection.add(thirdPlace).then();
    }

    deleteThirdPlace(id) {
        this.thirdPlaceCollection.doc(id).delete().then();
    }

}
