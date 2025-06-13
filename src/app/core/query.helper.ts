export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC'
}

export interface FilterObject {
    field: string;
    operator: 'eq' | 'like' | 'in' | 'gte' | 'lte' | 'ne' | 'isNull' | 'isNotNull';
    value: any;
}

export interface QueryOptions {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: SortOrder;
    search?: string;
    filters?: FilterObject[];
}

export class QueryHelper {

    // Filter builder methods
    static equals(field: string, value: any): FilterObject {
        return { field, operator: 'eq', value };
    }

    static notEquals(field: string, value: any): FilterObject {
        return { field, operator: 'ne', value };
    }

    static contains(field: string, value: string): FilterObject {
        return { field, operator: 'like', value };
    }

    static in(field: string, values: any[]): FilterObject {
        return { field, operator: 'in', value: values };
    }

    static greaterThanOrEqual(field: string, value: any): FilterObject {
        return { field, operator: 'gte', value };
    }

    static lessThanOrEqual(field: string, value: any): FilterObject {
        return { field, operator: 'lte', value };
    }

    static isNull(field: string): FilterObject {
        return { field, operator: 'isNull', value: null };
    }

    static isNotNull(field: string): FilterObject {
        return { field, operator: 'isNotNull', value: null };
    }

    // Convert frontend filters to backend filter format
    static convertFrontendFilters(frontendFilters: { [key: string]: any }): FilterObject[] {
        const backendFilters: FilterObject[] = [];

        Object.entries(frontendFilters).forEach(([field, filterValue]) => {
            if (filterValue === null || filterValue === undefined || filterValue === '') {
                return; // Skip empty filters
            }

            if (typeof filterValue === 'string') {
                // Case-insensitive string matching -> like operator
                backendFilters.push(this.contains(field, filterValue));
            } else if (typeof filterValue === 'boolean') {
                // Boolean exact match -> eq operator
                backendFilters.push(this.equals(field, filterValue));
            } else if (typeof filterValue === 'number') {
                // Number exact match -> eq operator
                backendFilters.push(this.equals(field, filterValue));
            } else if (Array.isArray(filterValue)) {
                // Array filter -> in operator
                backendFilters.push(this.in(field, filterValue));
            } else {
                // Exact match for other types -> eq operator
                backendFilters.push(this.equals(field, filterValue));
            }
        });

        return backendFilters;
    }

    // Build query parameters for API call
    static buildQueryParams(options: QueryOptions): { [key: string]: string } {
        const params: { [key: string]: string } = {};

        if (options.page) {
            params['page'] = options.page.toString();
        }

        if (options.limit) {
            params['limit'] = options.limit.toString();
        }

        if (options.sortBy) {
            params['sortBy'] = options.sortBy;
        }

        if (options.sortOrder) {
            params['sortOrder'] = options.sortOrder;
        }

        if (options.search) {
            params['search'] = options.search;
        }

        if (options.filters && options.filters.length > 0) {
            params['filters'] = JSON.stringify(options.filters);
        }

        return params;
    }

    // Convert frontend sort order to backend format
    static convertSortOrder(frontendSortOrder: 'asc' | 'desc'): SortOrder {
        return frontendSortOrder === 'desc' ? SortOrder.DESC : SortOrder.ASC;
    }
}

// Response interface for paginated results
export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

// Enhanced response interface for reference data
export interface ReferenceDataResponse<T> {
    success: boolean;
    message: string;
    data: T[];
    schema: any[];
    defaultVisibleColumns: string[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
} 