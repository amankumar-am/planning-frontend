// src/app/services/utils/prant-utils.service.ts


import { Injectable } from '@angular/core';
import { Prant } from '../../models/prant.model';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { firstValueFrom } from 'rxjs';
import { PrantService } from '../prant/prant.service';

@Injectable({
    providedIn: 'root'
})
export class PrantUtilsService extends BaseReferenceUtilsService<Prant> {
    constructor(private prantService: PrantService) {
        super();
        this.labelField = 'Prant';
    }

    protected async fetchAllItems(): Promise<{ data: Prant[]; schema: ReferenceSchema<Prant>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.prantService.getAllPrants());
        return {
            data: response?.data || [],
            schema: response?.schema || [],
            defaultVisibleColumns: response.defaultVisibleColumns || [],
        };
    }
}
