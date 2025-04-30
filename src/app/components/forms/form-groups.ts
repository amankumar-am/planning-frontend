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
            demand_workId: ['', Validators.required],
            // demand_financialYear: ['', Validators.required],
            // demand_requestDate: ['', Validators.required],
            demand_officer: ['', Validators.required],
            demand_assignPSTo: ['', Validators.required],
            // demand_sector: ['', Validators.required],
            // demand_subSector: ['', Validators.required],
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
