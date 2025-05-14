// src/app/services/utils/sector-utils.service.ts


import { Injectable } from '@angular/core';
import { SectorService } from '../sector/sector.service';
import { firstValueFrom } from 'rxjs';
import { Sector } from '../../models/sector.model';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';

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
        return {
            data: response?.data || [],
            schema: response?.schema || [],
            defaultVisibleColumns: response.defaultVisibleColumns || [],
        };

    }
}

