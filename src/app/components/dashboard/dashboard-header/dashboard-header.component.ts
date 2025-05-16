// src/app/components/dashboard/dashboard-header/dashboard-header.component.ts

import { Component, EventEmitter, Output } from '@angular/core';
import { MATERIAL_STANDALONE_IMPORTS } from '../../materialConfig/material.module';

@Component({
  selector: 'app-dashboard-header',
  imports: [...MATERIAL_STANDALONE_IMPORTS],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.scss'
})
export class DashboardHeaderComponent {
  @Output() toggleSidenav = new EventEmitter<void>();

  onToggleSidenav() {
    this.toggleSidenav.emit();
  }
}
