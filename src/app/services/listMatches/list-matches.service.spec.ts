import {TestBed} from '@angular/core/testing';

import {ListMatchesService} from './list-matches.service';

describe('ListMatchesService', () => {
    let service: ListMatchesService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ListMatchesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
