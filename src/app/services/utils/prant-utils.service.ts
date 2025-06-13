// src/app/services/utils/prant-utils.service.ts


import { Injectable } from '@angular/core';
import { Prant } from '../../models/prant.model';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { firstValueFrom } from 'rxjs';
import { PrantService } from '../prant/prant.service';
import { QueryOptions } from '../../core/query.helper';

@Injectable({
    providedIn: 'root'
})
export class PrantUtilsService extends BaseReferenceUtilsService<Prant> {
    constructor(private prantService: PrantService) {
        super();
        this.labelField = 'Prant';
    }

    protected async fetchAllItems(): Promise<{ data: Prant[]; schema: ReferenceSchema<Prant>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.prantService.getAllPrants());

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    protected override async fetchItemsWithQuery(options: QueryOptions): Promise<{ data: Prant[]; schema: ReferenceSchema<Prant>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.prantService.getPrantsWithQuery(options));

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    private createDefaultSchema(): ReferenceSchema<Prant>[] {
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
