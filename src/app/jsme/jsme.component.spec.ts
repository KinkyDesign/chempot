import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JsmeComponent } from './jsme.component';

describe('JsmeComponent', () => {
  let component: JsmeComponent;
  let fixture: ComponentFixture<JsmeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JsmeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
