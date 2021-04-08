import {TestBed} from '@angular/core/testing';

import {NationalteamsService} from './nationalteams.service';

describe('NationalteamsService', () => {
    let service: NationalteamsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NationalteamsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
