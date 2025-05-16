// src/app/app.config.ts

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations'; // Import this
import { MATERIAL_PROVIDERS } from './components/materialConfig/material.module';
import { provideHttpClient } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    ...MATERIAL_PROVIDERS,
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'en-IN' },
  ],

};