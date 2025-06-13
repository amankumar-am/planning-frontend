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
  @Input() fetchData?: (options?: any) => Promise<{ data: T[]; schema: { field: keyof T; label: string }[], defaultVisibleColumns: string[] }>;
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
          // Reset cache when parent changes - data will be reloaded with new dependency filter
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

  // Build query options for backend API call
  private buildQueryOptions(): any {
    const options: any = {};

    // Add existing filters as object (not array)
    if (this.filters && Object.keys(this.filters).length > 0) {
      options.filters = { ...this.filters };
      console.debug(`[${this.labelField}] Applied filters:`, options.filters);
    }

    // Add dependency filter
    if (this.dependsOn && this.formGroup) {
      const parentControl = this.formGroup.get(this.dependsOn);
      if (parentControl?.value) {
        // Extract the ID value if it's an object
        const parentValue = typeof parentControl.value === 'object' ? parentControl.value?.id : parentControl.value;
        if (parentValue) {
          options.dependsOn = {
            field: this.dependsOn,
            value: parentValue
          };
          console.debug(`[${this.labelField}] Applied dependency filter:`, options.dependsOn);
        }
      }
    }

    // Add sorting
    if (this.sortBy) {
      options.sortBy = this.sortBy;
      options.sortOrder = this.sortOrder;
      console.debug(`[${this.labelField}] Applied sorting:`, { sortBy: options.sortBy, sortOrder: options.sortOrder });
    }

    console.debug(`[${this.labelField}] Final query options:`, options);
    return options;
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

    // Build query options for backend filtering/sorting
    const queryOptions = this.buildQueryOptions();

    this.fetchData(queryOptions).then((response) => {
      if (!response || !response.data || !response.schema || !response.defaultVisibleColumns) {
        console.error(`Invalid response for ${this.labelField}:`, response);
        this.snackBar.open(`Failed to load ${this.labelField}: Invalid data received`, 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        return;
      }

      // Data comes pre-filtered and sorted from backend
      this.data = response.data;
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
      if (foundItem) {
        this.selectedItem = foundItem;
      } else {
        // If data is not loaded yet, store the value and try to load data
        this.selectedItem = null;
        this.loadDataAndSetValue(value);
      }
    } else {
      this.selectedItem = null;
    }
  }

  private async loadDataAndSetValue(value: any): Promise<void> {
    if (!this.fetchData || this.isDataLoaded) {
      return;
    }

    try {
      const queryOptions = this.buildQueryOptions();
      const response = await this.fetchData(queryOptions);

      if (response?.data) {
        this.data = response.data;
        this.schema = response.schema || [];
        this.defaultVisibleColumns = response.defaultVisibleColumns || [];
        this.isDataLoaded = true;

        // Now try to find the item again
        const foundItem = this.data.find(item => this.getFieldValue(item, this.valueField) === value);
        if (foundItem) {
          this.selectedItem = foundItem;
        }
      }
    } catch (error) {
      console.error(`Failed to load data for ${this.labelField}:`, error);
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


}