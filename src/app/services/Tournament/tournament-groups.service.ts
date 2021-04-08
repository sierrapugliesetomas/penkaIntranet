import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {TournamentGroups} from '../../interfaces/tournament-groups';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TournamentGroupsService {

    groupsCollection: AngularFirestoreCollection<TournamentGroups>;
    groups: Observable<TournamentGroups[]>;

    constructor(private afs: AngularFirestore) {
        this.groupsCollection = afs.collection<TournamentGroups>('tournamentGroups', ref => ref.orderBy('name'));
        this.groups = this.groupsCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as TournamentGroups;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    getGroups() {
        return this.groups;
    }

    getGroupsByTournament(tournamentName) {
        return this.afs.collection('tournamentGroups', ref => ref.where('tournamentName', '==', tournamentName))
            .snapshotChanges().pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as TournamentGroups;
                    const id = a.payload.doc.id;
                    return {id, ...data};
                }))
            );
    }

    getGroupById(id) {
        this.groupsCollection.doc(id).valueChanges();
    }

    addGroup(tournamentGroups: TournamentGroups) {
        this.groupsCollection.add(tournamentGroups).then();
    }

    deleteGroup(groupId) {
        this.groupsCollection.doc(groupId).delete().catch(error => console.log(error));
    }

}
