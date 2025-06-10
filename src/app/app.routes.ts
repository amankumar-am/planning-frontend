// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { MENU_CONFIG } from './config/menu.config';
import { GenericFormComponent } from './components/common/generic-form/generic-form.component';
import { GenericViewComponent } from './components/tables/generic-view/generic-view.component';
import { AuthGuard } from './guards/auth.guard';

// Helper function to generate routes from menu config
function generateRoutesFromMenu(items: any[]): Routes {
    const routes: Routes = [];

    items.forEach(item => {
        if (item.viewRoute) {
            routes.push({
                path: item.viewRoute.substring(1), // Remove leading slash
                component: GenericViewComponent,
                data: {
                    menuItemId: item.id
                },
                canActivate: [AuthGuard]
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
                },
                canActivate: [AuthGuard]
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
                },
                canActivate: [AuthGuard]
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
        path: 'login',
        loadComponent: () => import('./components/common/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./components/common/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'stepper',
        loadComponent: () => import('./components/common/stepper/stepper.component').then(m => m.StepperComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'form',
        loadComponent: () => import('./components/common/stepper/stepper.component').then(m => m.StepperComponent),
        canActivate: [AuthGuard]
    },
    ...generateRoutesFromMenu(MENU_CONFIG)
];
