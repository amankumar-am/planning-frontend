// src/app/services/utils/ac-utils.service.ts


import { Injectable } from '@angular/core';
import { Ac } from '../../models/ac.model';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { firstValueFrom } from 'rxjs';
import { AcService } from '../ac/ac.service';

@Injectable({
    providedIn: 'root'
})
export class AcUtilsService extends BaseReferenceUtilsService<Ac> {
    constructor(private acService: AcService) {
        super();
        this.labelField = 'Ac';
    }

    protected async fetchAllItems(): Promise<{ data: Ac[]; schema: ReferenceSchema<Ac>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.acService.getAllAcs());
        return {
            data: response?.data || [],
            schema: response?.schema || [],
            defaultVisibleColumns: response.defaultVisibleColumns || [],
        };
    }
}
