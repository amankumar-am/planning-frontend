// src/app/services/utils/district-utils.service.ts


import { Injectable } from '@angular/core';
import { DistrictService } from '../district/district.service';
import { District } from '../../models/district.model';
import { firstValueFrom } from 'rxjs';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { QueryOptions } from '../../core/query.helper';

@Injectable({
    providedIn: 'root'
})
export class DistrictUtilsService extends BaseReferenceUtilsService<District> {
    constructor(private districtService: DistrictService) {
        super();
        this.labelField = 'District';
    }

    protected async fetchAllItems(): Promise<{ data: District[]; schema: ReferenceSchema<District>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.districtService.getAllDistricts());

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    protected override async fetchItemsWithQuery(options: QueryOptions): Promise<{ data: District[]; schema: ReferenceSchema<District>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.districtService.getDistrictsWithQuery(options));

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    private createDefaultSchema(): ReferenceSchema<District>[] {
        return [
            { field: 'id', label: 'ID' },
            { field: 'name', label: 'Name' },
            { field: 'nameEn', label: 'Name (English)' },
            { field: 'nameGu', label: 'Name (Gujarati)' },
            { field: 'eDharaCode', label: 'eDhara Code' },
            { field: 'state', label: 'State' },
            { field: 'isActive', label: 'Active' },
            { field: 'createdBy', label: 'Created By' },
            { field: 'createdAt', label: 'Created At' }
        ];
    }

    private createDefaultVisibleColumns(): string[] {
        return ['nameEn', 'nameGu', 'eDharaCode', 'isActive'];
    }
}
