import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {FinalsComponent} from './finals.component';

describe('FinalsComponent', () => {
    let component: FinalsComponent;
    let fixture: ComponentFixture<FinalsComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [FinalsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FinalsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
