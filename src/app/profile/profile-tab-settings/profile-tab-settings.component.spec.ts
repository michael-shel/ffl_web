import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTabSettingsComponent } from './profile-tab-settings.component';

describe('ProfileTabSettingsComponent', () => {
  let component: ProfileTabSettingsComponent;
  let fixture: ComponentFixture<ProfileTabSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileTabSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileTabSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
