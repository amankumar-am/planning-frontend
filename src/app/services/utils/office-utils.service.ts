// src/app/services/utils/office-utils.service.ts


import { Injectable } from '@angular/core';
import { Office } from '../../models/office.model';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { firstValueFrom } from 'rxjs';
import { OfficeService } from '../office/office.service';

@Injectable({
    providedIn: 'root'
})
export class OfficeUtilsService extends BaseReferenceUtilsService<Office> {
    constructor(private officeService: OfficeService) {
        super();
        this.labelField = 'Office';
    }

    protected async fetchAllItems(): Promise<{ data: Office[]; schema: ReferenceSchema<Office>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.officeService.getAllOffices());
        return {
            data: response?.data || [],
            schema: response?.schema || [],
            defaultVisibleColumns: response.defaultVisibleColumns || [],
        };
    }
}
