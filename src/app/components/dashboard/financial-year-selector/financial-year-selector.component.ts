// src/app/components/dashboard/financial-year-selector/financial-year-selector.component.ts

import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core'; // Added Input, OnChanges, SimpleChanges
import { MATERIAL_STANDALONE_IMPORTS } from '../../materialConfig/material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// No longer needs Ps1UtilsService directly if financialYears are passed in

@Component({
  selector: 'app-financial-year-selector',
  standalone: true,
  imports: [...MATERIAL_STANDALONE_IMPORTS, FormsModule, CommonModule],
  templateUrl: './financial-year-selector.component.html',
  styleUrls: ['./financial-year-selector.component.scss']
})
export class FinancialYearSelectorComponent implements OnInit, OnChanges {
  @Input() financialYearsInput: { label: string; value: string }[] = []; // Renamed to avoid clash
  @Input() initialSelectedYearId: string | null = null; // Optional input for initial selection
  @Output() yearSelected = new EventEmitter<string>();

  selectedYear: string | null = null;
  // financialYears property will be a copy of the input or derived
  financialYears: { label: string; value: string }[] = [];


  constructor() { }

  ngOnInit(): void {
    this.updateFinancialYears();
    // Set initial selection if provided and not already set
    if (this.initialSelectedYearId && !this.selectedYear && this.financialYears.some(fy => fy.value === this.initialSelectedYearId)) {
      this.selectedYear = this.initialSelectedYearId;
      // Optionally emit, or let parent decide if initial emit is needed
      // this.onYearChange();
    } else if (this.financialYears.length > 0 && !this.selectedYear) {
      // Default to first if no initial selection is provided
      this.selectedYear = this.financialYears[0].value;
      this.onYearChange(); // Emit default
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['financialYearsInput']) {
      this.updateFinancialYears();
      // Re-evaluate default selection when input list changes,
      // but be careful not to override user's explicit selection if not desired.
      // This logic might need to be smarter based on requirements.
      if (!this.selectedYear && this.financialYears.length > 0) {
        this.selectedYear = this.financialYears[0].value;
        this.onYearChange();
      } else if (this.financialYears.length > 0 && this.selectedYear && !this.financialYears.some(fy => fy.value === this.selectedYear)) {
        // If current selection is no longer valid, select the first and emit
        this.selectedYear = this.financialYears[0].value;
        this.onYearChange();
      } else if (this.financialYears.length === 0) {
        this.selectedYear = null;
        // Optionally emit null or an empty string if the list becomes empty
        // this.yearSelected.emit(null);
      }
    }
    if (changes['initialSelectedYearId'] && this.initialSelectedYearId && this.financialYears.some(fy => fy.value === this.initialSelectedYearId)) {
      if (this.selectedYear !== this.initialSelectedYearId) {
        this.selectedYear = this.initialSelectedYearId;
        // this.onYearChange(); // Emit if initial value changes programmatically
      }
    }
  }

  private updateFinancialYears(): void {
    this.financialYears = [...(this.financialYearsInput || [])];
  }

  onYearChange() {
    if (this.selectedYear) {
      this.yearSelected.emit(this.selectedYear);
    }
  }
}