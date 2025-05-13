// src/app/services/gp-village/gp-village-utils.service.ts


import { Injectable } from '@angular/core';
import { GpVillageService } from './gp-village.service';
import { GpVillage } from '../../models/gp-village.model';
import { BaseReferenceUtilsService, ReferenceSchema } from '../BaseReferenceUtilsService';
import { firstValueFrom } from 'rxjs';

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
        if (this.talukaId == null) {
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
