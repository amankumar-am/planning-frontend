// src/app/services/shared/base-reference-utils.service.ts
import { HttpErrorResponse } from '@angular/common/http';
import { QueryOptions, QueryHelper, FilterObject, SortOrder } from '../../core/query.helper';

export interface ReferenceSchema<T> {
    field: keyof T;
    label: string;
}

export interface QueryableOptions {
    filters?: { [key: string]: any };
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    dependsOn?: { field: string; value: any };
    search?: string;
    page?: number;
    limit?: number;
}

export abstract class BaseReferenceUtilsService<T> {
    items: T[] = [];
    schema: ReferenceSchema<T>[] = [];
    selectedItem: T | null = null;
    labelField = 'Reference';
    defaultVisibleColumns: string[] = [];

    // Abstract methods - to be implemented by child classes
    protected abstract fetchAllItems(): Promise<{ data: T[]; schema: ReferenceSchema<T>[], defaultVisibleColumns: string[] }>;

    // Optional method for query support - can be overridden by child classes
    protected async fetchItemsWithQuery(options: QueryOptions): Promise<{ data: T[]; schema: ReferenceSchema<T>[], defaultVisibleColumns: string[] }> {
        // Default implementation falls back to fetchAllItems and applies frontend filtering
        console.warn(`${this.constructor.name} does not implement fetchItemsWithQuery. Using fallback with frontend filtering.`);
        const result = await this.fetchAllItems();

        // Apply basic frontend filtering as fallback
        let filteredData = result.data;

        if (options.filters && options.filters.length > 0) {
            filteredData = this.applyFrontendFilters(filteredData, options.filters);
        }

        // Apply basic frontend sorting as fallback
        if (options.sortBy) {
            filteredData = this.applyFrontendSorting(filteredData, options.sortBy, options.sortOrder);
        }

        return {
            data: filteredData,
            schema: result.schema,
            defaultVisibleColumns: result.defaultVisibleColumns
        };
    }

    // Legacy method for backward compatibility
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

    // New method for querying with filters, sorting, etc.
    async loadItemsWithQuery(options: QueryableOptions = {}): Promise<{ data: T[]; schema: ReferenceSchema<T>[], defaultVisibleColumns: string[] }> {
        try {
            // Convert frontend options to backend query options
            const queryOptions: QueryOptions = this.convertToQueryOptions(options);

            const result = await this.fetchItemsWithQuery(queryOptions);

            // Update internal state for backward compatibility
            this.items = result.data || [];
            this.schema = result.schema || [];
            this.defaultVisibleColumns = result.defaultVisibleColumns || [];

            return result;
        } catch (err) {
            console.warn(`Backend query failed for ${this.constructor.name}, falling back to frontend filtering:`, err);

            // Fallback to fetchAllItems and apply frontend filtering
            try {
                const result = await this.fetchAllItems();

                // Apply frontend filtering and sorting
                let filteredData = result.data || [];

                // Convert frontend options to filters for frontend processing
                if (options.filters && Object.keys(options.filters).length > 0) {
                    const frontendFilters = Object.entries(options.filters).map(([field, value]) => ({
                        field,
                        operator: 'eq' as const,
                        value
                    }));
                    filteredData = this.applyFrontendFilters(filteredData, frontendFilters);
                }

                // Apply dependency filtering
                if (options.dependsOn) {
                    const dependencyFilter = [{
                        field: options.dependsOn.field,
                        operator: 'eq' as const,
                        value: options.dependsOn.value
                    }];
                    filteredData = this.applyFrontendFilters(filteredData, dependencyFilter);
                }

                // Apply frontend sorting
                if (options.sortBy) {
                    const sortOrder = options.sortOrder === 'desc' ? SortOrder.DESC : SortOrder.ASC;
                    filteredData = this.applyFrontendSorting(filteredData, options.sortBy, sortOrder);
                }

                // Apply search filtering
                if (options.search) {
                    const searchTerm = options.search.toLowerCase();
                    filteredData = filteredData.filter(item => {
                        return Object.values(item as any).some(value =>
                            String(value).toLowerCase().includes(searchTerm)
                        );
                    });
                }

                const fallbackResult = {
                    data: filteredData,
                    schema: result.schema || [],
                    defaultVisibleColumns: result.defaultVisibleColumns || []
                };

                // Update internal state for backward compatibility
                this.items = fallbackResult.data;
                this.schema = fallbackResult.schema;
                this.defaultVisibleColumns = fallbackResult.defaultVisibleColumns;

                return fallbackResult;
            } catch (fallbackErr) {
                console.error('Both backend query and frontend fallback failed:', fallbackErr);
                const emptyResult = { data: [], schema: [], defaultVisibleColumns: [] };
                this.items = [];
                this.schema = [];
                this.defaultVisibleColumns = [];
                return emptyResult;
            }
        }
    }

