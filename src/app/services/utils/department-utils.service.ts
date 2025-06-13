// src/app/services/utils/department-utils.service.ts


import { Injectable } from '@angular/core';
import { Department } from '../../models/department.model';
import { firstValueFrom } from 'rxjs';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { DepartmentService } from '../department/department.service';

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
        return {
            data: response?.data || [],
            schema: response?.schema || [],
            defaultVisibleColumns: response.defaultVisibleColumns || [],
        };
    }
}
