import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HistoryTemplatesComponent} from './history-templates.component';

describe('HistoryTemplatesComponent', () => {
    let component: HistoryTemplatesComponent;
    let fixture: ComponentFixture<HistoryTemplatesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HistoryTemplatesComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HistoryTemplatesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
