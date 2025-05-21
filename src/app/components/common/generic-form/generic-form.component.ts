// src/app/components/common/generic-form/generic-form.component.ts

import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { CommonModule } from '@angular/common';
import { ReferenceFieldModule } from '../../shared/reference-field/reference-field.module';
import { ValidationMessageDirective } from '../../../directives/validation/validation-message.directive';
import { FinancialYearUtilsService } from '../../../services/utils/financial-year-utils.service';
import { BeneficiaryGroupUtilsService } from '../../../services/utils/beneficiary-group-utils.service';
import { FundUtilsService } from '../../../services/utils/fund-utils.service';
import { SectorUtilsService } from '../../../services/utils/sector-utils.service';
import { SubsectorUtilsService } from '../../../services/utils/subsector-utils.service';
import { DistrictUtilsService } from '../../../services/utils/district-utils.service';
import { TalukaUtilsService } from '../../../services/utils/taluka-utils.service';
import { GpVillageUtilsService } from '../../../services/utils/gp-village-utils.service';
import { MATERIAL_STANDALONE_IMPORTS } from '../../materialConfig/material.module';
import { ReferenceFieldComponent } from '../../shared/reference-field/reference-field.component';


@Component({
  selector: 'app-generic-form',
  standalone: true,
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ...MATERIAL_STANDALONE_IMPORTS,
    ReferenceFieldModule,
    ReferenceFieldComponent,
  ],
})
export class GenericFormComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() formConfig!: any;
  @Input() stepper!: MatStepper;
  @Input() stepIndex!: number;

  columns: any[] = [];
  datePickers: { [key: string]: any } = {};
  currentField: any = null;

  constructor(
    public fyUtils: FinancialYearUtilsService,
    public bgUtils: BeneficiaryGroupUtilsService,
    public fundUtils: FundUtilsService,
    public sectorUtils: SectorUtilsService,
    public subsectorUtils: SubsectorUtilsService,
    public districtUtils: DistrictUtilsService,
    public talukaUtils: TalukaUtilsService,
    public gpVillageUtils: GpVillageUtilsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (!this.formGroup) {
      console.error('FormGroup is not provided for step', this.stepIndex);
      return;
    }
    this.columns = this.formConfig?.columns ?? [];

    this.setupConditionalValidators();
    this.setupDynamicOptions();
  }

  back() {
    this.stepper.previous();
  }

  next() {
    if (this.formGroup?.valid) {
      this.stepper.next();
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  reset() {
    this.formGroup.reset();
  }

  registerDatePicker(fieldName: string, datePickerRef: any): boolean {
    this.datePickers[fieldName] = datePickerRef;
    return true;
  }

  getFormControl(name: string): FormControl {
    const control = this.formGroup.get(name);
    if (!control) {
      throw new Error(`Form control '${name}' not found in form group`);
    }
    return control as FormControl;
  }

  shouldShowField(field: any): boolean {
    if (!field.conditional || !this.formGroup) return true;

    const [controlName, expectedValue] = field.conditional.split(':');
    const control = this.formGroup.get(controlName);
    if (!control) return false;

    const normalizedExpectedValue = expectedValue === 'true' ? true :
      expectedValue === 'false' ? false :
        expectedValue;

    // Handle boolean values properly
    if (typeof control.value === 'boolean') {
      return control.value === normalizedExpectedValue;
    }

    // Handle string values
    const normalizedControlValue = typeof control.value === 'string'
      ? control.value.toLowerCase()
      : control.value;

    return normalizedControlValue === normalizedExpectedValue;
  }

  getService(optionsKey: string): any {
    const serviceMap: Record<string, any> = {
      financialYears: this.fyUtils,
      funds: this.fundUtils,
      sectors: this.sectorUtils,
      subSectors: this.subsectorUtils,
      districts: this.districtUtils,
      talukas: this.talukaUtils,
      villages: this.gpVillageUtils,
      beneficiaryGroups: this.bgUtils,
    };

    const service = serviceMap[optionsKey];
    if (!service) {
      console.error(`No service found for optionsKey: ${optionsKey}`);
      return { loadItems: () => Promise.reject(`Service not found for ${optionsKey}`) };
    }

    const fetchMethod = service.getDataFetcher || service.loadItems || service.fetchAllItems;
    if (!fetchMethod) {
      console.error(`No fetch method found for service: ${optionsKey}`);
      return { loadItems: () => Promise.reject(`No fetch method for ${optionsKey}`) };
    }

    return {
      loadItems: async () => {
        try {
          const response = await fetchMethod.call(service)();
          if (!response?.data || !response?.schema || !response?.defaultVisibleColumns) {
            throw new Error(`Invalid response from ${optionsKey}`);
          }
          return response;
        } catch (error) {
          console.error(`Error loading items for ${optionsKey}`, error);
          throw error;
        }
      },
    };
  }

  private setupConditionalValidators() {
    if (this.stepIndex !== 0) return;

    const trustControl = this.formGroup.get('demand_isTrust');
    if (trustControl) {
      // Initial setup
      this.updateTrustFieldsValidation(trustControl.value);

      // Subscribe to changes
      trustControl.valueChanges.subscribe((isTrust: boolean) => {
        this.updateTrustFieldsValidation(isTrust);
        this.cdr.detectChanges();
      });
    }

    const areaTypeControl = this.formGroup.get('demand_beneficiaryAreaType');
    areaTypeControl?.valueChanges.subscribe((areaType: string) => {
      const villageControl = this.formGroup.get('demand_beneficiaryVillage');
      const nagarpalikaControl = this.formGroup.get('demand_beneficiaryNagarpalika');
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
      this.cdr.detectChanges();
    });
  }

  private updateTrustFieldsValidation(isTrust: boolean) {
    const trustFields = [
      'demand_trustName',
      'demand_trustAddress',
      'demand_trustRegistrationNumber',
      'demand_trustRegistrationDate',
    ];

    trustFields.forEach((field) => {
      const control = this.formGroup.get(field);
      if (control) {
        if (isTrust) {
          control.setValidators([Validators.required]);
          control.enable();
        } else {
          control.clearValidators();
          control.disable();
          control.setValue(null);
        }
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  private setupDynamicOptions() {
    if (this.stepIndex !== 0) return;

    this.formGroup.get('demand_beneficiaryDistrict')?.valueChanges.subscribe((district: any) => {
      const districtId = district?.id;
      if (districtId) {
        this.talukaUtils.setDistrictId(districtId);
        this.talukaUtils.getDataFetcher()?.().catch((err) => console.error('Failed to load talukas:', err));
      }
      this.cdr.detectChanges();
    });

    this.formGroup.get('demand_beneficiaryTaluka')?.valueChanges.subscribe((taluka: any) => {
      const talukaId = taluka?.id;
      if (talukaId) {
        this.gpVillageUtils.setTalukaId(talukaId);
        this.gpVillageUtils.getDataFetcher()?.().catch((err) => console.error('Failed to load villages:', err));
      }
      this.cdr.detectChanges();
    });

    this.formGroup.get('demand_sector')?.valueChanges.subscribe((sector: any) => {
      const sectorId = sector?.id;
      if (sectorId) {
        this.subsectorUtils.setSectorId(sectorId);
        this.subsectorUtils.getDataFetcher()?.().catch((err) => console.error('Failed to load subsectors:', err));
      }
      this.cdr.detectChanges();
    });
  }

  getControl(fieldName: string): FormControl | null {
    return this.formGroup.get(fieldName) as FormControl;
  }

  getFieldLabel(fieldName: string): string {
    const field = this.findFieldByName(fieldName);
    return field?.label || fieldName;
  }

  private findFieldByName(fieldName: string): any {
    for (const column of this.columns) {
      const field = column.fields.find((f: any) => f.name === fieldName);
      if (field) return field;
    }
    return null;
  }
}
