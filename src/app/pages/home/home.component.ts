// src/app/pages/home/home.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatButtonModule,
        MatIconModule,
        MatCardModule
    ]
})
export class HomeComponent {
    features = [
        {
            icon: 'category',
            title: 'Sectors',
            description: 'Manage and organize different sectors efficiently'
        },
        {
            icon: 'payments',
            title: 'Funds',
            description: 'Track and manage financial resources'
        },
        {
            icon: 'location_city',
            title: 'Districts',
            description: 'Organize geographical districts'
        },
        {
            icon: 'location_on',
            title: 'Talukas',
            description: 'Manage taluka-level information'
        }
    ];
} 