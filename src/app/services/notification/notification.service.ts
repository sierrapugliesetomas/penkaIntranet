import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PenkaRequest } from 'src/app/interfaces/penka-request';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  penkaRequestCollection: AngularFirestoreCollection<PenkaRequest>;
  penkaRequest: Observable<PenkaRequest[]>;

  constructor(private afs: AngularFirestore) {
      this.penkaRequestCollection = afs.collection<PenkaRequest>('penkaRequest');
      this.penkaRequest = this.penkaRequestCollection.snapshotChanges().pipe(
          map(actions => actions.map(a => {
              const data = a.payload.doc.data() as PenkaRequest;
              const id = a.payload.doc.id;
              return {id, ...data};
          }))
      );
  }

  getPenkaRequest() {
      return this.penkaRequest;
  }

  addNotification(penkaRequest: PenkaRequest) {
      this.penkaRequestCollection.add(penkaRequest).catch(error => console.log(error));
  }

  updateNotification(request: PenkaRequest) {
      this.penkaRequestCollection.doc(request.id).update(request).catch(error => console.log(error));
  }
}

