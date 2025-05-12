// src/app/components/forms/form1/form1.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { CommonModule } from '@angular/common';
import { MATERIAL_STANDALONE_IMPORTS } from '../../materialConfig/material.module';
import { ReferenceFieldModule } from '../../shared/reference-field/reference-field.module';
import { FinancialYearUtilsService } from '../../../services/financialYear/financial-year-utils.service';
import { BeneficiaryGroupUtilsService } from '../../../services/beneficiaryGroup/beneficiary-group-utils.service';
import { FundUtilsService } from '../../../services/fund/fund-utils.service';
import { SectorUtilsService } from '../../../services/sector/sector-utils.service';
import { SubsectorUtilsService } from '../../../services/subsector/subsector-utils.service';
import { DistrictUtilsService } from '../../../services/district/district-utils.service';
import { TalukaUtilsService } from '../../../services/taluka/taluka-utils.service';
import { GpVillageUtilsService } from '../../../services/gp-village/gp-village-utils.service';

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
  styleUrl: './form1.component.scss'
})
export class Form1Component implements OnInit {

  @Input() step1Group!: FormGroup;
  @Input() stepper!: MatStepper;
  gridCols: number = 2;
  constructor(
    public fyUtils: FinancialYearUtilsService,
    public bgUtils: BeneficiaryGroupUtilsService,
    public fundUtils: FundUtilsService,
    public sectorUtils: SectorUtilsService,
    public subsectorUtils: SubsectorUtilsService,
    public districtUtils: DistrictUtilsService,
    public talukaUtils: TalukaUtilsService,
    public gpVillageUtils: GpVillageUtilsService
  ) { }

  ngOnInit(): void {
    this.fyUtils.loadItems()
    this.bgUtils.loadItems()
    this.fundUtils.loadItems()
    this.sectorUtils.loadItems()
    this.subsectorUtils.loadItems()
    this.districtUtils.loadItems()
    this.talukaUtils.loadItems()
    this.gpVillageUtils.loadItems()
  }

  goNext(): void {
    if (this.step1Group.valid) {
      this.stepper.next();
    }
  }

  get financialYearControl(): FormControl {
    return this.step1Group.get('demand_financialYear') as FormControl;
  }

  get geneficiaryGroupControl(): FormControl {
    return this.step1Group.get('demand_beneficiaryGroup') as FormControl;
  }

  get fundGroupControl(): FormControl {
    return this.step1Group.get('demand_fund') as FormControl;
  }

  get sectorGroupControl(): FormControl {
    return this.step1Group.get('demand_sector') as FormControl;
  }

  get subsectorGroupControl(): FormControl {
    return this.step1Group.get('demand_subsector') as FormControl;
  }

  get districtGroupControl(): FormControl {
    return this.step1Group.get('demand_district') as FormControl;
  }
  get talukaGroupControl(): FormControl {
    return this.step1Group.get('demand_taluka') as FormControl;
  }

  get gpVillageGroupControl(): FormControl {
    return this.step1Group.get('demand_gpVillage') as FormControl;
  }
}
