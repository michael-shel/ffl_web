import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalReplaceProductComponent } from './modal-replace-product.component';

describe('ModalReplaceProductComponent', () => {
  let component: ModalReplaceProductComponent;
  let fixture: ComponentFixture<ModalReplaceProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalReplaceProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalReplaceProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
