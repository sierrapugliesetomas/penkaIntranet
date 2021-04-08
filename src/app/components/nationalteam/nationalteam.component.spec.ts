import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {NationalteamComponent} from './nationalteam.component';

describe('NationalteamComponent', () => {
  let component: NationalteamComponent;
  let fixture: ComponentFixture<NationalteamComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NationalteamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NationalteamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
