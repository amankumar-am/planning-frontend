// src/app/config/menu.config.ts

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
        id: 'home',
        label: 'Home',
        icon: 'home',
        route: '/'
    },
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'dashboard',
        route: '/dashboard'
    },
    {
        id: 'tables',
        label: 'Tables',
        icon: 'table_chart',
        children: [
            {
                id: 'sectors',
                label: 'Sectors',
                icon: 'category',
                columns: [
                    { field: 'name', label: 'Name', type: 'text' },
                    { field: 'description', label: 'Description', type: 'text' }
                ],
                children: [
                    {
                        id: 'sectors-view',
                        label: 'View',
                        viewRoute: '/tables/sectors/view'
                    },
                    {
                        id: 'sectors-add',
                        label: 'Add',
                        addRoute: '/tables/sectors/add'
                    },
                    {
                        id: 'sectors-edit',
                        label: 'Edit',
                        editRoute: '/tables/sectors/edit'
                    }
                ]
            },
            {
                id: 'funds',
                label: 'Funds',
                icon: 'payments',
                columns: [
                    { field: 'name', label: 'Name', type: 'text' },
                    { field: 'amount', label: 'Amount', type: 'number' },
                    { field: 'description', label: 'Description', type: 'text' }
                ],
                children: [
                    {
                        id: 'funds-view',
                        label: 'View',
                        viewRoute: '/tables/funds/view'
                    },
                    {
                        id: 'funds-add',
                        label: 'Add',
                        addRoute: '/tables/funds/add'
                    },
                    {
                        id: 'funds-edit',
                        label: 'Edit',
                        editRoute: '/tables/funds/edit'
                    }
                ]
            },
            {
                id: 'districts',
                label: 'Districts',
                icon: 'location_city',
                columns: [
                    { field: 'name', label: 'Name', type: 'text' },
                    { field: 'code', label: 'Code', type: 'text' },
                    { field: 'description', label: 'Description', type: 'text' }
                ],
                children: [
                    {
                        id: 'districts-view',
                        label: 'View',
                        viewRoute: '/tables/districts/view'
                    },
                    {
                        id: 'districts-add',
                        label: 'Add',
                        addRoute: '/tables/districts/add'
                    },
                    {
                        id: 'districts-edit',
                        label: 'Edit',
                        editRoute: '/tables/districts/edit'
                    }
                ]
            },
            {
                id: 'talukas',
                label: 'Talukas',
                icon: 'location_on',
                columns: [
                    { field: 'name', label: 'Name', type: 'text' },
                    { field: 'district', label: 'District', type: 'reference', referenceType: 'districts' },
                    { field: 'description', label: 'Description', type: 'text' }
                ],
                children: [
                    {
                        id: 'talukas-view',
                        label: 'View',
                        viewRoute: '/tables/talukas/view'
                    },
                    {
                        id: 'talukas-add',
                        label: 'Add',
                        addRoute: '/tables/talukas/add'
                    },
                    {
                        id: 'talukas-edit',
                        label: 'Edit',
                        editRoute: '/tables/talukas/edit'
                    }
                ]
            }
        ]
    },
    {
        id: 'contact',
        label: 'Contact',
        icon: 'contact_support',
        route: '/contact'
    }
]; 