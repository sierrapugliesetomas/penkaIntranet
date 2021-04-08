import {TestBed} from '@angular/core/testing';

import {GambleService} from './gamble.service';

describe('GambleService', () => {
    let service: GambleService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GambleService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
