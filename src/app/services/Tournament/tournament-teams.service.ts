import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {TournamentTeams} from '../../interfaces/tournament-teams';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class TournamentTeamsService {
    teamsByGroups: Observable<TournamentTeams[]>;
    teamsCollection: AngularFirestoreCollection<TournamentTeams>;
    teams: Observable<TournamentTeams[]>;

    constructor(private afs: AngularFirestore) {
        this.teamsCollection = afs.collection<TournamentTeams>('tournamentTeams', ref => ref.orderBy('order'));
        this.teams = this.teamsCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as TournamentTeams;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    getTeams() {
        return this.teams;
    }

    getTeamByTeamId(teamId, tournamentName) {
        return this.afs.collection('tournamentTeams', ref => ref.where('teamId', '==', teamId)
            .where('tournamentName', '==', tournamentName)).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as TournamentTeams;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    addTeam(tournamentTeams: TournamentTeams) {
        this.teamsCollection.add(tournamentTeams).catch(error => console.log(error));
    }

    deleteTeam(teamId) {
        this.teamsCollection.doc(teamId).delete().catch(error => console.log(error));
    }

    updateTeam(id, teamId, teamName, flagUrl, tournamentId) {
        this.teamsCollection.doc(id).update({
            teamId,
            teamName,
            flagUrl,
            tournamentId
        }).catch(error => console.log(error));
    }

    deleteTeamByTournament(tournamentId) {
        return this.afs.collection('tournamentTeams', ref => ref.where('tournamentId', '==', tournamentId)).valueChanges();
    }
}
