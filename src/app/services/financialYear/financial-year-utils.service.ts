// src/app/services/financialYear/financial-year-utils.service.ts
import { Injectable } from '@angular/core';
import { FinancialYearService } from './financial-year.service';
import { FinancialYear } from './financialYear.model';
import { BaseReferenceUtilsService, ReferenceSchema } from '../BaseReferenceUtilsService';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FinancialYearUtilsService extends BaseReferenceUtilsService<FinancialYear> {
    currentFinancialYear: FinancialYear | null = null;

    constructor(private fyService: FinancialYearService) {
        super();
        this.labelField = 'Financial Year';
    }

    protected async fetchAllItems(): Promise<{ data: FinancialYear[]; schema: ReferenceSchema<FinancialYear>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.fyService.getAllFinancialYears());
        return {
            data: response?.data || [],
            schema: response?.schema || [],
            defaultVisibleColumns: response.defaultVisibleColumns || [],
        };
    }

    loadCurrentFinancialYear(): void {
        this.fyService.getCurrentFinancialYear().subscribe({
            next: (data) => {
                this.currentFinancialYear = data;
            },
            error: (err) => {
                console.error('Failed to load current financial year:', err);
            }
        });
    }

    setAsCurrent(id: number): void {
        if (confirm('Are you sure you want to set this as the current financial year?')) {
            this.fyService.setCurrentFinancialYear(id).subscribe({
                next: () => {
                    this.loadCurrentFinancialYear();
                    this.loadItems(); // Refresh list
                },
                error: (err) => {
                    console.error('Failed to set current financial year:', err);
                }
            });
        }
    }
}
