// src/app/components/dashboard/dashboard.component.ts

import { Component, HostListener, OnInit, ViewChild } from '@angular/core'; // Added OnInit
import { DashboardHeaderComponent } from "./dashboard-header/dashboard-header.component";
import { OverallDataComponent } from "./overall-data/overall-data.component";
import { TabsComponent } from "./tabs/tabs.component";

import { Ps1UtilsService } from '../../services/ps1/ps1-utils.service';
import { Observable } from 'rxjs';
import { DashboardData } from '../../services/ps1/ps1.service'; // Import DashboardData type
import { MATERIAL_STANDALONE_IMPORTS } from '../materialConfig/material.module';
import { MatSidenav } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  standalone: true, // Assuming it's standalone
  imports: [CommonModule, OverallDataComponent, TabsComponent, ...MATERIAL_STANDALONE_IMPORTS], // Added missing imports
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'] // Corrected styleUrl to styleUrls
})
export class DashboardComponent implements OnInit {
  selectedFinancialYearId: string | null = null;
  dashboardData$: Observable<DashboardData>;
  isLoading$: Observable<boolean>;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isSidenavOpen: boolean = window.innerWidth > 768; // Open by default on larger screens

  constructor(private ps1UtilsService: Ps1UtilsService) {
    this.dashboardData$ = this.ps1UtilsService.data$;
    this.isLoading$ = this.ps1UtilsService.loading$;
  }

  ngOnInit() {
    // No initial data fetch here directly.
    // The FinancialYearSelectorComponent will emit its default selection,
    // which will trigger onYearSelected.
  }

  onFinancialYearSelectedFromOverall(yearId: string) {
    this.selectedFinancialYearId = yearId;
    // Now trigger the fetch for year-specific data in TabsComponent (or its underlying data source)
    if (this.selectedFinancialYearId) {
      this.ps1UtilsService.fetchPs1DashboardData(this.selectedFinancialYearId);
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isSidenavOpen = window.innerWidth > 768;
    if (!this.isSidenavOpen) {
      this.sidenav.close();
    } else {
      this.sidenav.open();
    }
  }
  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
    this.sidenav.toggle();
  }
}