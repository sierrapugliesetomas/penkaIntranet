import {Component, OnInit} from '@angular/core';
import {Federation} from '../../interfaces/federation';
import {FederationsService} from '../../services/federation/federations.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-federations',
    templateUrl: './federations.component.html',
    styleUrls: ['./federations.component.css']
})
export class FederationsComponent implements OnInit {
    federations = [];
    newFederation = {} as Federation;

    constructor(
        private federationService: FederationsService,
        private router: Router) {
    }

    ngOnInit() {
        this.federationService.getFederations().subscribe(
            res => this.federations = res,
            error => console.log(error)
        );
    }

    add() {
        this.federationService.addFederation(this.newFederation);
        this.newFederation = {} as Federation;
    }

    delete(event, federation: Federation) {
        if (confirm('Desea borrar: "' + federation.name + '"')) {
            this.federationService.deleteFederation(federation.id);
        }
    }

    edit(event, federation: Federation) {
        this.router.navigate(['federations/edit/' + federation.id]).then();
    }
}
