// src/app/components/tables/funds/fundsView.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericTableComponent } from '../../common/generic-table/generic-table.component';
import { FundService } from '../../../services/fund/fund.service';
import { Fund } from '../../../models/fund.model';

@Component({
    selector: 'app-funds-view',
    standalone: true,
    imports: [CommonModule, GenericTableComponent],
    template: `
    <app-generic-table
      [data]="data"
      [columns]="columns"
      title="Funds"
      [baseEditRoute]="'/tables/funds/edit'"
      [addRoute]="'/tables/funds/add'"
      [showAddButton]="true"
      (delete)="onDelete($event)"
      (visibleColumnsChange)="onVisibleColumnsChange($event)"
    ></app-generic-table>
  `
})
export class FundsViewComponent implements OnInit {
    data: Fund[] = [];
    columns = [
        { field: 'id', label: 'ID' },
        { field: 'name', label: 'Name' },
        { field: 'fundingGroup', label: 'Funding Group' },
        { field: 'fundingSource_En', label: 'Funding Source (En)' },
        { field: 'fundingSource_Gu', label: 'Funding Source (Gu)' },
        { field: 'financialYear', label: 'Financial Year' },
        { field: 'grantValue', label: 'Grant Value' },
        { field: 'act', label: 'Act' },
        { field: 'isActive', label: 'Active' },
        { field: 'createdBy', label: 'Created By' },
        { field: 'createdAt', label: 'Created At' },
        { field: 'modifiedBy', label: 'Modified By' },
        { field: 'modifiedAt', label: 'Modified At' }
    ];
    visibleColumns: string[] = this.columns.map(col => col.field);

    constructor(private fundService: FundService) { }

    ngOnInit() {
        this.fetchData(this.visibleColumns);
    }

    onVisibleColumnsChange(cols: string[]) {
        this.visibleColumns = cols;
        this.fetchData(this.visibleColumns);
    }

    fetchData(fields: string[]) {
        // If your API supports a fields param, use it. Otherwise, just fetch all and filter client-side.
        this.fundService.getAllFunds(/*{ fields }*/).subscribe({
            next: (res: any) => {
                this.data = res.data || res || [];
            },
            error: (error) => {
                // Set some mock data for testing
                this.data = [
                    { id: 1, name: 'Test Fund 1', fundingGroup: 'Group A', fundingSource_En: 'Source 1', fundingSource_Gu: 'સોર્સ 1', financialYear: '2023-24', grantValue: 100000, act: 'Act 1', isActive: true, createdBy: 'Admin', createdAt: new Date('2023-01-01'), modifiedBy: 'Admin', modifiedAt: new Date('2023-01-01') },
                    { id: 2, name: 'Test Fund 2', fundingGroup: 'Group B', fundingSource_En: 'Source 2', fundingSource_Gu: 'સોર્સ 2', financialYear: '2023-24', grantValue: 200000, act: 'Act 2', isActive: true, createdBy: 'Admin', createdAt: new Date('2023-01-02'), modifiedBy: 'Admin', modifiedAt: new Date('2023-01-02') },
                    { id: 3, name: 'Test Fund 3', fundingGroup: 'Group C', fundingSource_En: 'Source 3', fundingSource_Gu: 'સોર્સ 3', financialYear: '2023-24', grantValue: 300000, act: 'Act 3', isActive: false, createdBy: 'Admin', createdAt: new Date('2023-01-03'), modifiedBy: 'Admin', modifiedAt: new Date('2023-01-03') }
                ];
            }
        });
    }

    onDelete(row: Fund) {
        // Implement delete logic or open a confirmation dialog
        // Example: this.fundService.deleteFund(row.id).subscribe(...)
    }
}
