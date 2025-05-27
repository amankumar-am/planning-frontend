import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MENU_CONFIG, MenuItem } from '../../config/menu.config';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [
        CommonModule,
        MatListModule,
        MatIconModule,
        MatExpansionModule,
        RouterLink
    ],
    template: `
        <mat-nav-list>
            <ng-container *ngFor="let item of menuItems">
                <ng-container *ngIf="item.children">
                    <mat-expansion-panel>
                        <mat-expansion-panel-header>
                            <mat-panel-title>
                                <mat-icon *ngIf="item.icon">{{item.icon}}</mat-icon>
                                {{item.label}}
                            </mat-panel-title>
                        </mat-expansion-panel-header>
                        <mat-nav-list>
                            <a mat-list-item *ngFor="let child of item.children" 
                               [routerLink]="child.route"
                               routerLinkActive="active">
                                <mat-icon *ngIf="child.icon">{{child.icon}}</mat-icon>
                                {{child.label}}
                            </a>
                        </mat-nav-list>
                    </mat-expansion-panel>
                </ng-container>
                <a mat-list-item *ngIf="!item.children && item.route" 
                   [routerLink]="item.route"
                   routerLinkActive="active">
                    <mat-icon *ngIf="item.icon">{{item.icon}}</mat-icon>
                    {{item.label}}
                </a>
            </ng-container>
        </mat-nav-list>
    `,
    styles: [`
        :host {
            display: block;
            width: 250px;
            height: 100%;
            background-color: white;
            border-right: 1px solid rgba(0, 0, 0, 0.12);
        }

        mat-nav-list {
            padding-top: 0;
        }

        mat-expansion-panel {
            box-shadow: none;
            border-radius: 0;
            background: transparent;
        }

        mat-expansion-panel-header {
            padding: 0 16px;
        }

        mat-panel-title {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        mat-icon {
            margin-right: 8px;
        }

        .active {
            background-color: rgba(0, 0, 0, 0.04);
        }

        a[mat-list-item] {
            height: 48px;
        }
    `]
})
export class MenuComponent implements OnInit {
    menuItems: MenuItem[] = MENU_CONFIG;

    constructor(private router: Router) { }

    ngOnInit(): void { }
} 