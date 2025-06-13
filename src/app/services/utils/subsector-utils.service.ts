// src/app/services/utils/subsector-utils.service.ts


import { Injectable } from '@angular/core';
import { SubsectorService } from '../subsector/subsector.service';
import { Subsector } from '../../models/subsector.model';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { firstValueFrom } from 'rxjs';
import { QueryOptions } from '../../core/query.helper';

@Injectable({
    providedIn: 'root'
})
export class SubsectorUtilsService extends BaseReferenceUtilsService<Subsector> {
    private sectorId: number | null = null;
    constructor(private subsectorService: SubsectorService) {
        super();
        this.labelField = 'Subsector';
    }

    setSectorId(sectorId: number): void {
        this.sectorId = sectorId;
    }

    protected async fetchAllItems(): Promise<{ data: Subsector[]; schema: ReferenceSchema<Subsector>[], defaultVisibleColumns: string[] }> {
        if (this.sectorId == null || this.sectorId <= 0) {
            return { data: [], schema: [], defaultVisibleColumns: [] };
        }

        const response = await firstValueFrom(this.subsectorService.getSubsectorsBySector(this.sectorId));
        return {
            data: response?.data || [],
            schema: response?.schema || [],
            defaultVisibleColumns: response.defaultVisibleColumns || [],
        };
    }

    protected override async fetchItemsWithQuery(options: QueryOptions): Promise<{ data: Subsector[]; schema: ReferenceSchema<Subsector>[], defaultVisibleColumns: string[] }> {
        // Extract sector ID from dependency filter
        let sectorId = this.sectorId; // Use manually set ID as fallback

        if (options.filters) {
            const dependencyFilter = options.filters.find(f => f.field === 'demand_sector' && f.operator === 'eq');
            if (dependencyFilter) {
                sectorId = dependencyFilter.value;
            }
        }

        if (sectorId == null || sectorId <= 0) {
            return { data: [], schema: [], defaultVisibleColumns: [] };
        }

        // For now, use the existing endpoint since backend query might not be implemented yet
        const response = await firstValueFrom(this.subsectorService.getSubsectorsBySector(sectorId));
        return {
            data: response?.data || [],
            schema: response?.schema || [],
            defaultVisibleColumns: response.defaultVisibleColumns || [],
        };
    }


}
