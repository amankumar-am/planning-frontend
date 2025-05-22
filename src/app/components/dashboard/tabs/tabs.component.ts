// src/app/components/dashboard/tabs/tabs.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core'; // Added OnDestroy
import { MATERIAL_STANDALONE_IMPORTS } from '../../materialConfig/material.module';
import { CountCardComponent } from '../reports/count-card/count-card.component';
import { ChartComponent } from '../reports/chart/chart.component';
import { Observable, Subject } from 'rxjs'; // Added Subject
import { takeUntil } from 'rxjs/operators'; // Added takeUntil
import { Ps1UtilsService } from '../../../services/ps1/ps1-utils.service';
import { CountData, ChartData, DashboardData } from '../../../services/ps1/ps1.service';

@Component({
  selector: 'app-tabs',
  standalone: true, // Assuming standalone
  imports: [CommonModule, ...MATERIAL_STANDALONE_IMPORTS, CountCardComponent, ChartComponent],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'] // Corrected styleUrl to styleUrls
})
export class TabsComponent implements OnInit, OnDestroy {
  contentCounts: CountData[] = []; // Use specific type
  pendingCounts: CountData[] = []; // Use specific type
  globalCounts: CountData[] = []; // Use specific type
  charts: ChartData[] = [];       // Use specific type
  loading$: Observable<boolean>;

  private destroy$ = new Subject<void>(); // For unsubscribing

  constructor(private ps1UtilsService: Ps1UtilsService) {
    this.loading$ = this.ps1UtilsService.loading$;
  }

  ngOnInit() {
    this.ps1UtilsService.data$
      .pipe(takeUntil(this.destroy$)) // Automatically unsubscribe
      .subscribe((data: DashboardData) => { // Use DashboardData type for the emitted value
        if (data && data.countDataArray) {
          this.contentCounts = data.countDataArray
        } else {
          this.contentCounts = [];
        }
        if (data && data.pendingDataArray) {
          this.pendingCounts = data.pendingDataArray;
        } else {
          this.pendingCounts = [];
        }

        if (data && data.chartDataArray) {
          this.charts = data.chartDataArray;
        } else {
          this.charts = [];
        }
      });

    this.ps1UtilsService.globalCounts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(counts => {
        this.globalCounts = counts;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}