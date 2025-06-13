// src/app/services/utils/ac-utils.service.ts


import { Injectable } from '@angular/core';
import { Ac } from '../../models/ac.model';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { firstValueFrom } from 'rxjs';
import { AcService } from '../ac/ac.service';
import { QueryOptions } from '../../core/query.helper';

@Injectable({
    providedIn: 'root'
})
export class AcUtilsService extends BaseReferenceUtilsService<Ac> {
    constructor(private acService: AcService) {
        super();
        this.labelField = 'Ac';
    }

    protected async fetchAllItems(): Promise<{ data: Ac[]; schema: ReferenceSchema<Ac>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.acService.getAllAcs());

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    protected override async fetchItemsWithQuery(options: QueryOptions): Promise<{ data: Ac[]; schema: ReferenceSchema<Ac>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.acService.getAcsWithQuery(options));

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    private createDefaultSchema(): ReferenceSchema<Ac>[] {
        return [
            { field: 'id', label: 'ID' },
            { field: 'code', label: 'Code' },
            { field: 'nameEn', label: 'Name (English)' },
            { field: 'nameGu', label: 'Name (Gujarati)' },
            { field: 'district', label: 'District' },
            { field: 'isActive', label: 'Active' },
            { field: 'createdBy', label: 'Created By' },
            { field: 'createdAt', label: 'Created At' }
        ];
    }

    private createDefaultVisibleColumns(): string[] {
        return ['code', 'nameEn', 'nameGu', 'district', 'isActive'];
    }
}
