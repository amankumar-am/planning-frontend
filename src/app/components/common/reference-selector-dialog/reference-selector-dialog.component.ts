// src/app/components/reference-selector-dialog/reference-selector-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MATERIAL_STANDALONE_IMPORTS } from '../../materialConfig/material.module';

@Component({
  selector: 'app-reference-selector-dialog',
  standalone: true,
  templateUrl: './reference-selector-dialog.component.html',
  styleUrls: ['./reference-selector-dialog.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ...MATERIAL_STANDALONE_IMPORTS
  ],
})
export class ReferenceSelectorDialogComponent {
  searchQuery: string = '';
  filteredData: any[] = [];
  selectedValue: any;

  allDisplayFields: string[] = [];
  selectedDisplayFields: string[] = [];
  displayedColumns: string[] = ['select', 'displayField'];

  constructor(
    public dialogRef: MatDialogRef<ReferenceSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.filteredData = [...data.referenceData];
    this.selectedValue = data.currentValue;
    console.log(data);

    if (data.displayFields) {
      this.allDisplayFields = [...data.displayFields];
    }

    this.updateDisplayedColumns();
    console.log(this.allDisplayFields);

  }

  updateDisplayedColumns(): void {
    this.displayedColumns = ['select', 'displayField', ...this.selectedDisplayFields];
  }

  filterData(): void {
    if (!this.searchQuery) {
      this.filteredData = [...this.data.referenceData];
      return;
    }

    this.filteredData = this.data.referenceData.filter((item: any) =>
      item[this.data.displayField]?.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  selectItem(): void {
    this.dialogRef.close(this.selectedValue);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
