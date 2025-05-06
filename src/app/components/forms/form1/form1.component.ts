import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { CommonModule } from '@angular/common';
import { MATERIAL_STANDALONE_IMPORTS } from '../../materialConfig/material.module';
import { ReferenceFieldModule } from '../../shared/reference-field/reference-field.module';
import { FinancialYearUtilsService } from '../../../services/financialYear/financial-year-utils.service';
import { BeneficiaryGroupUtilsService } from '../../../services/beneficiaryGroup/beneficiary-group-utils.service';

@Component({
  selector: 'app-form1',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ...MATERIAL_STANDALONE_IMPORTS,
    CommonModule,
    ReferenceFieldModule,
    FormsModule
  ],
  templateUrl: './form1.component.html',
  styleUrl: './form1.component.css'
})
export class Form1Component implements OnInit {

  @Input() step1Group!: FormGroup;
  @Input() stepper!: MatStepper;

  constructor(public fyUtils: FinancialYearUtilsService, public bgUtils: BeneficiaryGroupUtilsService) { }

  ngOnInit(): void {
    this.fyUtils.loadItems()
  }

  goNext(): void {
    if (this.step1Group.valid) {
      this.stepper.next();
    }
  }

  get financialYearControl(): FormControl {
    return this.step1Group.get('demand_financialYear') as FormControl;
  }
}