    // Convert frontend options to backend query format
    private convertToQueryOptions(options: QueryableOptions): QueryOptions {
        const queryOptions: QueryOptions = {
            page: options.page || 1,
            limit: options.limit || 1000, // Default large limit for reference data
        };

        // Convert filters
        if (options.filters && Object.keys(options.filters).length > 0) {
            queryOptions.filters = QueryHelper.convertFrontendFilters(options.filters);
        }

        // Add dependency filter if present
        if (options.dependsOn) {
            if (!queryOptions.filters) {
                queryOptions.filters = [];
            }
            queryOptions.filters.push(QueryHelper.equals(options.dependsOn.field, options.dependsOn.value));
        }

        // Convert sorting
        if (options.sortBy) {
            queryOptions.sortBy = options.sortBy;
            queryOptions.sortOrder = QueryHelper.convertSortOrder(options.sortOrder || 'asc');
        }

        // Add search
        if (options.search) {
            queryOptions.search = options.search;
        }

        return queryOptions;
    }

    // Fallback frontend filtering for services that don't implement backend query
    private applyFrontendFilters(data: T[], filters: FilterObject[]): T[] {
        return data.filter(item => {
            return filters.every(filter => {
                const itemValue = this.getFieldValue(item, filter.field);

                switch (filter.operator) {
                    case 'eq':
                        return itemValue === filter.value;
                    case 'ne':
                        return itemValue !== filter.value;
                    case 'like':
                        return String(itemValue).toLowerCase().includes(String(filter.value).toLowerCase());
                    case 'in':
                        return Array.isArray(filter.value) && filter.value.includes(itemValue);
                    case 'gte':
                        return itemValue >= filter.value;
                    case 'lte':
                        return itemValue <= filter.value;
                    case 'isNull':
                        return itemValue === null || itemValue === undefined;
                    case 'isNotNull':
                        return itemValue !== null && itemValue !== undefined;
                    default:
                        return true;
                }
            });
        });
    }

    // Fallback frontend sorting for services that don't implement backend query
    private applyFrontendSorting(data: T[], sortBy: string, sortOrder?: SortOrder): T[] {
        return [...data].sort((a, b) => {
            const aValue = this.getFieldValue(a, sortBy);
            const bValue = this.getFieldValue(b, sortBy);

            // Handle null/undefined values
            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return sortOrder === SortOrder.ASC ? 1 : -1;
            if (bValue == null) return sortOrder === SortOrder.ASC ? -1 : 1;

            // Convert to strings for comparison if needed
            const aStr = String(aValue);
            const bStr = String(bValue);

            let comparison = 0;
            if (aStr < bStr) {
                comparison = -1;
            } else if (aStr > bStr) {
                comparison = 1;
            }

            return sortOrder === SortOrder.DESC ? -comparison : comparison;
        });
    }

    // Helper method to get field value from an object (supports dot notation)
    private getFieldValue(item: T, fieldName: string): any {
        if (fieldName.includes('.')) {
            return fieldName.split('.').reduce((obj, key) => obj?.[key as keyof typeof obj], item as any);
        }
        return (item as any)[fieldName];
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

    // Updated data fetcher that supports query options
    getDataFetcher(): (options?: QueryableOptions) => Promise<{ data: T[]; schema: ReferenceSchema<T>[], defaultVisibleColumns: string[] }> {
        return async (options?: QueryableOptions) => {
            if (options && Object.keys(options).length > 0) {
                // Use new query method if options are provided
                return await this.loadItemsWithQuery(options);
            } else {
                // Fallback to legacy method for backward compatibility
                await this.loadItems();
                return {
                    data: this.items,
                    schema: this.schema,
                    defaultVisibleColumns: this.defaultVisibleColumns
                };
            }
        };
    }
}
