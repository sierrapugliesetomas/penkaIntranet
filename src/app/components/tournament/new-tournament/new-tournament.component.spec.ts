import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {NewTournamentComponent} from './new-tournament.component';

describe('NewTournamentComponent', () => {
  let component: NewTournamentComponent;
  let fixture: ComponentFixture<NewTournamentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTournamentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTournamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
