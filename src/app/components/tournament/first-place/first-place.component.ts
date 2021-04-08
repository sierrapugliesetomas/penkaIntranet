import {Component, OnInit} from '@angular/core';
import {FirstPlace} from '../../../interfaces/first-place';
import {FirstPlaceService} from '../../../services/first-place/first-place.service';

@Component({
    selector: 'app-first-place',
    templateUrl: './first-place.component.html',
    styleUrls: ['./first-place.component.css']
})
export class FirstPlaceComponent implements OnInit {

    firstPlaces = [];
    firstPlace = {} as FirstPlace;

    constructor(private firstPlaceService: FirstPlaceService) {
    }

    ngOnInit() {
        this.firstPlaceService.getFirstPlaces().subscribe(
            res => this.firstPlaces = res,
            error => console.log(error)
        );
    }

    add() {
        this.firstPlaceService.addFirstPlace(this.firstPlace);
        this.firstPlace = {} as FirstPlace;
    }

    delete(event, firstPlace: FirstPlace) {
        if (confirm('¿Esta seguro de borrar el registro?')) {
            this.firstPlaceService.deleteFirstPlace(firstPlace.id);
        }
    }

}
