import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTabAddressComponent } from './profile-tab-address.component';

describe('ProfileTabAddressComponent', () => {
  let component: ProfileTabAddressComponent;
  let fixture: ComponentFixture<ProfileTabAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileTabAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileTabAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
