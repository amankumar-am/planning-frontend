// src/app/components/common/generic-form/generic-form.component.ts

import { Component, Input, OnInit, AfterViewInit, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { CommonModule } from '@angular/common';
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
import { Router } from '@angular/router';
import { MENU_CONFIG, MenuItem } from '../../../config/menu.config';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Ps1Service } from '../../../services/ps1/ps1.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserProfileUtilsService } from '../../../services/utils/user-profile-utils.service';
import { OfficerClassUtilsService } from '../../../services/utils/officer-class-utils.service';
import { DepartmentUtilsService } from '../../../services/utils/department-utils.service';
import { EmploymentTypeUtilsService } from '../../../services/utils/employment-type-utils.service';
import { DesignationUtilsService } from '../../../services/utils/designation-utils.service';
import { OfficeUtilsService } from '../../../services/utils/office-utils.service';
import { OfficeLevelUtilsService } from '../../../services/utils/office-level-utils.service';
import { StateUtilsService } from '../../../services/utils/state-utils.service';
import { MpmlaUtilsService } from '../../../services/utils/mpmla-utils.service';
import { PrantUtilsService } from '../../../services/utils/prant-utils.service';
import { AcUtilsService } from '../../../services/utils/ac-utils.service';

@Component({
  selector: 'app-generic-form',
  standalone: true,
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ...MATERIAL_STANDALONE_IMPORTS,
    ReferenceFieldComponent,
    ValidationMessageDirective,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatIconModule,
    MatSnackBarModule,
  ],
})
export class GenericFormComponent implements OnInit, AfterViewInit {
  @Input() formGroup!: FormGroup;
  @Input() formConfig!: any;
  @Input() stepper!: MatStepper;
  @Input() stepIndex!: number;
  @Input() title?: string;
  @Input() menuItemId?: string;
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() isLastStep: boolean = false;
  @Input() allFormGroups: FormGroup[] = [];

  columns: any[] = [];
  datePickers: { [key: string]: any } = {};
  currentField: any = null;
  menuItem?: MenuItem;

  @ViewChildren(ReferenceFieldComponent) referenceFieldComponents!: QueryList<ReferenceFieldComponent<any>>;

  constructor(
    public fyUtils: FinancialYearUtilsService,
    public bgUtils: BeneficiaryGroupUtilsService,
    public fundUtils: FundUtilsService,
    public sectorUtils: SectorUtilsService,
    public subsectorUtils: SubsectorUtilsService,
    public districtUtils: DistrictUtilsService,
    public talukaUtils: TalukaUtilsService,
    public gpVillageUtils: GpVillageUtilsService,
    public acUtils: AcUtilsService,
    public userProfileUtils: UserProfileUtilsService,
    public officerClassUtils: OfficerClassUtilsService,
    public departmentUtils: DepartmentUtilsService,
    public employmentTypeUtils: EmploymentTypeUtilsService,
    public designationUtils: DesignationUtilsService,
    public officeUtils: OfficeUtilsService,
    public officeLevelUtils: OfficeLevelUtilsService,
    public stateUtils: StateUtilsService,
    public mpmlaUtils: MpmlaUtilsService,
    public prantUtils: PrantUtilsService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private ps1Service: Ps1Service,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    if (!this.formGroup) {
      console.error('FormGroup is not provided for step', this.stepIndex);
      return;
    }
    this.columns = this.formConfig?.columns ?? [];

    this.setupConditionalValidators();

    if (this.menuItemId) {
      this.menuItem = this.findMenuItem(this.menuItemId);
      if (this.menuItem && !this.formGroup) {
        this.initForm();
      }
    }
  }

  ngAfterViewInit() {
    // Setup dynamic options after ViewChildren are available
    this.setupDynamicOptions();
    // Set default values for reference fields
    this.setReferenceFieldDefaults();
  }

