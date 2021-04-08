import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {TypeTournamentComponent} from './type-tournament.component';

describe('TypeTournamentComponent', () => {
  let component: TypeTournamentComponent;
  let fixture: ComponentFixture<TypeTournamentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeTournamentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeTournamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
