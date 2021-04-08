import {TestBed} from '@angular/core/testing';

import {MatchesLineUpService} from './matches-line-up.service';

describe('MatchesLineUpService', () => {
    let service: MatchesLineUpService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MatchesLineUpService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
