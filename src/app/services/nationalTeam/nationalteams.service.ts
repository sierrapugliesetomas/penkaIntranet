import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {NationalTeam} from '../../interfaces/national-team';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class NationalteamsService {

    nationalteams: Observable<NationalTeam[]>;
    nationalteam = {} as NationalTeam;

    constructor(
        private afs: AngularFirestore) {
    }

    getNationalTeams() {
        return this.afs.collection<NationalTeam>('nationalteams').snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as NationalTeam;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    addNationalTeam(id, name, country, photo) {
        this.nationalteam.playerId = id;
        this.nationalteam.player = name;
        this.nationalteam.country = country;
        this.nationalteam.photoUrl = photo;
        this.afs.collection('nationalteams').add(this.nationalteam).then();
    }

    deleteNationalTeam(id) {
        this.afs.collection('nationalteams').doc(id).delete().then();
    }
}
