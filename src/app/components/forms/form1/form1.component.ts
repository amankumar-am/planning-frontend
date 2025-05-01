import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { CommonModule } from '@angular/common';
import { MATERIAL_STANDALONE_IMPORTS } from '../../materialConfig/material.module';
import { FinancialYearService } from '../../../services/financial-year.service';
import { FinancialYear } from '../../../models/financialYear.model';
import { ReferenceFieldComponent } from '../../common/reference-field/reference-field.component';
// import { ReferenceFieldComponent } from '../../common/reference-field/reference-field.component';


@Component({
  selector: 'app-form1',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ...MATERIAL_STANDALONE_IMPORTS,
    CommonModule,
    ReferenceFieldComponent
  ],
  templateUrl: './form1.component.html',
  styleUrl: './form1.component.css'
})
export class Form1Component implements OnInit {
  // private _control: FormControl = new FormControl();

  // @Input()
  // set control(ctrl: FormControl | null) {
  //   this._control = ctrl || new FormControl();
  // }
  // get control(): FormControl {
  //   return this._control;
  // }

  @Input() step1Group!: FormGroup;
  @Input() stepper!: MatStepper;

  financialYears: FinancialYear[] = [];
  currentFinancialYear: FinancialYear | null = null;
  isLoading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loadFinancialYears();
    this.loadCurrentFinancialYear();
  }

  loadFinancialYears(): void {
    this.isLoading = true;
    this.error = null;

    this.financialYearService.getAllFinancialYears().subscribe({
      next: (data) => {
        this.financialYears = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }

  loadCurrentFinancialYear(): void {
    this.financialYearService.getCurrentFinancialYear().subscribe({
      next: (data) => {
        this.currentFinancialYear = data;
      },
      error: (err) => {
        console.error('Failed to load current financial year:', err);
      }
    });
  }

  setAsCurrent(id: number): void {
    if (confirm('Are you sure you want to set this as the current financial year?')) {
      this.financialYearService.setCurrentFinancialYear(id).subscribe({
        next: () => {
          this.loadCurrentFinancialYear();
          this.loadFinancialYears(); // Refresh list to update status
        },
        error: (err) => {
          console.error('Failed to set current financial year:', err);
        }
      });
    }
  }
  goNext() {
    if (this.step1Group.valid) {
      this.stepper.next();
    }
  }
  constructor(private financialYearService: FinancialYearService) { }

  onFinancialYearSelected(selectedValue: any): void {
    console.log('Selected financial year:', selectedValue);
    // Add any additional logic here
  }

  get financialYearControl(): FormControl {
    return this.step1Group.get('demand_financialYear') as FormControl;
  }
}
