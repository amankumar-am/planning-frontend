import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceSelectorDialogComponent } from './reference-selector-dialog.component';

describe('ReferenceSelectorDialogComponent', () => {
  let component: ReferenceSelectorDialogComponent;
  let fixture: ComponentFixture<ReferenceSelectorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferenceSelectorDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferenceSelectorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
