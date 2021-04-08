import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {TypeTournament} from '../../interfaces/type-tournament';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TypeTournamentService {

    typeTournamentCollection: AngularFirestoreCollection<TypeTournament>;
    typeTournaments: Observable<TypeTournament[]>;

    constructor(private afs: AngularFirestore) {
        this.typeTournamentCollection = afs.collection<TypeTournament>('typeTournaments', ref => ref.orderBy('name'));
        this.typeTournaments = this.typeTournamentCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as TypeTournament;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    getTypeTournaments() {
        return this.typeTournaments;
    }

    getTypeTournamentById(id) {
        return this.typeTournamentCollection.doc(id).valueChanges();
    }

    addTypeTournament(typeTournament: TypeTournament) {
        this.typeTournamentCollection.add(typeTournament).then();
    }

    deleteTypeTournament(id) {
        this.typeTournamentCollection.doc(id).delete().then();
    }
}
