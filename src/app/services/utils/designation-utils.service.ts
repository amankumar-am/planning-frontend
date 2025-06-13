// src/app/services/utils/designation-utils.service.ts


import { Injectable } from '@angular/core';
import { DesignationService } from '../designation/designation.service';
import { Designation } from '../../models/designation.model';
import { firstValueFrom } from 'rxjs';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';

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
        return {
            data: response?.data || [],
            schema: response?.schema || [],
            defaultVisibleColumns: response.defaultVisibleColumns || [],
        };
    }
}
