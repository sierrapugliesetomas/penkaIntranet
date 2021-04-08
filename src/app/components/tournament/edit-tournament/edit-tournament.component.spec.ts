import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {EditTournamentComponent} from './edit-tournament.component';

describe('EditTournamentComponent', () => {
  let component: EditTournamentComponent;
  let fixture: ComponentFixture<EditTournamentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTournamentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTournamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
