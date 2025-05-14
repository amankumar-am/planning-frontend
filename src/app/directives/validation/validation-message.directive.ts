// src/app/directives/validation/validation-message.directive.ts

import { Directive, Input, ElementRef, OnInit, DoCheck } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({
    selector: '[appValidationMessage]',
    standalone: true,
})
export class ValidationMessageDirective implements OnInit, DoCheck {
    @Input() formGroup!: FormGroup;
    @Input() controlName!: string;

    private validationMessages: { [key: string]: { [key: string]: string } } = {
        demand_workId: { required: 'Work ID is required.' },
        demand_financialYear: { required: 'Financial Year is required.' },
        demand_requestDate: { required: 'Request Date is required.' },
        demand_proposalAmount: {
            required: 'Proposal Amount is required.',
            pattern: 'Proposal Amount must be a valid number.',
        },
        demand_proposalDate: { required: 'Proposal Date is required.' },
        demand_dmndNumber: { required: 'Demand Number is required.' },
        demand_proposerName: { required: 'Proposer Name is required.' },
        demand_schemeName: { required: 'Scheme Name is required.' },
        demand_fund: { required: 'Fund is required.' },
        demand_MpMlaName: { required: 'MP/MLA Name is required.' },
        demand_workDescription: {
            required: 'Work Description is required.',
            minlength: 'Work Description must be at least 10 characters long.',
        },
        demand_estimatedCompletionDate: { required: 'Estimated Completion Date is required.' },
        demand_importanceOfWork: { required: 'Importance of Work is required.' },
        demand_trustName: { required: 'Trust Name is required.' },
        demand_trustAddress: { required: 'Trust Address is required.' },
        demand_trustRegistrationNumber: { required: 'Trust Registration Number is required.' },
        demand_trustRegistrationDate: { required: 'Trust Registration Date is required.' },
        demand_assignPSTo: { required: 'Assign PS To is required.' },
        demand_sector: { required: 'Sector is required.' },
        demand_subSector: { required: 'Sub-Sector is required.' },
        demand_implementationOfficer: { required: 'Implementation Officer is required.' },
        demand_beneficiaryDistrict: { required: 'Beneficiary District is required.' },
        demand_beneficiaryTaluka: { required: 'Beneficiary Taluka is required.' },
        demand_beneficiaryAreaType: { required: 'Beneficiary Area Type is required.' },
        demand_beneficiaryVillage: { required: 'Beneficiary Village is required.' },
        demand_beneficiaryNagarpalika: { required: 'Beneficiary Nagarpalika is required.' },
        demand_beneficiaryGroup: { required: 'Beneficiary Group is required.' },
        demand_demandStatus: { required: 'Demand Status is required.' },
        // Form2: Sanction Form
        sanctionId: { required: 'Sanction ID is required.' },
        sanctionDate: { required: 'Sanction Date is required.' },
        // Form3: Technical Sanction Form
        technicalSanctionId: { required: 'Technical Sanction ID is required.' },
        technicalSanctionDate: { required: 'Technical Sanction Date is required.' },
        // Form4: Administrative Approval
        adminApprovalId: { required: 'Administrative Approval ID is required.' },
        adminApprovalDate: { required: 'Administrative Approval Date is required.' },
        // Form5: Work Order
        workOrderId: { required: 'Work Order ID is required.' },
        workOrderDate: { required: 'Work Order Date is required.' },
        // Form6: Contractor Selection
        contractorId: { required: 'Contractor ID is required.' },
        contractorSelectionDate: { required: 'Contractor Selection Date is required.' },
        // Form7: Progress Report
        progressReportId: { required: 'Progress Report ID is required.' },
        progressPercentage: { required: 'Progress Percentage is required.', pattern: 'Progress Percentage must be a valid number.' },
        // Form8: Completion Report
        completionReportId: { required: 'Completion Report ID is required.' },
        completionDate: { required: 'Completion Date is required.' },
        // Form9: Payment
        paymentId: { required: 'Payment ID is required.' },
        paymentDate: { required: 'Payment Date is required.' },
        paymentAmount: { required: 'Payment Amount is required.', pattern: 'Payment Amount must be a valid number.' },
        // Generic fallback
        secondCtrl: { required: 'This field is required.' },
    };

    constructor(private el: ElementRef) { }

    ngOnInit(): void {
        this.el.nativeElement.id = `error-${this.controlName}`;
        const input = this.el.nativeElement.closest('mat-form-field')?.querySelector('input, textarea, mat-select');
        if (input) {
            input.setAttribute('aria-describedby', `error-${this.controlName}`);
        }
    }

    ngDoCheck(): void {
        const message = this.getErrorMessage();
        this.el.nativeElement.textContent = message;
    }

    private getErrorMessage(): string {
        const control = this.formGroup.get(this.controlName);
        if (control && control.errors && (control.dirty || control.touched)) {
            const errorKey = Object.keys(control.errors)[0];
            return this.validationMessages[this.controlName]?.[errorKey] || 'Invalid input.';
        }
        return '';
    }
}