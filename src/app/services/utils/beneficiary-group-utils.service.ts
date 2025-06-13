// src/app/services/utils/beneficiary-group-utils.service.ts
import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { BeneficiaryGroup } from '../../models/beneficiaryGroup.model';
import { BeneficiaryGroupService } from '../beneficiaryGroup/beneficiary-group.service';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { QueryOptions } from '../../core/query.helper';

@Injectable({
    providedIn: 'root'
})
export class BeneficiaryGroupUtilsService extends BaseReferenceUtilsService<BeneficiaryGroup> {
    constructor(private beneficiaryGroupService: BeneficiaryGroupService) {
        super();
        this.labelField = 'BeneficiaryGroup';
    }

    protected async fetchAllItems(): Promise<{ data: BeneficiaryGroup[]; schema: ReferenceSchema<BeneficiaryGroup>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.beneficiaryGroupService.getAllBeneficiaryGroups());

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    protected override async fetchItemsWithQuery(options: QueryOptions): Promise<{ data: BeneficiaryGroup[]; schema: ReferenceSchema<BeneficiaryGroup>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.beneficiaryGroupService.getBeneficiaryGroupsWithQuery(options));

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    private createDefaultSchema(): ReferenceSchema<BeneficiaryGroup>[] {
        return [
            { field: 'id', label: 'ID' },
            { field: 'name', label: 'Name (English)' },
            { field: 'name_gu', label: 'Name (Gujarati)' },
            { field: 'description', label: 'Description' },
            { field: 'isActive', label: 'Active' },
            { field: 'createdBy', label: 'Created By' },
            { field: 'createdAt', label: 'Created At' },
            { field: 'modifiedBy', label: 'Modified By' },
            { field: 'modifiedAt', label: 'Modified At' }
        ];
    }

    private createDefaultVisibleColumns(): string[] {
        return ['name', 'name_gu', 'description', 'isActive'];
    }
}
