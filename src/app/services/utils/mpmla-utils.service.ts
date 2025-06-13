// src/app/services/utils/mpmla-utils.service.ts


import { Injectable } from '@angular/core';
import { Mpmla } from '../../models/mpmla.model';
import { firstValueFrom } from 'rxjs';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { MpmlaService } from '../mpmla/mpmla.service';

@Injectable({
    providedIn: 'root'
})
export class MpmlaUtilsService extends BaseReferenceUtilsService<Mpmla> {
    constructor(private mpmlaService: MpmlaService) {
        super();
        this.labelField = 'Mpmla';
    }

    protected async fetchAllItems(): Promise<{ data: Mpmla[]; schema: ReferenceSchema<Mpmla>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.mpmlaService.getAllMpmlas());
        return {
            data: response?.data || [],
            schema: response?.schema || [],
            defaultVisibleColumns: response.defaultVisibleColumns || [],
        };
    }
}
