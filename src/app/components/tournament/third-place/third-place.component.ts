import {Component, OnInit} from '@angular/core';
import {ThirdPlace} from '../../../interfaces/third-place';
import {ThirdPlaceService} from '../../../services/third-place/third-place.service';

@Component({
    selector: 'app-third-place',
    templateUrl: './third-place.component.html',
    styleUrls: ['./third-place.component.css']
})
export class ThirdPlaceComponent implements OnInit {

    thirdPlaces = [];
    thirdPlace = {} as ThirdPlace;

    constructor(private thirdPlaceService: ThirdPlaceService) {
    }

    ngOnInit() {
        this.thirdPlaceService.getThirdPlaces().subscribe(
            res => this.thirdPlaces = res,
            error => console.log(error)
        );
    }

    add() {
        this.thirdPlaceService.addThirdPlace(this.thirdPlace);
        this.thirdPlace = {} as ThirdPlace;
    }

    delete(event, thirdPlace: ThirdPlace) {
        if (confirm('¿Esta seguro de borrar el registro?')) {
            this.thirdPlaceService.deleteThirdPlace(thirdPlace.id);
        }
    }

}
