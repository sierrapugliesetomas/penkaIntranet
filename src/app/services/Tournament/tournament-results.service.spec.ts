import {TestBed} from '@angular/core/testing';

import {TournamentResultsService} from './tournament-results.service';

describe('TournamentResultsService', () => {
    let service: TournamentResultsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TournamentResultsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
