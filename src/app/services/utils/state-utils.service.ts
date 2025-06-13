// src/app/services/utils/state-utils.service.ts


import { Injectable } from '@angular/core';
import { State } from '../../models/state.model';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { firstValueFrom } from 'rxjs';
import { StateService } from '../state/state.service';
import { QueryOptions } from '../../core/query.helper';

@Injectable({
    providedIn: 'root'
})
export class StateUtilsService extends BaseReferenceUtilsService<State> {
    constructor(private stateService: StateService) {
        super();
        this.labelField = 'State';
    }

    protected async fetchAllItems(): Promise<{ data: State[]; schema: ReferenceSchema<State>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.stateService.getAllStates());

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    protected override async fetchItemsWithQuery(options: QueryOptions): Promise<{ data: State[]; schema: ReferenceSchema<State>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.stateService.getStatesWithQuery(options));

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    private createDefaultSchema(): ReferenceSchema<State>[] {
        return [
            { field: 'id', label: 'ID' },
            { field: 'code', label: 'Code' },
            { field: 'nameEn', label: 'Name (English)' },
            { field: 'nameGu', label: 'Name (Gujarati)' },
            { field: 'district', label: 'District' },
            { field: 'isActive', label: 'Active' },
            { field: 'createdBy', label: 'Created By' },
            { field: 'createdAt', label: 'Created At' }
        ];
    }

    private createDefaultVisibleColumns(): string[] {
        return ['code', 'nameEn', 'nameGu', 'isActive'];
    }
}
