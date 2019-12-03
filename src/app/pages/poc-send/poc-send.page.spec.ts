import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PocSendPage } from './poc-send.page';

describe('PocSendPage', () => {
  let component: PocSendPage;
  let fixture: ComponentFixture<PocSendPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PocSendPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PocSendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
