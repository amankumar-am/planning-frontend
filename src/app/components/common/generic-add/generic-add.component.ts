// src/app/components/common/generic-add/generic-add.component.ts

import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MENU_CONFIG, MenuItem } from '../../../config/menu.config';
// import { ReferenceFieldComponent } from '../reference-field/reference-field.component';

@Component({
    selector: 'app-generic-add',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatIconModule,
        // ReferenceFieldComponent
    ],
    template: `
    <div class="add-form-container">
      <div class="form-header">
        <h2>Add {{ menuItem?.label }}</h2>
      </div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form-content">
          <ng-container *ngFor="let column of menuItem?.columns">
            <ng-container [ngSwitch]="column.type">
              <!-- Text Input -->
              <mat-form-field *ngSwitchCase="'text'" appearance="outline">
                <mat-label>{{ column.label }}</mat-label>
                <input matInput [formControlName]="column.field" [placeholder]="column.label">
              </mat-form-field>

              <!-- Number Input -->
              <mat-form-field *ngSwitchCase="'number'" appearance="outline">
                <mat-label>{{ column.label }}</mat-label>
                <input matInput type="number" [formControlName]="column.field" [placeholder]="column.label">
              </mat-form-field>

              <!-- Date Input -->
              <mat-form-field *ngSwitchCase="'date'" appearance="outline">
                <mat-label>{{ column.label }}</mat-label>
                <input matInput [matDatepicker]="picker" [formControlName]="column.field">
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>

              <!-- Boolean Input -->
              <mat-checkbox *ngSwitchCase="'boolean'" [formControlName]="column.field">
                {{ column.label }}
              </mat-checkbox>

              <!-- Reference Input -->
              <app-reference-field
                *ngSwitchCase="'reference'"
                [label]="column.label"
                [formControlName]="column.field"
                [referenceType]="column.referenceType"
              ></app-reference-field>
            </ng-container>
          </ng-container>
        </div>
        <div class="form-actions">
          <button mat-button type="button" (click)="onCancel()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!form.valid">
            Save
          </button>
        </div>
      </form>
    </div>
  `,
    styles: [`
    .add-form-container {
      padding: 24px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .form-header {
      margin-bottom: 24px;
    }

    .form-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    mat-form-field {
      width: 100%;
    }
  `]
})
export class GenericAddComponent implements OnInit {
    @Input() menuItemId!: string;
    menuItem?: MenuItem;
    form!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.menuItem = this.findMenuItem(this.menuItemId);
        if (this.menuItem) {
            this.initForm();
        }
    }

    private findMenuItem(id: string): MenuItem | undefined {
        const findInItems = (items: MenuItem[]): MenuItem | undefined => {
            for (const item of items) {
                if (item.id === id) return item;
                if (item.children) {
                    const found = findInItems(item.children);
                    if (found) return found;
                }
            }
            return undefined;
        };
        return findInItems(MENU_CONFIG);
    }

    private initForm() {
        const group: { [key: string]: any } = {};
        this.menuItem?.columns?.forEach(column => {
            const validators = [];
            if (column.type !== 'boolean') {
                validators.push(Validators.required);
            }
            group[column.field] = ['', validators];
        });
        this.form = this.fb.group(group);
    }

    onSubmit() {
        if (this.form.valid) {
            // TODO: Implement save logic
            console.log(this.form.value);
            this.router.navigate([this.menuItem?.viewRoute]);
        }
    }

    onCancel() {
        this.router.navigate([this.menuItem?.viewRoute]);
    }
} 