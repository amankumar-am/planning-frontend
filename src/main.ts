import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLocaleData } from '@angular/common';
import localeEnIn from '@angular/common/locales/en-IN'; // or your desired locale

registerLocaleData(localeEnIn);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
