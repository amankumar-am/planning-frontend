// src/app/components/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { OverallDataComponent } from "./overall-data/overall-data.component";
import { TabsComponent } from "./tabs/tabs.component";
import { Ps1UtilsService } from '../../services/ps1/ps1-utils.service';
import { Observable } from 'rxjs';
import { DashboardData } from '../../services/ps1/ps1.service';
import { MATERIAL_STANDALONE_IMPORTS } from '../materialConfig/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, OverallDataComponent, TabsComponent, ...MATERIAL_STANDALONE_IMPORTS],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  selectedFinancialYearId: string | null = null;
  dashboardData$: Observable<DashboardData>;
  isLoading$: Observable<boolean>;

  constructor(private ps1UtilsService: Ps1UtilsService) {
    this.dashboardData$ = this.ps1UtilsService.data$;
    this.isLoading$ = this.ps1UtilsService.loading$;
  }

  ngOnInit() {
    // Initialize any required data
  }

  onFinancialYearSelectedFromOverall(yearId: string) {
    this.selectedFinancialYearId = yearId;
    if (this.selectedFinancialYearId) {
      this.ps1UtilsService.fetchPs1DashboardData(this.selectedFinancialYearId);
    }
  }
}