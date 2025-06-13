// src/app/services/utils/officer-class-utils.service.ts


import { Injectable } from '@angular/core';
import { OfficerClass } from '../../models/officer-class.model';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { firstValueFrom } from 'rxjs';
import { OfficerClassService } from '../officer-class/officer-class.service';

@Injectable({
    providedIn: 'root'
})
export class OfficerClassUtilsService extends BaseReferenceUtilsService<OfficerClass> {
    constructor(private officerClassService: OfficerClassService) {
        super();
        this.labelField = 'OfficerClass';
    }

    protected async fetchAllItems(): Promise<{ data: OfficerClass[]; schema: ReferenceSchema<OfficerClass>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.officerClassService.getAllOfficerClasss());
        return {
            data: response?.data || [],
            schema: response?.schema || [],
            defaultVisibleColumns: response.defaultVisibleColumns || [],
        };
    }
}
