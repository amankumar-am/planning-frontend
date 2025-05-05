import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MATERIAL_STANDALONE_IMPORTS } from '../../materialConfig/material.module';
import { FinancialYear } from '../../../models/financialYear.model';
import { ReferenceFieldModalComponent } from './reference-field-modal/reference-field-modal.component';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-reference-field',
  templateUrl: './reference-field.component.html',
  styleUrls: ['./reference-field.component.css'],
  imports: [CommonModule, ...MATERIAL_STANDALONE_IMPORTS, FormsModule]
})
export class ReferenceFieldComponent implements OnInit {
  @Input() fetchData!: () => Promise<{ data: FinancialYear[]; schema: { field: keyof FinancialYear; label: string }[] }>;
  @Input() labelField: string = '';  // The field to use for the label
  @Input() schema: { field: keyof FinancialYear; label: string }[] = [];
  @Input() selectedItem: FinancialYear | null = null;  // Input for selected item

  @Output() selectedItemChange = new EventEmitter<FinancialYear | null>();  // Output event emitter

  data: FinancialYear[] = [];

  constructor(private dialog: MatDialog) { }
  ngOnInit(): void {
    if (!this.fetchData) {
      console.error('fetchData function is not provided');
      return;
    }

    // Fetch the financial years data on component initialization
    this.fetchData().then((response) => {
      this.data = response.data;
      this.schema = response.schema;  // Assuming the schema is being passed correctly from parent
    }).catch((error) => {
      console.error('Error fetching financial years:', error);
    });
  }

  // Method to handle opening the modal with the data
  openModal(): void {
    if (!this.fetchData) return;

    this.fetchData().then((response) => {
      const dialogRef = this.dialog.open(ReferenceFieldModalComponent, {
        width: '800px',
        data: { data: response.data, schema: response.schema }
      });

      dialogRef.afterClosed().subscribe((result: FinancialYear | null) => {
        if (result) {
          this.selectedItem = result;
          this.selectedItemChange.emit(this.selectedItem);
        }
      });
    });
  }
}