  next() {
    if (this.formGroup?.valid) {
      this.submitAllForms();
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  submitAllForms() {
    // Submit only current form data
    console.log('=== FORM SUBMISSION DEBUG ===');
    console.log(`Submitting step ${this.stepIndex + 1} data`);
    console.log('Current form data:', this.formGroup.value);

    const currentStepData = this.formGroup.value;
    console.log('Data to be saved:', currentStepData);
    console.log('=== END DEBUG ===');

    // For now, only submit if it's step 1 (Demand)
    if (this.stepIndex === 0) {
      this.submitDemandData(currentStepData);
    } else {
      this.snackBar.open(`Step ${this.stepIndex + 1} submission not implemented yet.`, 'Close', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  private submitDemandData(demandData: any) {
    // Transform demand data for API
    const transformedData = {
      ...demandData,
      stage: 1, // Demand stage
      isActive: true,
      createdAt: new Date().toISOString()
    };

    console.log('Submitting to demand_stage:', transformedData);

    // Using PS1 service for now - you can create a DemandService later
    this.ps1Service.createPs1(transformedData).subscribe({
      next: (result) => {
        this.snackBar.open('Demand data saved successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        console.log('Demand data saved:', result);
      },
      error: (error) => {
        console.error('Error saving demand data:', error);
        this.snackBar.open('Error saving demand data. Please try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  private combineAllFormData(): any {
    const combinedData: any = {};

    this.allFormGroups.forEach((formGroup, index) => {
      const formData = formGroup.value;
      Object.keys(formData).forEach(key => {
        combinedData[key] = formData[key];
      });
    });

    return combinedData;
  }

  private transformDataForAPI(combinedData: any): any {
    // Transform the data to match PS1 model structure
    return {
      id: 0, // Will be generated by backend
      financialYear: combinedData.demand_financialYear || null,
      fund: combinedData.demand_fund || null,
      taluka: combinedData.demand_beneficiaryTaluka || null,
      sector: combinedData.demand_sector || null,
      stage: this.determineStage(), // Determine based on completed steps
      isActive: true
    };
  }

  private determineStage(): number {
    // Determine the current stage based on which forms are completed
    // Stage numbers: 1-Demand, 2-Primary Sanction, 3-Technical Sanction, etc.
    let completedStages = 0;
    for (let i = 0; i < this.allFormGroups.length; i++) {
      if (this.allFormGroups[i].valid) {
        completedStages = i + 1;
      } else {
        break;
      }
    }
    return Math.max(1, completedStages);
  }

  private markAllFormsAsTouched() {
    this.allFormGroups.forEach(formGroup => {
      formGroup.markAllAsTouched();
    });
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
      ac: this.acUtils,
      financialYears: this.fyUtils,
      funds: this.fundUtils,
      sectors: this.sectorUtils,
      subSectors: this.subsectorUtils,
      districts: this.districtUtils,
      talukas: this.talukaUtils,
      villages: this.gpVillageUtils,
      beneficiaryGroups: this.bgUtils,
      userProfiles: this.userProfileUtils,
      officerClasses: this.officerClassUtils,
      departments: this.departmentUtils,
      employmentTypes: this.employmentTypeUtils,
      designations: this.designationUtils,
      offices: this.officeUtils,
      officeLevels: this.officeLevelUtils,
      states: this.stateUtils,
      mpmlas: this.mpmlaUtils,
      prants: this.prantUtils,
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
      loadItems: async (options?: any) => {
        try {
          const response = await fetchMethod.call(service)(options);
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
    // Remove stepIndex restriction to allow dependencies in all steps
    // if (this.stepIndex !== 0) return;

    this.formGroup.get('demand_beneficiaryDistrict')?.valueChanges.subscribe((district: any) => {
      // Handle both object values (old) and primitive values (new with valueField)
      const districtId = typeof district === 'object' ? district?.id : district;
      if (districtId && districtId > 0) {
        this.talukaUtils.setDistrictId(districtId);
        this.talukaUtils.getDataFetcher()?.().catch((err) => console.error('Failed to load talukas:', err));
      } else {
        this.talukaUtils.setDistrictId(0); // Reset to ensure no data loads
      }
      // Reset the taluka reference field cache
      this.resetReferenceFieldCache('demand_beneficiaryTaluka');
      // Also reset dependent village field
      this.resetReferenceFieldCache('demand_beneficiaryVillage');
      this.cdr.detectChanges();
    });

    this.formGroup.get('demand_beneficiaryTaluka')?.valueChanges.subscribe((taluka: any) => {
      // Handle both object values (old) and primitive values (new with valueField)
      const talukaId = typeof taluka === 'object' ? taluka?.id : taluka;
      if (talukaId && talukaId > 0) {
        this.gpVillageUtils.setTalukaId(talukaId);
        this.gpVillageUtils.getDataFetcher()?.().catch((err) => console.error('Failed to load villages:', err));
      } else {
        this.gpVillageUtils.setTalukaId(0); // Reset to ensure no data loads
      }
      // Reset the village reference field cache
      this.resetReferenceFieldCache('demand_beneficiaryVillage');
      this.cdr.detectChanges();
    });

    this.formGroup.get('demand_sector')?.valueChanges.subscribe((sector: any) => {
      // Handle both object values (old) and primitive values (new with valueField)
      const sectorId = typeof sector === 'object' ? sector?.id : sector;
      if (sectorId && sectorId > 0) {
        this.subsectorUtils.setSectorId(sectorId);
        this.subsectorUtils.getDataFetcher()?.().catch((err) => console.error('Failed to load subsectors:', err));
      } else {
        this.subsectorUtils.setSectorId(0); // Reset to ensure no data loads
      }
      // Reset the subsector reference field cache
      this.resetReferenceFieldCache('demand_subSector');
      this.cdr.detectChanges();
    });
  }

  private resetReferenceFieldCache(fieldName: string): void {
    // Find the reference field component by controlName
    const referenceField = this.referenceFieldComponents?.find(
      comp => comp.controlName === fieldName
    );

    if (referenceField) {
      referenceField.resetDataCache();
      // Clear the selected value in the form
      this.formGroup.get(fieldName)?.setValue(null);
      referenceField.selectedItem = null; // Also clear the selected item
    }
  }

  private async setReferenceFieldDefaults(): Promise<void> {
    // Find all reference fields with default values
    const referenceFieldsWithDefaults = this.columns
      .flatMap(column => column.fields || [])
      .filter(field => field.type === 'reference' && field.defaultValue);

    for (const field of referenceFieldsWithDefaults) {
      try {
        await this.setReferenceFieldDefault(field);
      } catch (error) {
        console.error(`Failed to set default value for ${field.name}:`, error);
      }
    }
  }

  private async setReferenceFieldDefault(field: any): Promise<void> {
    const service = this.getService(field.options);
    if (!service || !service.loadItems) {
      console.error(`No service found for field ${field.name} with options ${field.options}`);
      return;
    }

    try {
      // Load all items from the service
      const response = await service.loadItems();
      const items = response.data || [];

      // Find the item that matches the default value
      let defaultItem = null;
      const defaultValue = field.defaultValue;

      // Check if defaultValue is an object with field/value specification
      if (typeof defaultValue === 'object' && defaultValue !== null && !Array.isArray(defaultValue)) {
        // Object format: { fieldName: value }
        // Example: { nameEn: 'Mehsana' } or { nameGu: 'મહેસાણા' }

        for (const [fieldName, fieldValue] of Object.entries(defaultValue)) {
          const fieldValueStr = String(fieldValue);

          // Try exact match first
          defaultItem = items.find((item: any) =>
            item[fieldName] &&
            item[fieldName].toString().toLowerCase() === fieldValueStr.toLowerCase()
          );

          // If not found, try partial match
          if (!defaultItem) {
            defaultItem = items.find((item: any) =>
              item[fieldName] &&
              item[fieldName].toString().toLowerCase().includes(fieldValueStr.toLowerCase())
            );
          }

          // If found, break out of the loop
          if (defaultItem) {
            console.log(`Found item for ${field.name} using ${fieldName}: "${fieldValueStr}"`);
            break;
          }
        }
      } else {
        // Simple value format (backward compatibility)
        // First try exact match on the value field (usually 'id')
        defaultItem = items.find((item: any) => item[field.valueField] === defaultValue);

        // If not found, try to match by name fields (case-insensitive)
        if (!defaultItem) {
          const nameFields = ['name', 'nameEn', 'nameGu', 'title', 'label'];
          for (const nameField of nameFields) {
            defaultItem = items.find((item: any) =>
              item[nameField] &&
              item[nameField].toString().toLowerCase() === defaultValue.toString().toLowerCase()
            );
            if (defaultItem) break;
          }
        }

        // If not found, try partial match on name fields
        if (!defaultItem) {
          const nameFields = ['name', 'nameEn', 'nameGu', 'title', 'label'];
          for (const nameField of nameFields) {
            defaultItem = items.find((item: any) =>
              item[nameField] &&
              item[nameField].toString().toLowerCase().includes(defaultValue.toString().toLowerCase())
            );
            if (defaultItem) break;
          }
        }
      }

      if (defaultItem) {
        // Set the form control value to the value field (usually ID)
        const valueToSet = defaultItem[field.valueField];
        this.formGroup.get(field.name)?.setValue(valueToSet);

        // Also update the reference field component if it exists
        const referenceFieldComponent = this.referenceFieldComponents?.find(
          comp => comp.controlName === field.name
        );
        if (referenceFieldComponent) {
          // The reference field component will handle loading data and setting the display
          referenceFieldComponent.writeValue(valueToSet);
        }
      } else {
        const defaultValueStr = typeof defaultValue === 'object'
          ? JSON.stringify(defaultValue)
          : defaultValue;
        console.warn(`Could not find item matching default value ${defaultValueStr} for field ${field.name}`);
      }
    } catch (error) {
      console.error(`Error setting default value for ${field.name}:`, error);
    }
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
      if (column.validators) {
        if (column.validators.required) validators.push(Validators.required);
        if (column.validators.min !== undefined) validators.push(Validators.min(column.validators.min));
        if (column.validators.max !== undefined) validators.push(Validators.max(column.validators.max));
        if (column.validators.pattern) validators.push(Validators.pattern(column.validators.pattern));
        if (column.validators.email) validators.push(Validators.email);
      }
      group[column.field] = [column.defaultValue || '', validators];
    });
    this.formGroup = this.fb.group(group);
  }

  onSubmit() {
    if (this.formGroup.valid) {
      // TODO: Implement save logic based on mode
      console.log(this.formGroup.value);
      this.router.navigate([this.menuItem?.viewRoute]);
    }
  }

  onCancel() {
    this.router.navigate([this.menuItem?.viewRoute]);
  }
}
