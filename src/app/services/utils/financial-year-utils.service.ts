// src/app/services/utils/financial-year-utils.service.ts
import { Injectable } from '@angular/core';
import { FinancialYearService } from '../financialYear/financial-year.service';
import { FinancialYear } from '../../models/financialYear.model';
import { firstValueFrom } from 'rxjs';
import { BaseReferenceUtilsService, ReferenceSchema } from './BaseReferenceUtilsService';
import { QueryOptions } from '../../core/query.helper';

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

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    protected override async fetchItemsWithQuery(options: QueryOptions): Promise<{ data: FinancialYear[]; schema: ReferenceSchema<FinancialYear>[], defaultVisibleColumns: string[] }> {
        const response = await firstValueFrom(this.fyService.getFinancialYearsWithQuery(options));

        // If backend doesn't provide schema/defaultVisibleColumns, create them manually
        const result = {
            data: response?.data || [],
            schema: response?.schema || this.createDefaultSchema(),
            defaultVisibleColumns: response?.defaultVisibleColumns || this.createDefaultVisibleColumns(),
        };

        return result;
    }

    private createDefaultSchema(): ReferenceSchema<FinancialYear>[] {
        return [
            { field: 'id', label: 'ID' },
            { field: 'name', label: 'Name' },
            { field: 'duration', label: 'Duration' },
            { field: 'startDate', label: 'Start Date' },
            { field: 'endDate', label: 'End Date' },
            { field: 'isCurrent', label: 'Current' },
            { field: 'isActive', label: 'Active' },
            { field: 'createdBy', label: 'Created By' },
            { field: 'createdAt', label: 'Created At' }
        ];
    }

    private createDefaultVisibleColumns(): string[] {
        return ['name', 'duration', 'startDate', 'endDate', 'isCurrent', 'isActive'];
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
