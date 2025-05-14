// src/app/services/utils/fund-utils.service.ts


import { Injectable } from '@angular/core';
import { FundService } from '../fund/fund.service';
import { firstValueFrom } from 'rxjs';
import { Fund } from '../../models/fund.model';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';

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
        return {
            data: response?.data || [],
            schema: response?.schema || [],
            defaultVisibleColumns: response.defaultVisibleColumns || [],
        };
    }
}
