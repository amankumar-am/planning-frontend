// src/app/services/utils/fund-utils.service.ts


import { Injectable } from '@angular/core';
import { FundService } from '../fund/fund.service';
import { firstValueFrom } from 'rxjs';
import { Fund } from '../../models/fund.model';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { QueryOptions } from '../../core/query.helper';

@Injectable({
    providedIn: 'root'
})
export class FundUtilsService extends BaseReferenceUtilsService<Fund> {
    currentFund: Fund | null = null;

    constructor(private fundService: FundService) {
        super();
        this.labelField = 'Fund';
    }

    protected async fetchAllItems(): Promise<{ data: Fund[]; schema: ReferenceSchema<Fund>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.fundService.getAllFunds());

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    protected override async fetchItemsWithQuery(options: QueryOptions): Promise<{ data: Fund[]; schema: ReferenceSchema<Fund>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.fundService.getFundsWithQuery(options));

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    private createDefaultSchema(): ReferenceSchema<Fund>[] {
        return [
            { field: 'id', label: 'ID' },
            { field: 'name', label: 'Name' },
            { field: 'fundingGroup', label: 'Funding Group' },
            { field: 'fundingSource_En', label: 'Funding Source (English)' },
            { field: 'fundingSource_Gu', label: 'Funding Source (Gujarati)' },
            { field: 'financialYear', label: 'Financial Year' },
            { field: 'grantValue', label: 'Grant Value' },
            { field: 'act', label: 'Act' },
            { field: 'isActive', label: 'Active' },
            { field: 'createdBy', label: 'Created By' },
            { field: 'createdAt', label: 'Created At' }
        ];
    }

    private createDefaultVisibleColumns(): string[] {
        return ['fundingGroup', 'fundingSource_En', 'financialYear', 'grantValue', 'isActive'];
    }
}
