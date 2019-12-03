import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PocReceivePage } from './poc-receive.page';

describe('PocReceivePage', () => {
  let component: PocReceivePage;
  let fixture: ComponentFixture<PocReceivePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PocReceivePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PocReceivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
