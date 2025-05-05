import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FinancialYear } from '../../../../models/financialYear.model';
import { MATERIAL_STANDALONE_IMPORTS } from '../../../materialConfig/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reference-field-modal',
  templateUrl: './reference-field-modal.component.html',
  styleUrls: ['./reference-field-modal.component.css'],
  standalone: true,
  imports: [...MATERIAL_STANDALONE_IMPORTS, CommonModule, FormsModule]
})
export class ReferenceFieldModalComponent {
  data: FinancialYear[] = [];
  schema: { field: keyof FinancialYear; label: string }[] = [];
  displayedColumns: string[] = [];
  filteredData: FinancialYear[] = [];
  searchTerm: string = '';
  selectedItem: FinancialYear | null = null;

  constructor(
    public dialogRef: MatDialogRef<ReferenceFieldModalComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: { data: FinancialYear[], schema: { field: keyof FinancialYear; label: string }[] }
  ) {
    this.data = dialogData.data;
    this.schema = dialogData.schema;
    this.displayedColumns = this.schema.map(col => col.field as string);
    this.filteredData = [...this.data];
  }

  applyFilter(): void {
    const lowerTerm = this.searchTerm.toLowerCase();
    this.filteredData = this.data.filter(item =>
      this.displayedColumns.some(col =>
        String(item[col as keyof FinancialYear] ?? '').toLowerCase().includes(lowerTerm)
      )
    );
  }

  submitSelection(): void {
    this.dialogRef.close(this.selectedItem);
  }

  get tableColumns(): string[] {
    return ['select', ...this.displayedColumns];
  }
}
