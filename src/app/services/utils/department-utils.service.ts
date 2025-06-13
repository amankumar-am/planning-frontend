// src/app/services/utils/department-utils.service.ts


import { Injectable } from '@angular/core';
import { Department } from '../../models/department.model';
import { firstValueFrom } from 'rxjs';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { DepartmentService } from '../department/department.service';
import { QueryOptions } from '../../core/query.helper';

@Injectable({
    providedIn: 'root'
})
export class DepartmentUtilsService extends BaseReferenceUtilsService<Department> {
    constructor(private departmentService: DepartmentService) {
        super();
        this.labelField = 'Department';
    }

    protected async fetchAllItems(): Promise<{ data: Department[]; schema: ReferenceSchema<Department>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.departmentService.getAllDepartments());

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    protected override async fetchItemsWithQuery(options: QueryOptions): Promise<{ data: Department[]; schema: ReferenceSchema<Department>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.departmentService.getDepartmentsWithQuery(options));

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    private createDefaultSchema(): ReferenceSchema<Department>[] {
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
