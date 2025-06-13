// src/app/services/utils/taluka-utils.service.ts


import { Injectable } from '@angular/core';
import { TalukaService } from '../taluka/taluka.service';
import { Taluka } from '../../models/taluka.model';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TalukaUtilsService extends BaseReferenceUtilsService<Taluka> {
    private districtId: number | null = null;
    constructor(private talukaService: TalukaService) {
        super();
        this.labelField = 'Taluka';
    }

    setDistrictId(districtId: number): void {
        this.districtId = districtId;
    }

    protected async fetchAllItems(): Promise<{ data: Taluka[]; schema: ReferenceSchema<Taluka>[], defaultVisibleColumns: string[] }> {
        if (this.districtId == null || this.districtId <= 0) {
            return { data: [], schema: [], defaultVisibleColumns: [] };
        }
        const response = await firstValueFrom(this.talukaService.getTalukasByDistrict(this.districtId));
        return {
            data: response?.data || [],
            schema: response?.schema || [],
            defaultVisibleColumns: response.defaultVisibleColumns || [],
        };
    }
}
