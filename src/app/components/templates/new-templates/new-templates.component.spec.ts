import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NewTemplatesComponent} from './new-templates.component';

describe('NewTemplatesComponent', () => {
    let component: NewTemplatesComponent;
    let fixture: ComponentFixture<NewTemplatesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NewTemplatesComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NewTemplatesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
