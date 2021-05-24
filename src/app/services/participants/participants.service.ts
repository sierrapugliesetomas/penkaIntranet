import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Participant} from '../../interfaces/participant';

class Participants {
}

@Injectable({
    providedIn: 'root'
})
export class ParticipantsService {
    participantsCollection: AngularFirestoreCollection<Participant>;
    participants: Observable<Participant[]>;

    constructor(private afs: AngularFirestore) {
        this.participantsCollection = afs.collection<Participant>('participants');
        this.participants = this.participantsCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Participant;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    getParticipants() {
        return this.participants;
    }

    getAllParticipantsOnce() {
        return this.afs.collection<Participant>('participants')
            .get().pipe(
                map(actions => actions.docs.map(a => {
                    const data = a.data() as Participant;
                    const id = a.id;
                    return {id, ...data};
                })
            )
        );    
    }

    getParticipantByUserId(userId) {
        return this.afs.collection<Participant>('participants', ref => ref.where('userId', '==', userId))
            .snapshotChanges().pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as Participant;
                    const id = a.payload.doc.id;
                    return {id, ...data};
                }))
            );
    }

    getParticipantByGamble(userId, codePenka) {
        return this.afs.collection<Participant>('participants', ref => ref.where('userId', '==', userId)
            .where('codePenka', '==', codePenka)).get().pipe(
            map(actions => actions.docs.map(a => {
                const data = a.data() as Participant;
                const id = a.id;
                return {id, ...data};
            }))
        );
    }

    getParticipantByCodePenka(codePenka): any { /* participant.ts */
        return this.afs.collection<Participant>('participants', ref => ref
            .where('codePenka', '==', codePenka)
            // .where('status', 'in', ['1', '2', '9'])
            .orderBy('accumulatedScore', 'desc'))
            .snapshotChanges()
            .pipe(map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as Participant;
                    const id = a.payload.doc.id;
                    return {id, ...data};
                }))
            );
    }

    update(participant) {
       return this.participantsCollection.doc(participant.id).update(participant).catch(error => console.log(error));
    }

    updateScore(id, accumulatedScore: number): any {
        this.participantsCollection.doc(id).update({accumulatedScore}).catch(error => console.log(error));
    }

    updateStatus(id, status): any {
        this.participantsCollection.doc(id).update({status}).catch();
    }

    updatePlace(id, place): void {
        this.participantsCollection.doc(id).update({place}).catch();
    }
}
