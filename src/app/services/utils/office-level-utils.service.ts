// src/app/services/utils/office-level-utils.service.ts


import { Injectable } from '@angular/core';
import { OfficeLevel } from '../../models/office-level.model';
import { firstValueFrom } from 'rxjs';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { OfficeLevelService } from '../office-level/office-level.service';

@Injectable({
    providedIn: 'root'
})
export class OfficeLevelUtilsService extends BaseReferenceUtilsService<OfficeLevel> {
    constructor(private officeLevelService: OfficeLevelService) {
        super();
        this.labelField = 'OfficeLevel';
    }

    protected async fetchAllItems(): Promise<{ data: OfficeLevel[]; schema: ReferenceSchema<OfficeLevel>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.officeLevelService.getAllOfficeLevels());
        return {
            data: response?.data || [],
            schema: response?.schema || [],
            defaultVisibleColumns: response.defaultVisibleColumns || [],
        };
    }
}
