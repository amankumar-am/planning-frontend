// src/app/services/utils/officer-class-utils.service.ts


import { Injectable } from '@angular/core';
import { OfficerClass } from '../../models/officer-class.model';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { firstValueFrom } from 'rxjs';
import { OfficerClassService } from '../officer-class/officer-class.service';
import { QueryOptions } from '../../core/query.helper';

@Injectable({
    providedIn: 'root'
})
export class OfficerClassUtilsService extends BaseReferenceUtilsService<OfficerClass> {
    constructor(private officerClassService: OfficerClassService) {
        super();
        this.labelField = 'OfficerClass';
    }

    protected async fetchAllItems(): Promise<{ data: OfficerClass[]; schema: ReferenceSchema<OfficerClass>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.officerClassService.getAllOfficerClasss());

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    protected override async fetchItemsWithQuery(options: QueryOptions): Promise<{ data: OfficerClass[]; schema: ReferenceSchema<OfficerClass>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.officerClassService.getOfficerClasssWithQuery(options));

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    private createDefaultSchema(): ReferenceSchema<OfficerClass>[] {
        return [
            { field: 'id', label: 'ID' },
            { field: 'code', label: 'Code' },
            { field: 'name', label: 'Name' },
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
