import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Country} from '../../interfaces/country';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CountriesService {

    countriesCollection: AngularFirestoreCollection<Country>;
    countries: Observable<Country[]>;

    constructor(private afs: AngularFirestore) {
        this.countriesCollection = afs.collection<Country>('countries', ref => ref.orderBy('name'));
        this.countries = this.countriesCollection.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Country;
                const id = a.payload.doc.id;
                return {id, ...data};
            }))
        );
    }

    getCountries() {
        return this.countries;
    }

    getCountryById(id) {
        return this.countriesCollection.doc(id).valueChanges();
    }

    getCountriesFiltered(filter: string) {
        return this.afs.collection<Country>('countries', ref => ref.where('federation', '==', filter))
            .snapshotChanges().pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as Country;
                    const id = a.payload.doc.id;
                    return {id, ...data};
                }))
            );
    }

    addCountry(country: Country) {
        this.countriesCollection.add(country)
            .catch(error => console.log(error));
    }

    deleteCountry(id) {
        this.countriesCollection.doc(id).delete()
            .catch(error => console.log(error));
    }

    updateCountry(id, country) {
        this.countriesCollection.doc(id).update(country)
            .catch(error => console.log(error));
    }
}
