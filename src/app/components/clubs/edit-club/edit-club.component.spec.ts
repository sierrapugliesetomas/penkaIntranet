import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {EditClubComponent} from './edit-club.component';

describe('EditClubComponent', () => {
    let component: EditClubComponent;
    let fixture: ComponentFixture<EditClubComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [EditClubComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditClubComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
