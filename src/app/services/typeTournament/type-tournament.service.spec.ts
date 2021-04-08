import {TestBed} from '@angular/core/testing';

import {TypeTournamentService} from './type-tournament.service';

describe('TypeTournamentService', () => {
    let service: TypeTournamentService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TypeTournamentService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
