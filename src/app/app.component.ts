// src/app/app.component.ts

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { HeaderComponent } from './components/common/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent
  ],
  template: `
        <app-header></app-header>
        <div class="content-container">
            <router-outlet></router-outlet>
        </div>
    `,
  styles: [`
        .content-container {
            margin-top: 64px;
            padding: 20px;
            min-height: calc(100vh - 64px);
            background-color: #f5f7fa;
        }
    `]
})
export class AppComponent {
  constructor(public authService: AuthService) { }
}
