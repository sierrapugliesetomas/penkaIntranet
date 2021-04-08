import {TestBed} from '@angular/core/testing';

import {ThirdPlaceService} from './third-place.service';

describe('ThirdPlaceService', () => {
    let service: ThirdPlaceService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ThirdPlaceService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
