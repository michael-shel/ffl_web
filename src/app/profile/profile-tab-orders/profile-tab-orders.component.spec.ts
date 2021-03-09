import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTabOrdersComponent } from './profile-tab-orders.component';

describe('ProfileTabOrdersComponent', () => {
  let component: ProfileTabOrdersComponent;
  let fixture: ComponentFixture<ProfileTabOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileTabOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileTabOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
