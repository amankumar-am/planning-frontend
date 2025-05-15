import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallDataComponent } from './overall-data.component';

describe('OverallDataComponent', () => {
  let component: OverallDataComponent;
  let fixture: ComponentFixture<OverallDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverallDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverallDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
