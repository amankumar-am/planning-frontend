// src/app/components/shared/reference-field/reference-field.component.ts

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, forwardRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MATERIAL_STANDALONE_IMPORTS } from '../../materialConfig/material.module';
import { ReferenceFieldModalComponent } from './reference-field-modal/reference-field-modal.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule, Validator, NG_VALIDATORS, ValidationErrors, AbstractControl, FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { HasName } from '../../../services/generic.model';

@Component({
  selector: 'app-reference-field',
  standalone: true,
  templateUrl: './reference-field.component.html',
  styleUrls: ['./reference-field.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ...MATERIAL_STANDALONE_IMPORTS],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ReferenceFieldComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ReferenceFieldComponent),
      multi: true
    }
  ],
})
export class ReferenceFieldComponent<T extends HasName> implements OnInit, ControlValueAccessor, Validator {
  @Input() fetchData?: () => Promise<{ data: T[]; schema: { field: keyof T; label: string }[], defaultVisibleColumns: string[] }>;
  @Input() labelField: string = '';
  @Input() displayField: string | string[] = 'name'; // Field(s) to display in the input - can be single field or array for concatenation
  @Input() displayFieldSeparator: string = ' '; // Separator for concatenated fields (default: space)
  @Input() valueField: string = 'id'; // Field to use as the value (defaulted to 'id')
  @Input() dependsOn: string = ''; // Field that this reference depends on
  @Input() schema: { field: keyof T; label: string }[] = [];
  @Input() selectedItem: T | null = null;
  @Input() defaultVisibleColumns: string[] = [];
  @Input() field: any; // Add the field input (you can refine the type based on your FormConfig interface)
  @Input() required: boolean = false;
  @Input() formControlName: string = '';
  @Input() formGroup: FormGroup | null = null;
  @Input() controlName: string = '';

  // New filtering and sorting inputs
  @Input() filters: { [key: string]: any } = {}; // Filter criteria: { field: value }
  @Input() sortBy: string = ''; // Field to sort by
  @Input() sortOrder: 'asc' | 'desc' = 'asc'; // Sort order

  @Output() selectedItemChange = new EventEmitter<T | null>();

  data: T[] = [];
  isDataLoaded: boolean = false;
  isRequired: boolean = false;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (!this.fetchData) {
      console.error(`fetchData function is not provided for ${this.labelField}`);
    }
    // Set required state based on field configuration
    this.isRequired = this.field?.required ?? this.required;

