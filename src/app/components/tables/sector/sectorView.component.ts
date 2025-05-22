// src/app/components/tables/sector/sectorView.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericTableComponent } from '../../common/generic-table/generic-table.component';
import { SectorService } from '../../../services/sector/sector.service';

@Component({
    selector: 'app-sector-view',
    standalone: true,
    imports: [CommonModule, GenericTableComponent],
    template: `
    <app-generic-table
      [data]="data"
      [columns]="columns"
      title="Sectors"
      [baseEditRoute]="'/tables/sectors/edit'"
      [addRoute]="'/tables/sectors/add'"
      [showAddButton]="true"
      (delete)="onDelete($event)"
      (visibleColumnsChange)="onVisibleColumnsChange($event)"
    ></app-generic-table>
  `
})
export class SectorViewComponent implements OnInit {
    data: any[] = [];
    columns = [
        { field: 'id', label: 'ID' },
        { field: 'name', label: 'Name' },
        { field: 'description', label: 'Description' }
        // Add more fields as needed
    ];
    visibleColumns: string[] = this.columns.map(col => col.field);

    constructor(private sectorService: SectorService) { }

    ngOnInit() {
        this.fetchData(this.visibleColumns);
    }

    onVisibleColumnsChange(cols: string[]) {
        this.visibleColumns = cols;
        this.fetchData(this.visibleColumns);
    }

    fetchData(fields: string[]) {
        // If your API supports a fields param, use it. Otherwise, just fetch all and filter client-side.
        this.sectorService.getAllSectors(/*{ fields }*/).subscribe((res: any) => {
            this.data = res.data || [];
        });
    }

    onDelete(row: any) {
        // Implement delete logic or open a confirmation dialog
        // Example: this.sectorService.deleteSector(row.id).subscribe(...)
    }
} 