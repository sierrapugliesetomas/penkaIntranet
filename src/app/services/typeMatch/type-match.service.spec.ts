import {TestBed} from '@angular/core/testing';

import {TypeMatchService} from './type-match.service';

describe('TypeMatchService', () => {
    let service: TypeMatchService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TypeMatchService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
