import {TestBed} from '@angular/core/testing';

import {SingleMatchesService} from './single-matches.service';

describe('SingleMatchesService', () => {
    let service: SingleMatchesService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SingleMatchesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
