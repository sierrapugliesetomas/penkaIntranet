import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {NewSingleMatchComponent} from './new-single-match.component';

describe('NewSingleMatchComponent', () => {
  let component: NewSingleMatchComponent;
  let fixture: ComponentFixture<NewSingleMatchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSingleMatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSingleMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
