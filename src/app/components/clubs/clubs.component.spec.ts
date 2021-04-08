import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {ClubsComponent} from './clubs.component';

describe('ClubsComponent', () => {
    let component: ClubsComponent;
    let fixture: ComponentFixture<ClubsComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ClubsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ClubsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
