import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ListMatches} from '../../interfaces/list-matches';

@Injectable({
    providedIn: 'root'
})
export class ListMatchesService {

    listMatchesCollection: AngularFirestoreCollection<ListMatches>;
    listMatches: Observable<ListMatches[]>;

    constructor(private afs: AngularFirestore) {
        this.listMatchesCollection = afs.collection<ListMatches>('listMatches', ref => ref.orderBy('startDate', 'asc'));
        this.listMatches = this.listMatchesCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as ListMatches;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    getListMatches() {
        return this.listMatches;
    }

    // Get list matches by code penka and single match id
    getListMatchesCodePenkaMatchId(singleMatchId, codePenka) {
        return this.afs.collection<ListMatches>('ListMatches', ref => ref.where('singleMatchId', '==', singleMatchId)
            .where('codePenka', '==', codePenka)).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as ListMatches;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    // Get list matches by code penka and single match id
    getListMatchesByCodeTemplate(singleMatchId, codeTemplate) {
        return this.afs.collection<ListMatches>('ListMatches', ref => ref.where('singleMatchId', '==', singleMatchId)
            .where('codeTemplate', '==', codeTemplate)).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as ListMatches;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }


    getListMatchesByCodePenka(codePenka) {
        return this.afs.collection<ListMatches>('ListMatches', ref => ref.orderBy('startDate', 'asc')
            .where('codePenka', '==', codePenka)).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as ListMatches;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    getListMatchesBySingleMatchId(singleMatchId) {
        return this.afs.collection<ListMatches>('ListMatches', ref => ref.orderBy('startDate', 'asc')
            .where('singleMatchId', '==', singleMatchId)).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as ListMatches;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    addMatch(singleMatchId, codePenka, codeTemplate, userId, userName, userEmail, userPhoto, date, homeTeamId, homeTeamName, homeTeamAlias, homeTeamFlag, visitTeamId, visitTeamName, visitTeamAlias, visitTeamFlag, startDate, limitDate, status) {
        this.listMatchesCollection.add({
            singleMatchId,
            codePenka,
            codeTemplate,
            userId,
            userName,
            userEmail,
            userPhoto,
            date,
            homeTeamId,
            homeTeamName,
            homeTeamAlias,
            homeTeamFlag,
            visitTeamId,
            visitTeamName,
            visitTeamAlias,
            visitTeamFlag,
            startDate,
            limitDate,
            status
        }).catch(error => console.log(error));
    }

    getMatchForDelete(singleMatchId, userId, codePenka) {
        return this.afs.collection<ListMatches>('listMatches', ref => ref.where('singleMatchId', '==', singleMatchId)
            .where('userId', '==', userId).where('codePenka', '==', codePenka))
            .snapshotChanges().pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as ListMatches;
                    const id = a.payload.doc.id;
                    return {id, ...data};
                }))
            );
    }

    deleteMatch(id: string) {
        this.listMatchesCollection.doc(id).delete().catch(error => console.log(error));
    }

    updateStatus(id: string) {
        this.listMatchesCollection.doc(id).update({status: '2'}).catch(error => console.log(error));
    }

}
