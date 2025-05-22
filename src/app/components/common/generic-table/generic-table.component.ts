// src/app/components/common/generic-table/generic-table.component.ts

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MATERIAL_STANDALONE_IMPORTS } from '../../materialConfig/material.module';

@Component({
    selector: 'app-generic-table',
    standalone: true,
    imports: [
        CommonModule,
        ...MATERIAL_STANDALONE_IMPORTS,
        FormsModule
    ],
    templateUrl: './generic-table.component.html',
    styleUrls: ['./generic-table.component.scss']
})
export class GenericTableComponent implements OnInit {
    @Input() data: any[] = [];
    @Input() columns: { field: string; label: string }[] = [];
    @Input() title: string = '';
    @Input() pageSizeOptions: number[] = [10, 25, 50];
    @Input() defaultPageSize: number = 10;
    @Input() baseEditRoute: string = '';
    @Input() baseDeleteRoute: string = '';
    @Input() showAddButton: boolean = true;
    @Input() addRoute: string = '';
    @Input() storageKey?: string;

    @Output() delete = new EventEmitter<any>();
    @Output() visibleColumnsChange = new EventEmitter<string[]>();

    searchTerm: string = '';
    displayedColumns: string[] = [];
    allColumnFields: string[] = [];
    visibleColumns: string[] = [];
    pageIndex: number = 0;
    pageSize: number = this.defaultPageSize;
    sort: Sort = { active: '', direction: '' };

    ngOnInit() {
        this.allColumnFields = this.columns.map(col => col.field);
        this.visibleColumns = this.getInitialVisibleColumns();
        this.updateDisplayedColumns();
        this.visibleColumnsChange.emit(this.visibleColumns);
    }

    getInitialVisibleColumns(): string[] {
        const key = this.getStorageKey();
        const saved = localStorage.getItem(key);
        if (saved) {
            const parsed = JSON.parse(saved);
            return parsed.filter((col: string) => this.allColumnFields.includes(col));
        }
        return [...this.allColumnFields];
    }

    getStorageKey(): string {
        if (this.storageKey) return this.storageKey;
        const fields = this.allColumnFields.sort().join(',');
        let hash = 0;
        for (let i = 0; i < fields.length; i++) {
            hash = ((hash << 5) - hash) + fields.charCodeAt(i);
            hash |= 0;
        }
        return `generic_table_visible_columns_${hash}`;
    }

    onToggleColumn(field: string) {
        const idx = this.visibleColumns.indexOf(field);
        if (idx > -1) {
            if (this.visibleColumns.length > 1) {
                this.visibleColumns.splice(idx, 1);
            } else {
                alert('At least one column must remain selected.');
            }
        } else {
            this.visibleColumns.push(field);
        }
        this.saveVisibleColumns();
        this.updateDisplayedColumns();
    }

    saveVisibleColumns() {
        localStorage.setItem(this.getStorageKey(), JSON.stringify(this.visibleColumns));
        this.visibleColumnsChange.emit(this.visibleColumns);
    }

    updateDisplayedColumns() {
        this.displayedColumns = ['action', ...this.visibleColumns];
    }

    get filteredData() {
        let filtered = this.data;
        if (this.searchTerm) {
            filtered = filtered.filter(row =>
                this.visibleColumns.some(col =>
                    String(row[col]).toLowerCase().includes(this.searchTerm.toLowerCase())
                )
            );
        }
        if (this.sort.active && this.sort.direction) {
            filtered = [...filtered].sort((a, b) => {
                const aValue = a[this.sort.active];
                const bValue = b[this.sort.active];
                if (aValue == null) return 1;
                if (bValue == null) return -1;
                if (aValue === bValue) return 0;
                return (aValue > bValue ? 1 : -1) * (this.sort.direction === 'asc' ? 1 : -1);
            });
        }
        return filtered;
    }

    get pagedData() {
        const start = this.pageIndex * this.pageSize;
        return this.filteredData.slice(start, start + this.pageSize);
    }

    onPage(event: PageEvent) {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
    }

    onSort(event: Sort) {
        this.sort = event;
    }

    onEdit(row: any) {
        if (this.baseEditRoute) {
            window.location.href = `${this.baseEditRoute}/${row.id}`;
        }
    }

    onDelete(row: any) {
        this.delete.emit(row);
    }

    onAdd() {
        if (this.addRoute) {
            window.location.href = this.addRoute;
        }
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.searchTerm = filterValue.trim().toLowerCase();
        this.updateDisplayedColumns();
    }
} 