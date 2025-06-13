// src/app/services/utils/subsector-utils.service.ts


import { Injectable } from '@angular/core';
import { SubsectorService } from '../subsector/subsector.service';
import { Subsector } from '../../models/subsector.model';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { firstValueFrom } from 'rxjs';

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


}
