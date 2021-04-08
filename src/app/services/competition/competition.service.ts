import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Competition} from '../../interfaces/competition';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CompetitionService {

    competitionCollection: AngularFirestoreCollection<Competition>;
    competitions: Observable<Competition[]>;

    constructor(private afs: AngularFirestore) {
        this.competitionCollection = afs.collection<Competition>('competitions', ref => ref.orderBy('name'));
        this.competitions = this.competitionCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Competition;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    getCompetitions() {
        return this.competitions;
    }

    addCompetition(competition: Competition) {
        this.competitionCollection.add(competition).catch(error => console.log(error));
    }

    deleteCompetition(id) {
        this.competitionCollection.doc(id).delete().then();
    }

    updateCompetition(id, competition: Competition) {
        this.competitionCollection.doc(id).update(competition).then();
    }

}
