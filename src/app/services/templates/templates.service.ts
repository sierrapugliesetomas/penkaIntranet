import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Templates} from '../../interfaces/templates';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TemplatesService {

    templatesCollection: AngularFirestoreCollection<Templates>;
    templates: Observable<Templates[]>;

    constructor(private afs: AngularFirestore) {
        this.templatesCollection = afs.collection<Templates>('templates', ref => ref.orderBy('name'));
        this.templates = this.templatesCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Templates;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    getTemplate(): any {
        return this.templates;
    }

    getTemplatesActive(): any {
        return this.afs.collection<Templates>('templates', ref => ref.where('publish', '==', true)
            .where('status', '==', '0')).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Templates;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    getTemplateByCode(code): any {
        return this.afs.collection<Templates>('templates', ref => ref.where('codeTemplate', '==', code)
        ).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Templates;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    addTemplate(templates: Templates): any {
        this.templatesCollection.add(templates).catch(error => console.log(error));
    }

    updateMvp(id, mvp) {
        this.templatesCollection.doc(id).update({mvp: mvp}).catch();
    }

    updateMaximumScorer(id, maximumScorer) {
        this.templatesCollection.doc(id).update({maximumScorer: maximumScorer}).catch();
    }

    updateChampion(id, champion) {
        this.templatesCollection.doc(id).update({
            championId: champion.id,
            championAlias: champion.alias,
            championName: champion.name
        }).catch();
    }

    delete(id): any {
        this.templatesCollection.doc(id).delete().catch();
    }

    publish(id): any {
        this.templatesCollection.doc(id).update({publish: true, status: '1'}).catch();
    }

    stock(id): any {
        this.templatesCollection.doc(id).update({filed: true}).catch();
    }
}
