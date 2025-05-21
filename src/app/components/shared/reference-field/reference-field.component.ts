// src/app/components/shared/reference-field/reference-field.component.ts

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, forwardRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MATERIAL_STANDALONE_IMPORTS } from '../../materialConfig/material.module';
import { ReferenceFieldModalComponent } from './reference-field-modal/reference-field-modal.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule, Validator, NG_VALIDATORS, ValidationErrors, AbstractControl, FormGroup } from '@angular/forms';
import { HasName } from '../../../services/generic.model';

@Component({
  selector: 'app-reference-field',
  standalone: true,
  templateUrl: './reference-field.component.html',
  styleUrls: ['./reference-field.component.scss'],
  imports: [CommonModule, FormsModule, ...MATERIAL_STANDALONE_IMPORTS],
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
  @Input() schema: { field: keyof T; label: string }[] = [];
  @Input() selectedItem: T | null = null;
  @Input() defaultVisibleColumns: string[] = [];
  @Input() field: any; // Add the field input (you can refine the type based on your FormConfig interface)
  @Input() required: boolean = false;
  @Input() formControlName: string = '';
  @Input() formGroup: FormGroup | null = null;

  @Output() selectedItemChange = new EventEmitter<T | null>();

  data: T[] = [];
  isDataLoaded: boolean = false;
  isRequired: boolean = false;
  control: AbstractControl | null = null;

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

    // Get the form control if formGroup and formControlName are provided
    if (this.formGroup && this.formControlName) {
      this.control = this.formGroup.get(this.formControlName);
    }
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
        this.onChange(result);
        this.onTouched();
      }
    });
  }

  getName(item: T | null): string {
    if (!item) return '';
    return item.name as string;
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
  onChange: (value: T | null) => void = () => { };
  onTouched: () => void = () => { };

  writeValue(value: T | null): void {
    this.selectedItem = value;
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
}