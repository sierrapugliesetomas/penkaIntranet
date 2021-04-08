import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {TypeMatchComponent} from './type-match.component';

describe('TypeMatchComponent', () => {
  let component: TypeMatchComponent;
  let fixture: ComponentFixture<TypeMatchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeMatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
