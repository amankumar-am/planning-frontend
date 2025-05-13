// src/app/components/forms/form1/form1.component.ts

import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ValidationMessageDirective } from '../../../directives/validation/validation-message.directive';


@Component({
  selector: 'app-form1',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ...MATERIAL_STANDALONE_IMPORTS,
    CommonModule,
    ReferenceFieldModule,
    FormsModule,
    ValidationMessageDirective
  ],
  templateUrl: './form1.component.html',
  styleUrls: ['./form1.component.scss']
})
export class Form1Component implements OnInit, AfterViewInit {
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
    this.fyUtils.loadItems();
    this.bgUtils.loadItems();
    this.fundUtils.loadItems();
    this.sectorUtils.loadItems();
    this.subsectorUtils.loadItems();
    this.districtUtils.loadItems();
    this.talukaUtils.loadItems();
    this.gpVillageUtils.loadItems();

    this.step1Group.get('demand_isTrust')?.valueChanges.subscribe((isTrust: boolean) => {
      this.toggleTrustValidators(isTrust);
    });

    this.step1Group.get('demand_beneficiaryAreaType')?.valueChanges.subscribe((areaType: string) => {
      this.toggleBeneficiaryValidators(areaType);
    });

    this.toggleTrustValidators(this.step1Group.get('demand_isTrust')?.value);
    this.toggleBeneficiaryValidators(this.step1Group.get('demand_beneficiaryAreaType')?.value);
  }

  ngAfterViewInit(): void {
    const talukaControl = this.step1Group.get('demand_beneficiaryTaluka');
    if (talukaControl) {
      talukaControl.valueChanges.subscribe((taluka: any) => {
        const talukaId = taluka?.id;
        if (talukaId) {
          this.gpVillageUtils.setTalukaId(talukaId);
          this.gpVillageUtils.loadItems();
        }
      });
    }

    const districtControl = this.step1Group.get('demand_beneficiaryDistrict');
    if (districtControl) {
      districtControl.valueChanges.subscribe((district: any) => {
        const districtId = district?.id;
        if (districtId) {
          this.talukaUtils.setDistrictId(districtId);
          this.talukaUtils.loadItems();
        }
      });
    }

    const sectorControl = this.step1Group.get('demand_sector');
    if (sectorControl) {
      sectorControl.valueChanges.subscribe((sector: any) => {
        const sectorId = sector?.id;
        if (sectorId) {
          this.subsectorUtils.setSectorId(sectorId);
          this.subsectorUtils.loadItems();
        }
      });
    }
  }

  goNext(): void {
    if (this.step1Group.valid) {
      this.stepper.next();
    }
  }

  private toggleTrustValidators(enable: boolean): void {
    const controlsToToggle = [
      'demand_trustName',
      'demand_trustAddress',
      'demand_trustRegistrationNumber',
      'demand_trustRegistrationDate'
    ];

    controlsToToggle.forEach(controlName => {
      const control = this.step1Group.get(controlName);
      if (control) {
        if (enable) {
          control.setValidators([Validators.required]);
        } else {
          control.clearValidators();
        }
        control.updateValueAndValidity();
      }
    });
  }

  private toggleBeneficiaryValidators(areaType: string): void {
    const villageControl = this.step1Group.get('demand_beneficiaryVillage');
    const nagarpalikaControl = this.step1Group.get('demand_beneficiaryNagarpalika');

    if (areaType === 'village') {
      villageControl?.setValidators([Validators.required]);
      nagarpalikaControl?.clearValidators();
    } else if (areaType === 'urban') {
      nagarpalikaControl?.setValidators([Validators.required]);
      villageControl?.clearValidators();
    } else {
      villageControl?.clearValidators();
      nagarpalikaControl?.clearValidators();
    }

    villageControl?.updateValueAndValidity();
    nagarpalikaControl?.updateValueAndValidity();
  }
}