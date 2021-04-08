import {TestBed} from '@angular/core/testing';

import {TournamentMatchesService} from './tournament-matches.service';

describe('TournamentMatchesService', () => {
    let service: TournamentMatchesService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TournamentMatchesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
