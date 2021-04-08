import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {EditNationalteamComponent} from './edit-nationalteam.component';

describe('EditNationalteamComponent', () => {
  let component: EditNationalteamComponent;
  let fixture: ComponentFixture<EditNationalteamComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditNationalteamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNationalteamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
