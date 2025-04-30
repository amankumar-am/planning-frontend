import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { Form1Component } from '../../forms/form1/form1.component';
import { Form2Component } from '../../forms/form2/form2.component';
import { Form3Component } from '../../forms/form3/form3.component';
import { Form4Component } from '../../forms/form4/form4.component';
import { Form5Component } from '../../forms/form5/form5.component';
import { Form6Component } from '../../forms/form6/form6.component';
import { Form7Component } from '../../forms/form7/form7.component';
import { Form8Component } from '../../forms/form8/form8.component';
import { Form9Component } from '../../forms/form9/form9.component';
import { createFormGroups } from '../../forms/form-groups';
/**
 * @title Stepper overview
 */
@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css'],
  imports: [
    MatStepperModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    Form1Component,
    Form2Component,
    Form3Component,
    Form4Component,
    Form5Component,
    Form6Component,
    Form7Component,
    Form8Component,
    Form9Component]
})
export class StepperComponent implements OnInit {
  isLinear = false;
  step1Group: any;
  step2Group: any;
  step3Group: any;
  step4Group: any;
  step5Group: any;
  step6Group: any;
  step7Group: any;
  step8Group: any;
  step9Group: any;

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
    const groups = createFormGroups(this._formBuilder);
    Object.assign(this, groups);

  }
}
