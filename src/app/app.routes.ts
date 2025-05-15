// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StepperComponent } from './components/common/stepper/stepper.component';

export const routes: Routes = [
    { path: '', component: StepperComponent },
    { path: 'dashboard', component: DashboardComponent }
];
