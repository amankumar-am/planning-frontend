// src/app/services/utils/gp-village-utils.service.ts


import { Injectable } from '@angular/core';
import { GpVillageService } from '../gp-village/gp-village.service';
import { GpVillage } from '../../models/gp-village.model';
import { firstValueFrom } from 'rxjs';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { QueryOptions } from '../../core/query.helper';

@Injectable({
    providedIn: 'root'
})
export class GpVillageUtilsService extends BaseReferenceUtilsService<GpVillage> {
    private talukaId: number | null = null;
    constructor(private gpVillageService: GpVillageService) {
        super();
        this.labelField = 'GpVillage';
    }

    setTalukaId(talukaId: number): void {
        this.talukaId = talukaId;
    }

    protected async fetchAllItems(): Promise<{ data: GpVillage[]; schema: ReferenceSchema<GpVillage>[], defaultVisibleColumns: string[] }> {
        if (this.talukaId == null || this.talukaId <= 0) {
            return { data: [], schema: [], defaultVisibleColumns: [] };
        }

        const response = await firstValueFrom(this.gpVillageService.getGpVillagesByTaluka(this.talukaId));
        return {
            data: response?.data || [],
            schema: response?.schema || [],
            defaultVisibleColumns: response.defaultVisibleColumns || [],
        };
    }

    protected override async fetchItemsWithQuery(options: QueryOptions): Promise<{ data: GpVillage[]; schema: ReferenceSchema<GpVillage>[], defaultVisibleColumns: string[] }> {
        // Extract taluka ID from dependency filter
        let talukaId = this.talukaId; // Use manually set ID as fallback

        if (options.filters) {
            const dependencyFilter = options.filters.find(f => f.field === 'demand_beneficiaryTaluka' && f.operator === 'eq');
            if (dependencyFilter) {
                talukaId = dependencyFilter.value;
            }
        }

        if (talukaId == null || talukaId <= 0) {
            return { data: [], schema: [], defaultVisibleColumns: [] };
        }

        // For now, use the existing endpoint since backend query might not be implemented yet
        const response = await firstValueFrom(this.gpVillageService.getGpVillagesByTaluka(talukaId));
        return {
            data: response?.data || [],
            schema: response?.schema || [],
            defaultVisibleColumns: response.defaultVisibleColumns || [],
        };
    }
}
