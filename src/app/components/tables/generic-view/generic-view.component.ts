// src/app/components/tables/generic-view/generic-view.component.ts

import { Component, OnInit, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MENU_CONFIG, MenuItem } from '../../../config/menu.config';
import { GenericTableComponent } from '../../common/generic-table/generic-table.component';

// Import all the services
import { SectorService } from '../../../services/sector/sector.service';
import { FundService } from '../../../services/fund/fund.service';
import { DistrictService } from '../../../services/district/district.service';
import { TalukaService } from '../../../services/taluka/taluka.service';
import { GpVillageService } from '../../../services/gp-village/gp-village.service';

@Component({
    selector: 'app-generic-view',
    standalone: true,
    imports: [
        CommonModule,
        GenericTableComponent
    ],
    template: `
        <app-generic-table
            [data]="data"
            [columns]="columns"
            [title]="title"
            [baseEditRoute]="editRoute"
            [addRoute]="addRoute"
            [showAddButton]="true"
            [pageSizeOptions]="[5, 10, 25, 50, 100]"
            [defaultPageSize]="10"
            [storageKey]="storageKey"
            [defaultVisibleColumns]="defaultVisibleColumns"
            (delete)="onDelete($event)"
            (visibleColumnsChange)="onVisibleColumnsChange($event)">
        </app-generic-table>
    `,
    styles: [`
        :host {
            display: block;
            padding: 20px;
        }
    `]
})
export class GenericViewComponent implements OnInit {
    title: string = '';
    columns: any[] = [];
    data: any[] = [];
    addRoute: string = '';
    editRoute: string = '';
    storageKey: string = '';
    parentMenuItem: MenuItem | undefined;
    visibleColumns: string[] = [];
    loading: boolean = false;
    defaultVisibleColumns: string[] = [];

