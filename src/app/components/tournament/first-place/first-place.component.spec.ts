import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {FirstPlaceComponent} from './first-place.component';

describe('FirstPlaceComponent', () => {
  let component: FirstPlaceComponent;
  let fixture: ComponentFixture<FirstPlaceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstPlaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
