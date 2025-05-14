// src/app/services/utils/district-utils.service.ts


import { Injectable } from '@angular/core';
import { DistrictService } from '../district/district.service';
import { District } from '../../models/district.model';
import { firstValueFrom } from 'rxjs';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';

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
