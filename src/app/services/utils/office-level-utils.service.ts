// src/app/services/utils/office-level-utils.service.ts


import { Injectable } from '@angular/core';
import { OfficeLevel } from '../../models/office-level.model';
import { firstValueFrom } from 'rxjs';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { OfficeLevelService } from '../office-level/office-level.service';
import { QueryOptions } from '../../core/query.helper';

@Injectable({
    providedIn: 'root'
})
export class OfficeLevelUtilsService extends BaseReferenceUtilsService<OfficeLevel> {
    constructor(private officeLevelService: OfficeLevelService) {
        super();
        this.labelField = 'OfficeLevel';
    }

    protected async fetchAllItems(): Promise<{ data: OfficeLevel[]; schema: ReferenceSchema<OfficeLevel>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.officeLevelService.getAllOfficeLevels());

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    protected override async fetchItemsWithQuery(options: QueryOptions): Promise<{ data: OfficeLevel[]; schema: ReferenceSchema<OfficeLevel>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.officeLevelService.getOfficeLevelsWithQuery(options));

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    private createDefaultSchema(): ReferenceSchema<OfficeLevel>[] {
        return [
            { field: 'id', label: 'ID' },
            { field: 'code', label: 'Code' },
            { field: 'nameEn', label: 'Name (English)' },
            { field: 'nameGu', label: 'Name (Gujarati)' },
            { field: 'isActive', label: 'Active' },
            { field: 'createdBy', label: 'Created By' },
            { field: 'createdAt', label: 'Created At' }
        ];
    }

    private createDefaultVisibleColumns(): string[] {
        return ['code', 'nameEn', 'nameGu', 'isActive'];
    }
}
