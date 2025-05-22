export interface MenuItem {
    id: string;
    label: string;
    icon?: string;
    route?: string;
    children?: MenuItem[];
    component?: string;
    addRoute?: string;
    editRoute?: string;
    viewRoute?: string;
    columns?: {
        field: string;
        label: string;
        type?: 'text' | 'number' | 'date' | 'boolean' | 'reference';
        referenceType?: string;
        validators?: {
            required?: boolean;
            min?: number;
            max?: number;
            pattern?: string;
            email?: boolean;
        };
        defaultValue?: any;
        options?: { value: any; label: string }[];
    }[];
}

export const MENU_CONFIG: MenuItem[] = [
    {
        id: 'master-data',
        label: 'Master Data',
        icon: 'database',
        children: [
            {
                id: 'sectors',
                label: 'Sectors',
                icon: 'category',
                route: '/tables/sectors/view',
                viewRoute: '/tables/sectors/view',
                addRoute: '/tables/sectors/add',
                editRoute: '/tables/sectors/edit',
                component: 'SectorViewComponent',
                columns: [
                    { field: 'id', label: 'ID', type: 'number', validators: { required: true } },
                    { field: 'name', label: 'Name', type: 'text', validators: { required: true } },
                    { field: 'description', label: 'Description', type: 'text' },
                    { field: 'isActive', label: 'Active', type: 'boolean', defaultValue: true },
                    { field: 'createdBy', label: 'Created By', type: 'text', validators: { required: true } },
                    { field: 'createdAt', label: 'Created At', type: 'date', validators: { required: true } },
                    { field: 'modifiedBy', label: 'Modified By', type: 'text' },
                    { field: 'modifiedAt', label: 'Modified At', type: 'date' }
                ]
            },
            {
                id: 'funds',
                label: 'Funds',
                icon: 'payments',
                route: '/tables/funds/view',
                viewRoute: '/tables/funds/view',
                addRoute: '/tables/funds/add',
                editRoute: '/tables/funds/edit',
                component: 'FundsViewComponent',
                columns: [
                    { field: 'id', label: 'ID', type: 'number', validators: { required: true } },
                    { field: 'name', label: 'Name', type: 'text', validators: { required: true } },
                    { field: 'fundingGroup', label: 'Funding Group', type: 'text', validators: { required: true } },
                    { field: 'fundingSource_En', label: 'Funding Source (En)', type: 'text', validators: { required: true } },
                    { field: 'fundingSource_Gu', label: 'Funding Source (Gu)', type: 'text', validators: { required: true } },
                    { field: 'financialYear', label: 'Financial Year', type: 'text', validators: { required: true } },
                    { field: 'grantValue', label: 'Grant Value', type: 'number', validators: { required: true, min: 0 } },
                    { field: 'act', label: 'Act', type: 'text', validators: { required: true } },
                    { field: 'isActive', label: 'Active', type: 'boolean', defaultValue: true },
                    { field: 'createdBy', label: 'Created By', type: 'text', validators: { required: true } },
                    { field: 'createdAt', label: 'Created At', type: 'date', validators: { required: true } },
                    { field: 'modifiedBy', label: 'Modified By', type: 'text' },
                    { field: 'modifiedAt', label: 'Modified At', type: 'date' }
                ]
            }
            // Add more menu items here
        ]
    }
    // Add more top-level menu items here
]; 