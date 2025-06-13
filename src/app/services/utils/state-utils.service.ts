// src/app/services/utils/state-utils.service.ts


import { Injectable } from '@angular/core';
import { State } from '../../models/state.model';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { firstValueFrom } from 'rxjs';
import { StateService } from '../state/state.service';

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
        return {
            data: response?.data || [],
            schema: response?.schema || [],
            defaultVisibleColumns: response.defaultVisibleColumns || [],
        };
    }
}
