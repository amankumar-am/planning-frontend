// src/app/components/shared/reference-field/reference-field.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, forwardRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MATERIAL_STANDALONE_IMPORTS } from '../../materialConfig/material.module';
import { ReferenceFieldModalComponent } from './reference-field-modal/reference-field-modal.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { HasName } from '../../../services/generic.model';


@Component({
  selector: 'app-reference-field',
  templateUrl: './reference-field.component.html',
  styleUrls: ['./reference-field.component.scss'],
  imports: [CommonModule, ...MATERIAL_STANDALONE_IMPORTS, FormsModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ReferenceFieldComponent),
    multi: true
  }]
})
export class ReferenceFieldComponent<T extends HasName> implements OnInit, ControlValueAccessor {
  @Input() fetchData!: () => Promise<{ data: T[]; schema: { field: keyof T; label: string }[], defaultVisibleColumns: string[] }>;
  @Input() labelField: string = '';
  @Input() schema: { field: keyof T; label: string }[] = [];
  @Input() selectedItem: T | null = null;
  @Input() defaultVisibleColumns: string[] = [];

  @Output() selectedItemChange = new EventEmitter<T | null>();

  data: T[] = [];

  constructor(private dialog: MatDialog) { }
  ngOnInit(): void {
    if (!this.fetchData) {
      console.error('fetchData function is not provided');
      return;
    }

    this.fetchData().then((response) => {
      this.data = response.data;
      this.schema = response.schema;
      this.defaultVisibleColumns = response.defaultVisibleColumns;
    }).catch((error) => {
      console.error('Error fetching data:', error);
    });
  }

  // Method to handle opening the modal with the data
  openModal(): void {
    if (!this.fetchData) return;

    this.fetchData().then((response) => {
      const dialogRef = this.dialog.open(ReferenceFieldModalComponent, {
        width: '95vw',
        height: '90vh',
        maxWidth: '100vw',
        panelClass: 'custom-modal-panel',
        data: {
          data: response.data,
          schema: response.schema,
          defaultVisibleColumns: this.defaultVisibleColumns,
        },
      });

      dialogRef.afterClosed().subscribe((result: T | null) => {
        if (result) {
          this.selectedItem = result;
          this.selectedItemChange.emit(this.selectedItem);

          this.onChange(result);
          this.onTouched();
        }
      });
    });
  }

  getLabel(item: T | null): string {
    if (!item || !this.labelField) return '';
    const key = this.labelField as keyof T;
    const value = item[key];
    return value !== null && value !== undefined ? String(value) : '';
  }

  getName(selectedItem: T | null): string {
    if (!selectedItem) return '';
    return selectedItem?.name as string
  }

  onInputClick(event: MouseEvent): void {
    event.preventDefault(); // prevent focus
    event.stopPropagation(); // prevent triggering touched/dirty
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
    // Optional: handle disabled state if needed
  }
}
