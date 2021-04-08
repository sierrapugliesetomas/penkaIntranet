import {TestBed} from '@angular/core/testing';

import {FederationsService} from './federations.service';

describe('FederationsService', () => {
    let service: FederationsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FederationsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
