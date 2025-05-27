// src/app/components/tables/generic-view/generic-view.component.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, Sort, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { MENU_CONFIG, MenuItem } from '../../../config/menu.config';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-generic-view',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        RouterLink
    ],
    template: `
        <div class="container">
            <div class="header">
                <h1>{{ title }}</h1>
                <button mat-raised-button color="primary" [routerLink]="addRoute">
                    <mat-icon>add</mat-icon>
                    Add New
                </button>
            </div>

            <mat-table [dataSource]="dataSource" matSort>
                <ng-container *ngFor="let column of columns" [matColumnDef]="column.field">
                    <mat-header-cell *matHeaderCellDef mat-sort-header>{{ column.label }}</mat-header-cell>
                    <mat-cell *matCellDef="let element">
                        <ng-container [ngSwitch]="column.type">
                            <ng-container *ngSwitchCase="'reference'">
                                {{ getReferenceLabel(element[column.field]) }}
                            </ng-container>
                            <ng-container *ngSwitchDefault>
                                {{ element[column.field] }}
                            </ng-container>
                        </ng-container>
                    </mat-cell>
                </ng-container>

                <ng-container matColumnDef="actions">
                    <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
                    <mat-cell *matCellDef="let element">
                        <button mat-icon-button [matMenuTriggerFor]="menu">
                            <mat-icon>more_vert</mat-icon>
                        </button>
                        <mat-menu #menu="matMenu">
                            <button mat-menu-item [routerLink]="[editRoute, element.id]">
                                <mat-icon>edit</mat-icon>
                                <span>Edit</span>
                            </button>
                            <button mat-menu-item (click)="onDelete(element)">
                                <mat-icon>delete</mat-icon>
                                <span>Delete</span>
                            </button>
                        </mat-menu>
                    </mat-cell>
                </ng-container>

                <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
                <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
            </mat-table>

            <mat-paginator
                [pageSize]="10"
                [pageSizeOptions]="[5, 10, 25, 100]"
                (page)="onPageChange($event)"
                aria-label="Select page">
            </mat-paginator>
        </div>
    `,
    styles: [`
        .container {
            padding: 20px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;

            h1 {
                margin: 0;
                color: #2c3e50;
            }
        }

        mat-table {
            width: 100%;
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        mat-header-cell {
            background-color: #f5f7fa;
            color: #2c3e50;
            font-weight: 600;
        }

        mat-row:hover {
            background-color: #f8f9fa;
        }

        .mat-column-actions {
            width: 120px;
            text-align: center;
        }
    `]
})
export class GenericViewComponent implements OnInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    title: string = '';
    columns: any[] = [];
    displayedColumns: string[] = [];
    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    addRoute: string = '';
    editRoute: string = '';
    parentMenuItem: MenuItem | undefined;

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        const menuItemId = this.route.snapshot.data['menuItemId'];
        const menuItem = this.findMenuItem(MENU_CONFIG, menuItemId);

        if (menuItem) {
            // Find the parent menu item to get the columns
            this.parentMenuItem = this.findParentMenuItem(MENU_CONFIG, menuItemId);

            if (this.parentMenuItem) {
                this.title = this.parentMenuItem.label;
                this.columns = this.parentMenuItem.columns || [];
                this.displayedColumns = [...this.columns.map(col => col.field), 'actions'];
                this.addRoute = menuItem.addRoute || '';
                this.editRoute = menuItem.editRoute?.split('/:')[0] || '';

                // TODO: Load data from service
                this.loadData();
            }
        }
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    private findMenuItem(items: MenuItem[], id: string): MenuItem | undefined {
        for (const item of items) {
            if (item.id === id) {
                return item;
            }
            if (item.children) {
                const found = this.findMenuItem(item.children, id);
                if (found) return found;
            }
        }
        return undefined;
    }

    private findParentMenuItem(items: MenuItem[], childId: string): MenuItem | undefined {
        for (const item of items) {
            if (item.children) {
                const child = item.children.find(c => c.id === childId);
                if (child) return item;
                const found = this.findParentMenuItem(item.children, childId);
                if (found) return found;
            }
        }
        return undefined;
    }

    private loadData() {
        // TODO: Implement data loading from service
        // For now, using mock data
        const mockData = [
            { id: 1, name: 'Test 1', description: 'Description 1' },
            { id: 2, name: 'Test 2', description: 'Description 2' },
            { id: 3, name: 'Test 3', description: 'Description 3' }
        ];
        this.dataSource.data = mockData;
    }

    getReferenceLabel(value: any): string {
        // TODO: Implement reference label lookup
        return value?.name || value;
    }

    onPageChange(event: PageEvent) {
        // TODO: Implement pagination
    }

    onDelete(element: any) {
        // TODO: Implement delete functionality
        console.log('Delete', element);
    }
} 