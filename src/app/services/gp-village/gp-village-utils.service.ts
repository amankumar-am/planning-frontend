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
    constructor(private gpVillageService: GpVillageService) {
        super();
        this.labelField = 'GpVillage';
    }

    protected async fetchAllItems(): Promise<{ data: GpVillage[]; schema: ReferenceSchema<GpVillage>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.gpVillageService.getAllGpVillages());
        return {
            data: response?.data || [],
            schema: response?.schema || [],
            defaultVisibleColumns: response.defaultVisibleColumns || [],
        };
    }
}
