// src/app/components/dashboard/overall-data/overall-data.component.ts

import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';

import { MATERIAL_STANDALONE_IMPORTS } from '../../materialConfig/material.module';
import { CountCardComponent } from '../count-card/count-card.component'; // Import CountCard
import { Ps1UtilsService } from '../../../services/ps1/ps1-utils.service';
import { CountData } from '../../../services/ps1/ps1.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-overall-data',
  standalone: true,
  imports: [CommonModule, ...MATERIAL_STANDALONE_IMPORTS, CountCardComponent, FormsModule],
  templateUrl: './overall-data.component.html',
  styleUrls: ['./overall-data.component.scss']
})
export class OverallDataComponent implements OnInit, OnDestroy {
  @Output() financialYearSelected = new EventEmitter<string>(); // Emits the selected FY ID

  globalCounts: CountData[] = [];
  financialYears: { label: string; value: string }[] = [];
  selectedFinancialYearId: string | null = null;
  isPanelOpen: boolean = true;
  lastUpdated: Date | null = null;

  isLoading$: Observable<boolean>;
  private destroy$ = new Subject<void>();

  constructor(private ps1UtilsService: Ps1UtilsService) {
    this.isLoading$ = this.ps1UtilsService.loading$;
  }

  ngOnInit(): void {
    this.ps1UtilsService.globalCounts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(counts => {
        this.globalCounts = counts;
        this.lastUpdated = new Date();
      });

    this.ps1UtilsService.availableFinancialYears$
      .pipe(takeUntil(this.destroy$))
      .subscribe(fys => {
        this.financialYears = fys;
        if (fys.length > 0 && !this.selectedFinancialYearId) {
          this.selectedFinancialYearId = fys[0].value;
          this.onFinancialYearChange();
        } else if (fys.length === 0) {
          this.selectedFinancialYearId = null;
        }
      });
  }

  onFinancialYearChange(): void {
    if (this.selectedFinancialYearId) {
      this.financialYearSelected.emit(this.selectedFinancialYearId);
    }
  }

  togglePanel(): void {
    this.isPanelOpen = !this.isPanelOpen;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}