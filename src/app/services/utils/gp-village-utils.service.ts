// src/app/services/utils/gp-village-utils.service.ts


import { Injectable } from '@angular/core';
import { GpVillageService } from '../gp-village/gp-village.service';
import { GpVillage } from '../../models/gp-village.model';
import { firstValueFrom } from 'rxjs';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';

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
}
