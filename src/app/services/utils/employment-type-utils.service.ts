// src/app/services/utils/employment-type-utils.service.ts


import { Injectable } from '@angular/core';
import { EmploymentType } from '../../models/employment-type.model';
import { firstValueFrom } from 'rxjs';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { EmploymentTypeService } from '../employment-type/employment-type.service';

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
        return {
            data: response?.data || [],
            schema: response?.schema || [],
            defaultVisibleColumns: response.defaultVisibleColumns || [],
        };
    }
}
