import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Format} from '../../interfaces/format';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FormatService {
    formatCollection: AngularFirestoreCollection<Format>;
    formats: Observable<Format[]>;

    constructor(private afs: AngularFirestore) {
        this.formatCollection = afs.collection<Format>('formats', ref => ref.orderBy('name'));
        this.formats = this.formatCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Format;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    getFormats() {
        return this.formats;
    }

    getFormatByName(formatName) {
        return this.afs.collection<Format>('formats', ref => ref.where('name', '==', formatName))
            .snapshotChanges().pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as Format;
                    const id = a.payload.doc.id;
                    return {id, ...data};
                }))
            );
    }

    getFormatById(id) {
        return this.formatCollection.doc(id).valueChanges();
    }

    addFormat(format: Format) {
        this.formatCollection.add(format).then();
    }

    deleteFormat(id) {
        this.formatCollection.doc(id).delete().then();
    }

    updateFormat(id, format: Format) {
        this.formatCollection.doc(id).update(format).then();
    }
}
