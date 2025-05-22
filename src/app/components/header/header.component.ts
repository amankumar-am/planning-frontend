import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MENU_CONFIG, MenuItem } from '../../config/menu.config';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule
    ],
    template: `
    <mat-toolbar color="primary">
      <span>Planning System</span>
      <span class="spacer"></span>
      <ng-container *ngFor="let item of menuItems">
        <ng-container *ngIf="item.children">
          <button mat-button [matMenuTriggerFor]="menu">
            <mat-icon *ngIf="item.icon">{{ item.icon }}</mat-icon>
            {{ item.label }}
          </button>
          <mat-menu #menu="matMenu">
            <ng-container *ngFor="let child of item.children">
              <button mat-menu-item [routerLink]="child.route">
                <mat-icon *ngIf="child.icon">{{ child.icon }}</mat-icon>
                <span>{{ child.label }}</span>
              </button>
            </ng-container>
          </mat-menu>
        </ng-container>
        <ng-container *ngIf="!item.children">
          <button mat-button [routerLink]="item.route">
            <mat-icon *ngIf="item.icon">{{ item.icon }}</mat-icon>
            {{ item.label }}
          </button>
        </ng-container>
      </ng-container>
    </mat-toolbar>
  `,
    styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    mat-toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }
  `]
})
export class HeaderComponent {
    menuItems: MenuItem[] = MENU_CONFIG;
} 