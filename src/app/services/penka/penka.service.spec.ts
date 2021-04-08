import {TestBed} from '@angular/core/testing';

import {PenkaService} from './penka.service';

describe('PenkaService', () => {
    let service: PenkaService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PenkaService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
