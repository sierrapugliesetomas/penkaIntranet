import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Club} from '../../interfaces/club';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ClubsService {

    clubsCollection: AngularFirestoreCollection<Club>;
    clubs: Observable<Club[]>;

    constructor(private afs: AngularFirestore) {
        this.clubsCollection = afs.collection<Club>('clubs', ref => ref.orderBy('name'));
        this.clubs = this.clubsCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Club;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    getClubs() {
        return this.clubs;
    }

    getClubById(id) {
        return this.clubsCollection.doc(id).valueChanges();
    }

    getClubsFiltered(filter: any) {
        return this.afs.collection<Club>('clubs', ref => ref.where('league', '==', filter)).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Club;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    addClub(club: Club) {
        this.clubsCollection.add(club).then();
    }

    deleteClub(id) {
        this.clubsCollection.doc(id).delete().then();
    }

    updateClub(id, club: Club) {
        this.clubsCollection.doc(id).update(club).then();
    }
}
