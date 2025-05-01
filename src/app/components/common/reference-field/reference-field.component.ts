// src/app/components/reference-field/reference-field.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReferenceSelectorDialogComponent } from '../reference-selector-dialog/reference-selector-dialog.component';
import { MATERIAL_STANDALONE_IMPORTS } from '../../materialConfig/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reference-field',
  templateUrl: './reference-field.component.html',
  styleUrls: ['./reference-field.component.css'],
  imports: [...MATERIAL_STANDALONE_IMPORTS, FormsModule, ReactiveFormsModule, CommonModule]
})
export class ReferenceFieldComponent {
  private _control: FormControl = new FormControl();

  @Input()
  set control(ctrl: FormControl | null) {
    this._control = ctrl || new FormControl();
  }
  get control(): FormControl {
    return this._control;
  }

  // @Input() control: FormControl | null = null;
  @Input() label: string = "";
  @Input() required: boolean = false;
  @Input() referenceData: any[] = [];
  @Input() displayField: string = 'name';
  @Input() valueField: string = 'id';
  @Output() selected = new EventEmitter<any>();

  constructor(public dialog: MatDialog) { }

  openSelector(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const dialogRef = this.dialog.open(ReferenceSelectorDialogComponent, {
      width: '800px',
      data: {
        referenceData: this.referenceData,
        displayField: this.displayField,
        valueField: this.valueField,
        currentValue: this.control?.value,
        label: this.label
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.control?.setValue(result);
        this.selected.emit(result);
      }
    });
  }

  getDisplayValue(): string {
    if (!this.control?.value) return '';
    const item = this.referenceData.find(x => x[this.valueField] === this.control?.value);
    return item ? item[this.displayField] : '';
  }
}