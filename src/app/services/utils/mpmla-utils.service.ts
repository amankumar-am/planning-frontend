// src/app/services/utils/mpmla-utils.service.ts


import { Injectable } from '@angular/core';
import { Mpmla } from '../../models/mpmla.model';
import { firstValueFrom } from 'rxjs';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { MpmlaService } from '../mpmla/mpmla.service';
import { QueryOptions } from '../../core/query.helper';

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

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    protected override async fetchItemsWithQuery(options: QueryOptions): Promise<{ data: Mpmla[]; schema: ReferenceSchema<Mpmla>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.mpmlaService.getMpmlasWithQuery(options));

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    private createDefaultSchema(): ReferenceSchema<Mpmla>[] {
        return [
            { field: 'id', label: 'ID' },
            { field: 'name', label: 'Name' },
            { field: 'designation', label: 'Designation' },
            { field: 'startDate', label: 'Start Date' },
            { field: 'endDate', label: 'End Date' },
            { field: 'legislativeConstituency', label: 'Legislative Constituency' },
            { field: 'parliamentaryConstituency', label: 'Parliamentary Constituency' },
            { field: 'politicalParty', label: 'Political Party' },
            { field: 'term', label: 'Term' },
            { field: 'isActive', label: 'Active' }
        ];
    }

    private createDefaultVisibleColumns(): string[] {
        return ['name', 'designation', 'politicalParty', 'term', 'isActive'];
    }
}
