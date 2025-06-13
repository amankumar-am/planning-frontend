// src/app/services/utils/employment-type-utils.service.ts


import { Injectable } from '@angular/core';
import { EmploymentType } from '../../models/employment-type.model';
import { firstValueFrom } from 'rxjs';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { EmploymentTypeService } from '../employment-type/employment-type.service';
import { QueryOptions } from '../../core/query.helper';

@Injectable({
    providedIn: 'root'
})
export class EmploymentTypeUtilsService extends BaseReferenceUtilsService<EmploymentType> {
    constructor(private employmentTypeService: EmploymentTypeService) {
        super();
        this.labelField = 'EmploymentType';
    }

    protected async fetchAllItems(): Promise<{ data: EmploymentType[]; schema: ReferenceSchema<EmploymentType>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.employmentTypeService.getAllEmploymentTypes());

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    protected override async fetchItemsWithQuery(options: QueryOptions): Promise<{ data: EmploymentType[]; schema: ReferenceSchema<EmploymentType>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.employmentTypeService.getEmploymentTypesWithQuery(options));

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    private createDefaultSchema(): ReferenceSchema<EmploymentType>[] {
        return [
            { field: 'id', label: 'ID' },
            { field: 'name', label: 'Name' },
            { field: 'isActive', label: 'Active' },
            { field: 'createdBy', label: 'Created By' },
            { field: 'createdAt', label: 'Created At' }
        ];
    }

    private createDefaultVisibleColumns(): string[] {
        return ['name', 'isActive'];
    }
}
