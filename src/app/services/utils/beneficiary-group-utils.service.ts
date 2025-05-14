// src/app/services/utils/beneficiary-group-utils.service.ts
import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { BeneficiaryGroup } from '../../models/beneficiaryGroup.model';
import { BeneficiaryGroupService } from '../beneficiaryGroup/beneficiary-group.service';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';

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