    // Service mapping based on menu item ID
    private serviceMapping: { [key: string]: any } = {};

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private injector: Injector,
        private sectorService: SectorService,
        private fundService: FundService,
        private districtService: DistrictService,
        private talukaService: TalukaService,
        private gpVillageService: GpVillageService
    ) {
        // Initialize service mapping
        this.serviceMapping = {
            'sectors': this.sectorService,
            'funds': this.fundService,
            'districts': this.districtService,
            'talukas': this.talukaService,
            'gpVillages': this.gpVillageService,
            'villages': this.gpVillageService, // alias
        };
    }

    ngOnInit() {
        const menuItemId = this.route.snapshot.data['menuItemId'];
        const menuItem = this.findMenuItem(MENU_CONFIG, menuItemId);

        if (menuItem) {
            // Find the parent menu item to get the columns
            this.parentMenuItem = this.findParentMenuItem(MENU_CONFIG, menuItemId);

            if (this.parentMenuItem) {
                this.title = this.parentMenuItem.label;

                // Set initial columns from MENU_CONFIG, but we'll update them when data loads
                this.columns = this.parentMenuItem.columns || [];

                this.addRoute = menuItem.addRoute || '';
                this.editRoute = menuItem.editRoute?.split('/:')[0] || '';
                this.storageKey = `generic_view_${menuItemId}`;

                // Load real data from service
                this.loadDataFromService();
            }
        } else {
            console.error('Menu item not found for ID:', menuItemId);
        }
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

    private loadDataFromService() {
        if (!this.parentMenuItem) {
            return;
        }

        this.loading = true;

        // Get the appropriate service based on the parent menu item ID
        const service = this.getServiceForMenuItem(this.parentMenuItem.id);

        if (!service) {
            this.loading = false;
            return;
        }

        // Call the appropriate method to fetch all data
        const methodName = this.getServiceMethodName(this.parentMenuItem.id);
        const serviceMethod = service[methodName];

        if (!serviceMethod) {
            this.loading = false;
            return;
        }

        serviceMethod.call(service).subscribe({
            next: (response: any) => {
                let newColumns = this.columns; // Keep existing columns as default
                let newDefaultVisibleColumns: string[] = [];

                // Handle different response formats and discover columns
                if (response?.data) {
                    this.data = response.data;
                    // Extract defaultVisibleColumns from response
                    if (response.defaultVisibleColumns && Array.isArray(response.defaultVisibleColumns)) {
                        newDefaultVisibleColumns = response.defaultVisibleColumns;
                    }

                    // Use schema from response if available
                    if (response.schema && Array.isArray(response.schema)) {
                        newColumns = this.mapSchemaToColumns(response.schema);
                    } else if (this.data.length > 0) {
                        // Auto-discover columns from the actual data if MENU_CONFIG is limited
                        const menuConfigColumns = this.parentMenuItem?.columns || [];
                        if (menuConfigColumns.length <= 2) {
                            newColumns = this.autoDiscoverColumns(this.data[0]);
                        }
                    }
                } else if (Array.isArray(response)) {
                    this.data = response;

                    // Auto-discover columns from the actual data
                    if (this.data.length > 0) {
                        const menuConfigColumns = this.parentMenuItem?.columns || [];
                        if (menuConfigColumns.length <= 2) {
                            newColumns = this.autoDiscoverColumns(this.data[0]);
                        }
                    }
                } else {
                    this.data = [];
                }

                // Update columns only if they changed
                if (JSON.stringify(newColumns) !== JSON.stringify(this.columns)) {
                    this.columns = [...newColumns]; // Create new array reference to trigger change detection
                }

                // Update defaultVisibleColumns
                this.defaultVisibleColumns = newDefaultVisibleColumns;

                this.loading = false;
            },
            error: (error: any) => {
                this.loading = false;

                // Fallback to empty array
                this.data = [];
                this.defaultVisibleColumns = [];

                // Optionally show user-friendly error message
                // You could emit an event or show a snackbar here
            }
        });
    }

    private getServiceForMenuItem(menuItemId: string): any {
        // Map menu item IDs to services
        const serviceMap: { [key: string]: any } = {
            'sectors': this.sectorService,
            'funds': this.fundService,
            'districts': this.districtService,
            'talukas': this.talukaService,
            'gpVillages': this.gpVillageService,
            'villages': this.gpVillageService,
        };

        return serviceMap[menuItemId];
    }

    private getServiceMethodName(menuItemId: string): string {
        // Map menu item IDs to their service method names
        const methodMap: { [key: string]: string } = {
            'sectors': 'getAllSectors',
            'funds': 'getAllFunds',
            'districts': 'getAllDistricts',
            'talukas': 'getAllTalukas',
            'gpVillages': 'getAllGpVillages',
            'villages': 'getAllGpVillages',
        };

        return methodMap[menuItemId] || 'getAll';
    }

    onVisibleColumnsChange(columns: string[]) {
        this.visibleColumns = columns;

        // TODO: If you need to reload data with only visible columns for performance
        // You could implement selective data loading here
    }

    onDelete(element: any) {
        if (!this.parentMenuItem) {
            return;
        }

        // Show confirmation dialog
        const itemName = element.name || element.nameEn || element.id;
        const confirmed = confirm(`Are you sure you want to delete "${itemName}"?`);

        if (confirmed) {
            const service = this.getServiceForMenuItem(this.parentMenuItem.id);
            const deleteMethodName = this.getDeleteMethodName(this.parentMenuItem.id);

            if (service && service[deleteMethodName]) {
                service[deleteMethodName].call(service, element.id).subscribe({
                    next: () => {
                        // Remove from local data immediately for better UX
                        const index = this.data.findIndex(item => item.id === element.id);
                        if (index > -1) {
                            this.data.splice(index, 1);
                            this.data = [...this.data]; // Trigger change detection
                        }

                        // Optionally show success message
                        // You could emit an event or show a snackbar here
                    },
                    error: (error: any) => {
                        // Optionally show error message
                        alert('Error deleting item. Please try again.');
                    }
                });
            } else {
                alert('Delete functionality not available for this item type.');
            }
        }
    }

    private getDeleteMethodName(menuItemId: string): string {
        // Map menu item IDs to their delete method names
        const deleteMethodMap: { [key: string]: string } = {
            'sectors': 'deleteSector',
            'funds': 'deleteFund',
            'districts': 'deleteDistrict',
            'talukas': 'deleteTaluka',
            'gpVillages': 'deleteGpVillage',
            'villages': 'deleteGpVillage',
        };

        return deleteMethodMap[menuItemId] || 'delete';
    }

    private mapSchemaToColumns(schema: any[]): any[] {
        return schema.map(schemaItem => ({
            field: schemaItem.field || schemaItem.name,
            label: schemaItem.label || this.formatFieldName(schemaItem.field || schemaItem.name),
            type: schemaItem.type || 'text'
        }));
    }

    private autoDiscoverColumns(sampleData: any): any[] {
        if (!sampleData) return this.columns; // Return existing columns if no sample data

        // Get all properties from the sample data
        const discoveredFields = Object.keys(sampleData);

        // Create columns from discovered fields
        return discoveredFields.map(field => ({
            field: field,
            label: this.formatFieldName(field),
            type: this.guessFieldType(sampleData[field])
        }));
    }

    private formatFieldName(field: string): string {
        // Convert camelCase/snake_case to readable labels
        return field
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .replace(/_/g, ' ') // Replace underscores with spaces
            .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
            .trim();
    }

    private guessFieldType(value: any): string {
        if (value === null || value === undefined) return 'text';

        if (typeof value === 'boolean') return 'boolean';
        if (typeof value === 'number') return 'number';
        if (value instanceof Date) return 'date';
        if (typeof value === 'string') {
            // Check if it looks like a date string
            if (value.match(/^\d{4}-\d{2}-\d{2}/) || value.includes('T')) {
                return 'date';
            }
        }

        return 'text';
    }
} 