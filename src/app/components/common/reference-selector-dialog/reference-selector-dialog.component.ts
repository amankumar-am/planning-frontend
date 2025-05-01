// src/app/components/reference-selector-dialog/reference-selector-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MATERIAL_STANDALONE_IMPORTS } from '../../materialConfig/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reference-selector-dialog',
  templateUrl: './reference-selector-dialog.component.html',
  styleUrls: ['./reference-selector-dialog.component.css'],
  imports: [...MATERIAL_STANDALONE_IMPORTS, FormsModule, ReactiveFormsModule, CommonModule],
})
export class ReferenceSelectorDialogComponent {
  searchQuery: string = '';
  filteredData: any[] = [];
  selectedValue: any;
  displayedColumns: string[] = ['select', 'displayField'];

  constructor(
    public dialogRef: MatDialogRef<ReferenceSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.filteredData = [...data.referenceData];
    this.selectedValue = data.currentValue;

    // Add additional columns if specified
    if (data.displayFields) {
      this.displayedColumns = ['select', 'displayField', ...data.displayFields];
    }
  }

  filterData(): void {
    if (!this.searchQuery) {
      this.filteredData = [...this.data.referenceData];
      return;
    }

    this.filteredData = this.data.referenceData.filter((item: any) =>
      item[this.data.displayField].toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  selectItem(): void {
    this.dialogRef.close(this.selectedValue);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}