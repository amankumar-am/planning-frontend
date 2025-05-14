// src/app/components/common/stepper/stepper.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { form1Config, form2Config, } from '../../forms-config';
import { GenericFormComponent } from '../generic-form/generic-form.component';
import { createFormGroups } from '../generic-form/form-groups';
import { form3Config } from '../../forms-config/form3.config';
import { form4Config } from '../../forms-config/form4.config';
import { form5Config } from '../../forms-config/form5.config';
import { form6Config } from '../../forms-config/form6.config';
import { form7Config } from '../../forms-config/form7.config';
import { form8Config } from '../../forms-config/form8.config';
import { form9Config } from '../../forms-config/form9.config';

interface StepConfig {
  label: string;
  formConfig: { columns: { fields: any[] }[] };
}

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  standalone: true,
  imports: [
    MatStepperModule,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule,
    GenericFormComponent
  ],
})
export class StepperComponent implements OnInit {
  isLinear = false;
  formGroups: FormGroup[] = [];
  steps: StepConfig[] = [
    { label: 'Demand', formConfig: form1Config },
    { label: 'Primary Sanction', formConfig: form2Config },
    { label: 'Technical Sanction', formConfig: form3Config },
    { label: 'Administrative Sanction', formConfig: form4Config },
    { label: 'Grant', formConfig: form5Config },
    { label: 'Work Order', formConfig: form6Config },
    { label: 'Inspection', formConfig: form7Config },
    { label: 'Full Payment', formConfig: form8Config },
    { label: 'UTC', formConfig: form9Config },
    // Add Form10 if needed
    // { label: 'Form 10', formConfig: form10Config },
  ];

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.formGroups = createFormGroups(this._formBuilder, this.steps);
  }
}