import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Federation} from '../../../interfaces/federation';
import {FederationsService} from '../../../services/federation/federations.service';

@Component({
    selector: 'app-edit-federation',
    templateUrl: './edit-federation.component.html',
    styleUrls: ['./edit-federation.component.css']
})
export class EditFederationComponent implements OnInit {

    id: string;
    federation = {} as Federation;

    constructor(
        private activatedRoute: ActivatedRoute,
        private federationService: FederationsService,
        private router: Router) {
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe(
            (params: Params) => {
                this.id = params.id;
            }
        );

        this.federationService.getFederationById(this.id).subscribe(
            res => this.federation = res,
            error => console.log(error)
        );
    }

    update() {
        this.federationService.updateFederation(this.id, this.federation);
        this.router.navigate(['federations']).then();
    }

    back() {
        this.router.navigate(['federations']).then();
    }
}
