import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {EditPlayerComponent} from './edit-player.component';

describe('EditPlayerComponent', () => {
    let component: EditPlayerComponent;
    let fixture: ComponentFixture<EditPlayerComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [EditPlayerComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditPlayerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
