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

    getParticipantByGamble(userId, codePenka): any {
        return this.afs.collection<Participant>('participants', ref => ref.where('userId', '==', userId)
            .where('codePenka', '==', codePenka)).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Participant;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    updateScore(id, accumulatedScore: number): any {
        this.participantsCollection.doc(id).update({accumulatedScore}).catch(error => console.log(error));
    }
}
