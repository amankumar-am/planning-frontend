// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { MENU_CONFIG } from './config/menu.config';
import { GenericFormComponent } from './components/common/generic-form/generic-form.component';

// Helper function to generate routes from menu config
function generateRoutesFromMenu(items: any[]): Routes {
    const routes: Routes = [];

    items.forEach(item => {
        if (item.route) {
            routes.push({
                path: item.route.substring(1), // Remove leading slash
                loadComponent: () => import(`./components/tables/${item.id}/${item.id}View.component`).then(m => m[item.component])
            });
        }

        if (item.addRoute) {
            routes.push({
                path: item.addRoute.substring(1),
                component: GenericFormComponent,
                data: {
                    menuItemId: item.id,
                    mode: 'add',
                    title: `Add ${item.label}`
                }
            });
        }

        if (item.editRoute) {
            routes.push({
                path: item.editRoute.substring(1) + '/:id',
                component: GenericFormComponent,
                data: {
                    menuItemId: item.id,
                    mode: 'edit',
                    title: `Edit ${item.label}`
                }
            });
        }

        if (item.children) {
            routes.push(...generateRoutesFromMenu(item.children));
        }
    });

    return routes;
}

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    ...generateRoutesFromMenu(MENU_CONFIG)
];
