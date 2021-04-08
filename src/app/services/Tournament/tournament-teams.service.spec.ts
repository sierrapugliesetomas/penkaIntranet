import {TestBed} from '@angular/core/testing';

import {TournamentTeamsService} from './tournament-teams.service';

describe('TournamentTeamsService', () => {
    let service: TournamentTeamsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TournamentTeamsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
