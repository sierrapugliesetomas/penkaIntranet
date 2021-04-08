import {Component, OnInit} from '@angular/core';
import {Club} from '../../../interfaces/club';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ClubsService} from '../../../services/club/clubs.service';
import {LeaguesService} from '../../../services/league/leagues.service';

@Component({
    selector: 'app-edit-club',
    templateUrl: './edit-club.component.html',
    styleUrls: ['./edit-club.component.css']
})
export class EditClubComponent implements OnInit {

    clubId: string;
    club = {} as Club;
    leagues = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private clubsService: ClubsService,
        private leaguesService: LeaguesService,
        private router: Router) {
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe(
            (params: Params) => {
                this.clubId = params.id;
            }
        );
        this.clubsService.getClubById(this.clubId).subscribe(
            res => this.club = res,
            error => console.log(error)
        );
        this.leaguesService.getLeagues().subscribe(
            res => this.leagues = res,
            error => console.log(error)
        );
    }

    update() {
        this.clubsService.updateClub(this.clubId, this.club);
        this.router.navigate(['clubs']).then();
    }

    back() {
        this.router.navigate(['clubs']).then();
    }
}
