import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {MatchesComponent} from './matches.component';

describe('MatchesComponent', () => {
    let component: MatchesComponent;
    let fixture: ComponentFixture<MatchesComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [MatchesComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MatchesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
