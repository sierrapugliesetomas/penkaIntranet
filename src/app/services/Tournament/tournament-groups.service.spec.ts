import {TestBed} from '@angular/core/testing';

import {TournamentGroupsService} from './tournament-groups.service';

describe('TournamentGroupsService', () => {
    let service: TournamentGroupsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TournamentGroupsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
