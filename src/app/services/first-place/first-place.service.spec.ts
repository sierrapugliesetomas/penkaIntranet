import {TestBed} from '@angular/core/testing';

import {FirstPlaceService} from './first-place.service';

describe('FirstPlaceService', () => {
    let service: FirstPlaceService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FirstPlaceService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
