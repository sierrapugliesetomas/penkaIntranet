import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {EditFederationComponent} from './edit-federation.component';

describe('EditFederationComponent', () => {
  let component: EditFederationComponent;
  let fixture: ComponentFixture<EditFederationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFederationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFederationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
