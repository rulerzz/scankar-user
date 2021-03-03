import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallwaiterComponent } from './callwaiter.component';

describe('CallwaiterComponent', () => {
  let component: CallwaiterComponent;
  let fixture: ComponentFixture<CallwaiterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallwaiterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallwaiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
