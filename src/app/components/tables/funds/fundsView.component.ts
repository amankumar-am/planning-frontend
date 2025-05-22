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
        this.fundService.getAllFunds(/*{ fields }*/).subscribe((res: any) => {
            this.data = res.data || [];
        });
    }

    onDelete(row: Fund) {
        // Implement delete logic or open a confirmation dialog
        // Example: this.fundService.deleteFund(row.id).subscribe(...)
    }
}
