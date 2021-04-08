import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {MatchesFinalsComponent} from './matches-finals.component';

describe('MatchesFinalsComponent', () => {
  let component: MatchesFinalsComponent;
  let fixture: ComponentFixture<MatchesFinalsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchesFinalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchesFinalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
