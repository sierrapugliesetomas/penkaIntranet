import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Player} from '../../interfaces/player';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PlayersService {

    playersCollection: AngularFirestoreCollection<Player>;
    players: Observable<Player[]>;

    constructor(private afs: AngularFirestore) {
        this.playersCollection = afs.collection<Player>('players', ref => ref.orderBy('name'));
        this.players = this.playersCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Player;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    getPlayers() {
        return this.players;
    }

    getPlayerById(id) {
        return this.playersCollection.doc(id).valueChanges();
    }

    getPlayersFiltered(country: any) {
        return this.afs.collection<Player>('players', ref => ref.where('country', '==', country))
            .snapshotChanges().pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as Player;
                    const id = a.payload.doc.id;
                    return {id, ...data};
                }))
            );
    }

    getPlayersNationalTeams(country: any) {
        return this.afs.collection<Player>('players', ref => ref.where('country', '==', country)
            .where('nationalTeam', '==', false)).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Player;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    addPlayer(player: Player) {
        this.playersCollection.add(player).then();
    }

    deletePlayer(id) {
        this.playersCollection.doc(id).delete().then();
    }

    updatePlayer(id, player) {
        this.playersCollection.doc(id).update(player).then();
    }

    addNationalTeam(id) {
        this.playersCollection.doc(id).update({nationalTeam: true}).then();
    }

    dropNationalTeam(id) {
        this.playersCollection.doc(id).update({nationalTeam: false}).then();
    }
}
