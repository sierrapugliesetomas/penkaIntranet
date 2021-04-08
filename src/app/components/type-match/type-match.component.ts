import {Component, OnInit} from '@angular/core';
import {TypeMatch} from '../../interfaces/type-match';
import {TypeMatchService} from '../../services/typeMatch/type-match.service';

@Component({
    selector: 'app-type-match',
    templateUrl: './type-match.component.html',
    styleUrls: ['./type-match.component.css']
})
export class TypeMatchComponent implements OnInit {

    typeMatches = [];
    typeMatch = {} as TypeMatch;

    constructor(private typeMatchService: TypeMatchService) {
    }

    ngOnInit() {
        this.typeMatchService.getTypeMatches().subscribe(
            res => this.typeMatches = res,
            error => console.log(error)
        );
    }

    add() {
        this.typeMatchService.addTypeMatch(this.typeMatch);
        this.typeMatch = {} as TypeMatch;
    }

    delete(event, typeMatch: TypeMatch) {
        if (confirm('¿Esta seguro de borrar el registro?')) {
            this.typeMatchService.deleteTypeMatch(typeMatch.id);
        }
    }

}
