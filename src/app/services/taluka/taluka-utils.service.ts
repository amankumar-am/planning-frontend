
import { Injectable } from '@angular/core';
import { TalukaService } from './taluka.service';
import { Taluka } from '../../models/taluka.model';
import { BaseReferenceUtilsService, ReferenceSchema } from '../BaseReferenceUtilsService';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TalukaUtilsService extends BaseReferenceUtilsService<Taluka> {
    constructor(private talukaService: TalukaService) {
        super();
        this.labelField = 'Taluka';
    }

    protected async fetchAllItems(): Promise<{ data: Taluka[]; schema: ReferenceSchema<Taluka>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.talukaService.getAllTalukas());
        return {
            data: response?.data || [],
            schema: response?.schema || [],
            defaultVisibleColumns: response.defaultVisibleColumns || [],
        };
    }
}
