import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecomendedBanerComponent } from './recomended-baner.component';

describe('RecomendedBanerComponent', () => {
  let component: RecomendedBanerComponent;
  let fixture: ComponentFixture<RecomendedBanerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecomendedBanerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecomendedBanerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
