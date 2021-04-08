import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {EditMatchComponent} from './edit-match.component';

describe('EditMatchComponent', () => {
    let component: EditMatchComponent;
    let fixture: ComponentFixture<EditMatchComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [EditMatchComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditMatchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
