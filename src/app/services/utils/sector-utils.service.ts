// src/app/services/utils/sector-utils.service.ts


import { Injectable } from '@angular/core';
import { SectorService } from '../sector/sector.service';
import { firstValueFrom } from 'rxjs';
import { Sector } from '../../models/sector.model';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { QueryOptions } from '../../core/query.helper';

// Interface to satisfy ReferenceFieldComponent

@Injectable({
    providedIn: 'root'
})
export class SectorUtilsService extends BaseReferenceUtilsService<Sector> {
    constructor(private sectorService: SectorService) {
        super();
        this.labelField = 'Sector'; // Use fundingGroup as the display field
    }

    protected async fetchAllItems(): Promise<{ data: Sector[]; schema: ReferenceSchema<Sector>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.sectorService.getAllSectors());

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    protected override async fetchItemsWithQuery(options: QueryOptions): Promise<{ data: Sector[]; schema: ReferenceSchema<Sector>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.sectorService.getSectorsWithQuery(options));

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    private createDefaultSchema(): ReferenceSchema<Sector>[] {
        return [
            { field: 'id', label: 'ID' },
            { field: 'name', label: 'Name' },
            { field: 'nameEn', label: 'Name (English)' },
            { field: 'nameGu', label: 'Name (Gujarati)' },
            { field: 'scheme', label: 'Scheme' },
            { field: 'sectorNumber', label: 'Sector Number' },
            { field: 'isActive', label: 'Active' },
            { field: 'createdBy', label: 'Created By' },
            { field: 'createdAt', label: 'Created At' }
        ];
    }

    private createDefaultVisibleColumns(): string[] {
        return ['nameEn', 'nameGu', 'scheme', 'sectorNumber', 'isActive'];
    }
}

