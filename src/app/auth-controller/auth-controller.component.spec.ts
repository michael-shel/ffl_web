import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthControllerComponent } from './auth-controller.component';

describe('AuthControllerComponent', () => {
  let component: AuthControllerComponent;
  let fixture: ComponentFixture<AuthControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
