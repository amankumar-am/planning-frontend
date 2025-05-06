import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { CommonModule } from '@angular/common';
import { MATERIAL_STANDALONE_IMPORTS } from '../../materialConfig/material.module';
import { FinancialYearService } from '../../../services/financial-year.service';
import { FinancialYear } from '../../../models/financialYear.model';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ReferenceFieldModule } from '../../shared/reference-field/reference-field.module';


@Component({
  selector: 'app-form1',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ...MATERIAL_STANDALONE_IMPORTS,
    CommonModule, ReferenceFieldModule,
    FormsModule
  ],
  templateUrl: './form1.component.html',
  styleUrl: './form1.component.css'
})
export class Form1Component implements OnInit {

  @Input() step1Group!: FormGroup;
  @Input() stepper!: MatStepper;
  selectedItemChange: EventEmitter<FinancialYear | null> = new EventEmitter<FinancialYear | null>();
  financialYears: FinancialYear[] = [];
  schema: { field: keyof FinancialYear; label: string }[] = [];
  displayedColumns: string[] = ['id', 'name', 'duration'];  // Adjust based on your schema
  selectedItem: FinancialYear | null = null;
  currentFinancialYear: FinancialYear | null = null;
  selectedFinancialYear: FinancialYear | null = null;
  financialYearLabelField = 'Financial Year';

  constructor(private fyService: FinancialYearService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadFinancialYears();
  }

  loadFinancialYears = async (): Promise<{
    data: FinancialYear[];
    schema: { field: keyof FinancialYear; label: string }[];
  }> => {
    try {
      const response = await firstValueFrom(this.fyService.getAllFinancialYears());

      if (response && response.data && response.schema) {
        return {
          data: response.data,
          schema: response.schema,
        };
      } else {
        return {
          data: [],
          schema: [],
        };
      }
    } catch (error) {
      console.error('Error loading financial years:', error);
      return {
        data: [],
        schema: [],
      };
    }

  };
  loadCurrentFinancialYear(): void {
    this.fyService.getCurrentFinancialYear().subscribe({
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
      this.fyService.setCurrentFinancialYear(id).subscribe({
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


  onFinancialYearSelected(selectedValue: any): void {
    this.selectedFinancialYear = selectedValue;
  }

  get financialYearControl(): FormControl {
    return this.step1Group.get('demand_financialYear') as FormControl;
  }
}