    // Listen for changes in the parent field if dependsOn is specified
    if (this.dependsOn && this.formGroup) {
      const parentControl = this.formGroup.get(this.dependsOn);
      if (parentControl) {
        parentControl.valueChanges.subscribe((value) => {
          // Reset cache when parent changes
          this.resetDataCache();
          // Clear current selection
          this.selectedItem = null;
          // Clear form value
          if (this.formGroup && this.controlName) {
            this.formGroup.get(this.controlName)?.setValue(null);
          }
        });
      }
    }
  }

  // Method to reset the data cache - called when dependencies change
  resetDataCache(): void {
    this.isDataLoaded = false;
    this.data = [];
    this.schema = [];
    this.defaultVisibleColumns = [];
  }

  openModal(): void {
    if (!this.fetchData || typeof this.fetchData !== 'function') {
      console.error(`No valid fetchData function provided for ${this.labelField}`);
      this.snackBar.open(`Failed to load ${this.labelField}: No data source provided`, 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    console.debug(`Opening modal for ${this.labelField}`);

    if (this.isDataLoaded) {
      this.openDialog();
      return;
    }

    this.fetchData().then((response) => {
      if (!response || !response.data || !response.schema || !response.defaultVisibleColumns) {
        console.error(`Invalid response for ${this.labelField}:`, response);
        this.snackBar.open(`Failed to load ${this.labelField}: Invalid data received`, 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        return;
      }

      // Apply filtering and sorting to the data
      let processedData = response.data;

      // Apply filters
      processedData = this.applyFilters(processedData);

      // Apply sorting
      processedData = this.applySorting(processedData);

      this.data = processedData;
      this.schema = response.schema;
      this.defaultVisibleColumns = response.defaultVisibleColumns;
      this.isDataLoaded = true;
      this.openDialog();
    }).catch((error) => {
      console.error(`Failed to load items for ${this.labelField}:`, error);
      this.snackBar.open(`Failed to load ${this.labelField}: ${error.message || 'Unknown error'}`, 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    });
  }

  private openDialog(): void {
    const dialogRef = this.dialog.open(ReferenceFieldModalComponent, {
      width: '95vw',
      height: '98vh',
      maxWidth: '100vw',
      panelClass: 'custom-modal-panel',
      data: {
        data: this.data,
        schema: this.schema,
        defaultVisibleColumns: this.defaultVisibleColumns,
      },
    });

    dialogRef.afterClosed().subscribe((result: T | null) => {
      if (result !== undefined) {
        this.selectedItem = result;
        this.selectedItemChange.emit(result);
        // Use the valueField to determine what value to submit
        const valueToSubmit = result ? this.getFieldValue(result, this.valueField) : null;
        this.onChange(valueToSubmit);
        this.onTouched();
        // Ensure the form control value is updated with the value field
        if (this.formGroup && this.controlName) {
          this.formGroup.get(this.controlName)?.setValue(valueToSubmit);
        }
      }
    });
  }

  // Get the display value using the displayField
  getDisplayValue(item: T | null): string {
    if (!item) return '';
    if (Array.isArray(this.displayField)) {
      // Filter out empty/null/undefined values before joining
      const values = this.displayField
        .map(field => this.getFieldValue(item, field) as string)
        .filter(value => value !== null && value !== undefined && value !== '');
      return values.join(this.displayFieldSeparator);
    } else {
      return this.getFieldValue(item, this.displayField as string) as string || '';
    }
  }

  // Helper method to get field value from an object
  private getFieldValue(item: T, fieldName: string): any {
    // Handle nested field access with dot notation (e.g., 'user.name')
    if (fieldName.includes('.')) {
      return fieldName.split('.').reduce((obj, key) => obj?.[key as keyof typeof obj], item as any);
    }
    return (item as any)[fieldName];
  }

  // Keep the old getName method for backward compatibility
  getName(item: T | null): string {
    return this.getDisplayValue(item);
  }

  onInputClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.openModal();
  }

  blurInput(event: FocusEvent): void {
    (event.target as HTMLInputElement).blur();
  }

  // ControlValueAccessor methods
  onChange: (value: any) => void = () => { };
  onTouched: () => void = () => { };

  writeValue(value: any): void {
    // If value is provided, we need to find the corresponding item
    // This might be the full object or just the value field
    if (value && typeof value === 'object') {
      this.selectedItem = value as T;
    } else if (value) {
      // Try to find the item by the value field
      const foundItem = this.data.find(item => this.getFieldValue(item, this.valueField) === value);
      this.selectedItem = foundItem || null;
    } else {
      this.selectedItem = null;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Handle disabled state if needed
  }

  // Validator methods
  validate(control: AbstractControl): ValidationErrors | null {
    if (this.isRequired && !this.selectedItem) {
      return { required: true };
    }
    return null;
  }

  get control(): FormControl {
    return (this.formGroup?.get(this.controlName) as FormControl) || new FormControl();
  }

  // Apply filters to the data
  private applyFilters(data: T[]): T[] {
    if (!this.filters || Object.keys(this.filters).length === 0) {
      return data;
    }

    return data.filter(item => {
      return Object.entries(this.filters).every(([field, filterValue]) => {
        if (filterValue === null || filterValue === undefined || filterValue === '') {
          return true; // Skip empty filters
        }

        const itemValue = this.getFieldValue(item, field);

        // Handle different filter types
        if (typeof filterValue === 'string') {
          // Case-insensitive string matching
          return String(itemValue).toLowerCase().includes(filterValue.toLowerCase());
        } else if (typeof filterValue === 'boolean') {
          return itemValue === filterValue;
        } else if (typeof filterValue === 'number') {
          return itemValue === filterValue;
        } else if (Array.isArray(filterValue)) {
          // Array filter - check if item value is in the array
          return filterValue.includes(itemValue);
        } else {
          // Exact match for other types
          return itemValue === filterValue;
        }
      });
    });
  }

  // Apply sorting to the data
  private applySorting(data: T[]): T[] {
    if (!this.sortBy) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = this.getFieldValue(a, this.sortBy);
      const bValue = this.getFieldValue(b, this.sortBy);

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return this.sortOrder === 'asc' ? 1 : -1;
      if (bValue == null) return this.sortOrder === 'asc' ? -1 : 1;

      // Convert to strings for comparison if needed
      const aStr = String(aValue);
      const bStr = String(bValue);

      let comparison = 0;
      if (aStr < bStr) {
        comparison = -1;
      } else if (aStr > bStr) {
        comparison = 1;
      }

      return this.sortOrder === 'desc' ? -comparison : comparison;
    });
  }
}