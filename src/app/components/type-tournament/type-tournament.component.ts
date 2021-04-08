import {Component, OnInit} from '@angular/core';
import {TypeTournament} from '../../interfaces/type-tournament';
import {TypeTournamentService} from '../../services/typeTournament/type-tournament.service';

@Component({
    selector: 'app-type-tournament',
    templateUrl: './type-tournament.component.html',
    styleUrls: ['./type-tournament.component.css']
})
export class TypeTournamentComponent implements OnInit {

    typeTournaments = [];
    typeTournament = {} as TypeTournament;

    constructor(private typeTournamentService: TypeTournamentService) {
    }

    ngOnInit() {
        this.typeTournamentService.getTypeTournaments().subscribe(
            res => this.typeTournaments = res,
            error => console.log(error)
        );
    }

    add() {

        if (this.typeTournament.groups === true) {
            this.typeTournament.name = 'Fase de grupos + ' + this.typeTournament.phaseFinals;
        }else{
            this.typeTournament.name = this.typeTournament.phaseFinals;
        }

        this.typeTournamentService.addTypeTournament(this.typeTournament);
        this.typeTournament = {} as TypeTournament;
    }

    delete(event, typeTournament: TypeTournament) {
        if (confirm('Esta seguro de eliminar el Tipo de Torneo: "' + typeTournament.name + '"')) {
            this.typeTournamentService.deleteTypeTournament(typeTournament.id);
        }
    }
}
