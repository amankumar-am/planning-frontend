import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceFieldModalComponent } from './reference-field-modal.component';

describe('ReferenceFieldModalComponent', () => {
  let component: ReferenceFieldModalComponent;
  let fixture: ComponentFixture<ReferenceFieldModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferenceFieldModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferenceFieldModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
