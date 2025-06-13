// src/app/services/utils/designation-utils.service.ts


import { Injectable } from '@angular/core';
import { DesignationService } from '../designation/designation.service';
import { Designation } from '../../models/designation.model';
import { firstValueFrom } from 'rxjs';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { QueryOptions } from '../../core/query.helper';

@Injectable({
    providedIn: 'root'
})
export class DesignationUtilsService extends BaseReferenceUtilsService<Designation> {
    constructor(private designationService: DesignationService) {
        super();
        this.labelField = 'Designation';
    }

    protected async fetchAllItems(): Promise<{ data: Designation[]; schema: ReferenceSchema<Designation>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.designationService.getAllDesignations());

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    protected override async fetchItemsWithQuery(options: QueryOptions): Promise<{ data: Designation[]; schema: ReferenceSchema<Designation>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.designationService.getDesignationsWithQuery(options));

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    private createDefaultSchema(): ReferenceSchema<Designation>[] {
        return [
            { field: 'id', label: 'ID' },
            { field: 'code', label: 'Code' },
            { field: 'name', label: 'Name' },
            { field: 'nameEn', label: 'Name (English)' },
            { field: 'nameGu', label: 'Name (Gujarati)' },
            { field: 'department', label: 'Department' },
            { field: 'isActive', label: 'Active' },
            { field: 'createdBy', label: 'Created By' },
            { field: 'createdAt', label: 'Created At' }
        ];
    }

    private createDefaultVisibleColumns(): string[] {
        return ['code', 'nameEn', 'nameGu', 'department', 'isActive'];
    }
}
