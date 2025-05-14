// src/app/services/shared/base-reference-utils.service.ts
import { HttpErrorResponse } from '@angular/common/http';

export interface ReferenceSchema<T> {
    field: keyof T;
    label: string;
}

export abstract class BaseReferenceUtilsService<T> {
    items: T[] = [];
    schema: ReferenceSchema<T>[] = [];
    selectedItem: T | null = null;
    labelField = 'Reference';
    defaultVisibleColumns: string[] = [];

    protected abstract fetchAllItems(): Promise<{ data: T[]; schema: ReferenceSchema<T>[], defaultVisibleColumns: string[] }>;

    async loadItems(): Promise<void> {
        try {
            const result = await this.fetchAllItems();
            this.items = result.data || [];
            this.schema = result.schema || [];
            this.defaultVisibleColumns = result.defaultVisibleColumns || [];
        } catch (err) {
            console.error('Failed to load items:', err);
            if (err instanceof HttpErrorResponse) {
                console.error('Error details:', {
                    status: err.status,
                    statusText: err.statusText,
                    message: err.message,
                    url: err.url
                });
            }
            this.items = [];
            this.schema = [];
        }
    }

    onSelectedItemChange(item: T | null): void {
        this.selectedItem = item;
    }

    getSelectedItem(): T | null {
        return this.selectedItem;
    }

    getLabelField(): string {
        return this.labelField;
    }

    getDataFetcher(): () => Promise<{ data: T[]; schema: ReferenceSchema<T>[], defaultVisibleColumns: string[] }> {
        return async () => {
            await this.loadItems();
            return {
                data: this.items,
                schema: this.schema,
                defaultVisibleColumns: this.defaultVisibleColumns
            };
        };
    }
}
