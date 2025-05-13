// src/app/components/forms/form-groups.ts

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export function createFormGroups(formBuilder: FormBuilder): {
    step1Group: FormGroup;
    step2Group: FormGroup;
    step3Group: FormGroup;
    step4Group: FormGroup;
    step5Group: FormGroup;
    step6Group: FormGroup;
    step7Group: FormGroup;
    step8Group: FormGroup;
    step9Group: FormGroup;
} {
    return {
        step1Group: formBuilder.group({
            demand_number: ['1'],
            demand_workId: ['', [Validators.required]],
            demand_financialYear: ['', [Validators.required]],
            demand_requestDate: ['', [Validators.required]],
            demand_proposalAmount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
            demand_proposalDate: ['', [Validators.required]],
            demand_dmndNumber: ['', [Validators.required]],
            demand_proposerName: ['', [Validators.required]],
            demand_schemeName: ['', [Validators.required]],
            demand_fund: ['', [Validators.required]],
            demand_MpMlaName: ['', [Validators.required]],
            demand_workDescription: ['', [Validators.required, Validators.minLength(10)]],
            demand_estimatedCompletionDate: ['', [Validators.required]],
            demand_importanceOfWork: ['', [Validators.required]],
            demand_isTrust: [false],
            demand_trustName: [''],
            demand_trustAddress: [''],
            demand_trustRegistrationNumber: [''],
            demand_trustRegistrationDate: [''],
            demand_officer: [''],
            demand_assignPSTo: ['', [Validators.required]],
            demand_sector: ['', [Validators.required]],
            demand_subSector: ['', [Validators.required]],
            demand_implementationOfficer: ['', [Validators.required]],
            demand_beneficiaryDistrict: ['', [Validators.required]],
            demand_beneficiaryTaluka: ['', [Validators.required]],
            demand_beneficiaryAreaType: ['', [Validators.required]],
            demand_beneficiaryVillage: [''],
            demand_beneficiaryNagarpalika: [''],
            demand_beneficiaryGroup: ['', [Validators.required]],
            demand_demandStatus: ['', [Validators.required]],
        }),
        step2Group: formBuilder.group({
            secondCtrl: ['', Validators.required],
        }),
        step3Group: formBuilder.group({
            secondCtrl: ['', Validators.required],
        }),
        step4Group: formBuilder.group({
            secondCtrl: ['', Validators.required],
        }),
        step5Group: formBuilder.group({
            secondCtrl: ['', Validators.required],
        }),
        step6Group: formBuilder.group({
            secondCtrl: ['', Validators.required],
        }),
        step7Group: formBuilder.group({
            secondCtrl: ['', Validators.required],
        }),
        step8Group: formBuilder.group({
            secondCtrl: ['', Validators.required],
        }),
        step9Group: formBuilder.group({
            secondCtrl: ['', Validators.required],
        }),
    };
}