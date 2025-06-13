// src/app/services/utils/office-utils.service.ts


import { Injectable } from '@angular/core';
import { Office } from '../../models/office.model';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { firstValueFrom } from 'rxjs';
import { OfficeService } from '../office/office.service';
import { QueryOptions } from '../../core/query.helper';

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

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    protected override async fetchItemsWithQuery(options: QueryOptions): Promise<{ data: Office[]; schema: ReferenceSchema<Office>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.officeService.getOfficesWithQuery(options));

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    private createDefaultSchema(): ReferenceSchema<Office>[] {
        return [
            { field: 'id', label: 'ID' },
            { field: 'code', label: 'Code' },
            { field: 'nicCode', label: 'NIC Code' },
            { field: 'name', label: 'Name' },
            { field: 'nameEn', label: 'Name (English)' },
            { field: 'nameGu', label: 'Name (Gujarati)' },
            { field: 'officeLevel', label: 'Office Level' },
            { field: 'department', label: 'Department' },
            { field: 'email', label: 'Email' },
            { field: 'landline', label: 'Landline' },
            { field: 'address', label: 'Address' },
            { field: 'district', label: 'District' },
            { field: 'isActive', label: 'Active' }
        ];
    }

    private createDefaultVisibleColumns(): string[] {
        return ['code', 'nameEn', 'nameGu', 'officeLevel', 'department', 'isActive'];
    }
}
