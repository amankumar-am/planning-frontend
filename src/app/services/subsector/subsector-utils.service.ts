// src/app/services/subsector/subsector-utils.service.ts


import { Injectable } from '@angular/core';
import { SubsectorService } from './subsector.service';
import { Subsector } from '../../models/subsector.model';
import { BaseReferenceUtilsService, ReferenceSchema } from '../BaseReferenceUtilsService';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SubsectorUtilsService extends BaseReferenceUtilsService<Subsector> {
    constructor(private subsectorService: SubsectorService) {
        super();
        this.labelField = 'Subsector';
    }

    protected async fetchAllItems(): Promise<{ data: Subsector[]; schema: ReferenceSchema<Subsector>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.subsectorService.getAllSubsectors());
        console.log(response);

        return {
            data: response?.data || [],
            schema: response?.schema || [],
            defaultVisibleColumns: response.defaultVisibleColumns || [],
        };
    }
}
