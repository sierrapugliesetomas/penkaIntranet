import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {LeaguesComponent} from './leagues.component';

describe('LeaguesComponent', () => {
    let component: LeaguesComponent;
    let fixture: ComponentFixture<LeaguesComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [LeaguesComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LeaguesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
