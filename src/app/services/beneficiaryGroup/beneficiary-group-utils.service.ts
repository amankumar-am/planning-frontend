// src/app/services/beneficiaryGroup/beneficiary-group-utils.service.ts
import { Injectable } from '@angular/core';
import { BaseReferenceUtilsService, ReferenceSchema } from '../BaseReferenceUtilsService';
import { firstValueFrom } from 'rxjs';
import { BeneficiaryGroupService } from './beneficiary-group.service';
import { BeneficiaryGroup } from './beneficiaryGroup.model';

@Injectable({
    providedIn: 'root'
})
export class BeneficiaryGroupUtilsService extends BaseReferenceUtilsService<BeneficiaryGroup> {
    constructor(private bgService: BeneficiaryGroupService) {
        super();
        this.labelField = 'Beneficiary Group';
    }

    protected async fetchAllItems(): Promise<{ data: BeneficiaryGroup[]; schema: ReferenceSchema<BeneficiaryGroup>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.bgService.getAllBeneficiaryGroups());
        return {
            data: response?.data || [],
            schema: response?.schema || [],
            defaultVisibleColumns: response.defaultVisibleColumns || [],
        };
    }
}
