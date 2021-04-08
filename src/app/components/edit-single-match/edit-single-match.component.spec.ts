import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {EditSingleMatchComponent} from './edit-single-match.component';

describe('EditSingleMatchComponent', () => {
  let component: EditSingleMatchComponent;
  let fixture: ComponentFixture<EditSingleMatchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSingleMatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSingleMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
