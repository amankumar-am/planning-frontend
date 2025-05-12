// src/app/services/district/district-utils.service.ts


import { Injectable } from '@angular/core';
import { DistrictService } from './district.service';
import { District } from '../../models/district.model';
import { BaseReferenceUtilsService, ReferenceSchema } from '../BaseReferenceUtilsService';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DistrictUtilsService extends BaseReferenceUtilsService<District> {
    constructor(private districtService: DistrictService) {
        super();
        this.labelField = 'District';
    }

    protected async fetchAllItems(): Promise<{ data: District[]; schema: ReferenceSchema<District>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.districtService.getAllDistricts());
        return {
            data: response?.data || [],
            schema: response?.schema || [],
            defaultVisibleColumns: response.defaultVisibleColumns || [],
        };
    }
}
