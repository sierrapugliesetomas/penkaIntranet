import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {FederationsComponent} from './federations.component';

describe('FederationsComponent', () => {
  let component: FederationsComponent;
  let fixture: ComponentFixture<FederationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FederationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FederationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
