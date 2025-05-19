// src/app/services/ps1/ps1-utils.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, Observable, of } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { Ps1Service, DashboardData, CountData, ChartData, MapData, ApiAvailableFinancialYear } from './ps1.service';
import { Ps1 } from '../../models/ps1.model';
import { ApiChartDataPoint } from '../../models/dashboard.model';

@Injectable({
    providedIn: 'root'
})
export class Ps1UtilsService {
    private dataSubject = new BehaviorSubject<DashboardData>(this.getEmptyDashboardData());
    private globalCountsSubject = new BehaviorSubject<CountData[]>([]);
    private availableFinancialYearsSubject = new BehaviorSubject<{ label: string; value: string }[]>([]);
    private globalDataLoadingSubject = new BehaviorSubject<boolean>(false);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    globalCounts$: Observable<CountData[]> = this.globalCountsSubject.asObservable();
    availableFinancialYears$: Observable<{ label: string; value: string }[]> = this.availableFinancialYearsSubject.asObservable();
    data$: Observable<DashboardData> = this.dataSubject.asObservable();
    loading$: Observable<boolean> = this.loadingSubject.asObservable(); // Year-specific loading
    globalDataLoading$: Observable<boolean> = this.globalDataLoadingSubject.asObservable();

    constructor(private ps1Service: Ps1Service) {
        this.fetchInitialGlobalData();
    }


    // Fetch initial global data (global counts and available financial years)
    async fetchInitialGlobalData(): Promise<void> {
        this.globalDataLoadingSubject.next(true); // Use the new loading state
        try {
            const [
                totalRecordsRes,
                distinctFyRes,
                availableFysRes
            ] = await Promise.all([
                firstValueFrom(this.ps1Service.getGlobalTotalRecords().pipe(catchError(err => of(null)))),
                firstValueFrom(this.ps1Service.getGlobalDistinctFinancialYearsCount().pipe(catchError(err => of(null)))),
                firstValueFrom(this.ps1Service.getAvailableFinancialYearsFromApi().pipe(catchError(err => of([]))))
            ]);

            const globalCounts: CountData[] = [];
            if (totalRecordsRes) {
                globalCounts.push({ title: totalRecordsRes.title, uniqueCount: totalRecordsRes.uniqueCount });
            }
            if (distinctFyRes) {
                globalCounts.push({ title: distinctFyRes.title, uniqueCount: distinctFyRes.uniqueCount });
            }
            this.globalCountsSubject.next(globalCounts);

            if (availableFysRes && availableFysRes.length > 0) {
                const formattedFys = availableFysRes.map((fy: ApiAvailableFinancialYear) => ({
                    label: fy.name, // API returns 'name'
                    value: String(fy.id)    // API returns 'id'
                }));
                this.availableFinancialYearsSubject.next(formattedFys);
            } else {
                this.availableFinancialYearsSubject.next([]); // No financial years available
            }
        } catch (error) {
            console.error('Error fetching initial global data:', error);
            this.globalCountsSubject.next([]);
            this.availableFinancialYearsSubject.next([]);
        } finally {
            this.globalDataLoadingSubject.next(false); // Use the new loading state
        }
    }


    // Fetch dashboard data for a specific financial year
    async fetchPs1DashboardData(financialYearId: string): Promise<void> {
        const currentAvailableFys = this.availableFinancialYearsSubject.getValue();

        if (!financialYearId) {
            console.warn('Financial year ID is required to fetch dashboard data.');
            this.dataSubject.next(this.getEmptyDashboardData(currentAvailableFys));
            return;
        }

        this.loadingSubject.next(true);

        try {
            const countRequests = [
                this.ps1Service.getDashboardUniqueCount(financialYearId, 'total_count', 'Total Records'),
                this.ps1Service.getDashboardUniqueCount(financialYearId, 'taluka', 'Total Talukas Benefitted'),
                this.ps1Service.getDashboardUniqueCount(financialYearId, 'sector', 'Total Sectors Addressed'),
                this.ps1Service.getDashboardUniqueCount(financialYearId, 'fund', 'Type of Funds Utilized'),
                this.ps1Service.getDashboardStageWiseCount(financialYearId, 12, 'Works Completed'),
            ];

            const chartRequests = [
                this.ps1Service.getDashboardChartData(financialYearId, 'fund', 'Fund Distribution (FY)', 'Funds'),
                this.ps1Service.getDashboardChartData(financialYearId, 'stage', 'Stage Wise Distribution (FY)', 'Stages')
            ];

            const pendingRequests = [
                this.ps1Service.getDashboardStageWiseCount(financialYearId, 1, 'Draft Demands'),
                this.ps1Service.getDashboardStageWiseCount(financialYearId, 2, 'Primary Sanction'),
                this.ps1Service.getDashboardStageWiseCount(financialYearId, 3, 'Technical Sanction'),
                this.ps1Service.getDashboardStageWiseCount(financialYearId, 4, 'Administrative Sanction'),
                this.ps1Service.getDashboardStageWiseCount(financialYearId, 5, 'Grant'),
                this.ps1Service.getDashboardStageWiseCount(financialYearId, 6, 'Work Order'),
                this.ps1Service.getDashboardStageWiseCount(financialYearId, 7, 'Inspection'),
                this.ps1Service.getDashboardStageWiseCount(financialYearId, 10, 'Final Payment'),
                this.ps1Service.getDashboardStageWiseCount(financialYearId, 11, 'UTC'),
            ]

            const [countResponses, chartResponses, pendingResponses] = await Promise.all([
                firstValueFrom(forkJoin(countRequests).pipe(catchError(err => of([] as any[])))),
                firstValueFrom(forkJoin(chartRequests).pipe(catchError(err => of([] as any[])))),
                firstValueFrom(forkJoin(pendingRequests).pipe(catchError(err => of([] as any[])))),
            ]);

            const processedCountData: CountData[] = (countResponses as any[])
                .filter(res => res && res.uniqueCount !== undefined)
                .map(res => ({
                    title: res.title,
                    uniqueCount: res.uniqueCount,
                }));

            const processedPendingData: CountData[] = (pendingResponses as any[])
                .filter(res => res && res.uniqueCount !== undefined)
                .map(res => ({
                    title: res.title,
                    uniqueCount: res.uniqueCount,
                }));

            const processedChartData: ChartData[] = (chartResponses as any[])
                .filter(res => res && res.data)
                .map(apiChart => ({
                    title: apiChart.title,
                    xAxisTitle: apiChart.xAxisTitle,
                    chartType: 'column', // Default, or make it dynamic
                    data: apiChart.data.map((point: any) => ({
                        name: point.label,
                        value: point.value,
                    })),
                }));

            this.dataSubject.next({
                globalCountDataArray: [], // No longer part of this specific data emission
                countDataArray: processedCountData,
                chartDataArray: processedChartData,
                pendingDataArray: processedPendingData,
                geoJSON: null,
                locations: [],
                financialYears: currentAvailableFys // Use the dynamically fetched & current list
            });

        } catch (error) {
            console.error('Error fetching PS1 dashboard data aggregate for FY:', error);
            this.dataSubject.next(this.getEmptyDashboardData(currentAvailableFys)); // Pass current FYs
        } finally {
            this.loadingSubject.next(false);
        }
    }


    private getEmptyDashboardData(financialYears: { label: string; value: string }[] = []): DashboardData {
        return {
            globalCountDataArray: [],
            countDataArray: [],
            chartDataArray: [],
            pendingDataArray: [],
            geoJSON: null,
            locations: [],
            financialYears: financialYears
        };
    }


    // For compatibility with existing CRUD operations (if still directly used by components)
    async fetchAllPs1Items(): Promise<{ data: Ps1[]; schema: any[]; defaultVisibleColumns: string[] }> {
        this.loadingSubject.next(true);
        try {
            const response = await firstValueFrom(this.ps1Service.getAllPs1s());
            console.log(response);

            return {
                data: response?.data || [],
                schema: response?.schema || [], // Assuming your ReferenceDataResponse has schema
                defaultVisibleColumns: response.defaultVisibleColumns || [] // And defaultVisibleColumns
            };
        } catch (error) {
            console.error('Error fetching all PS1 items:', error);
            return { data: [], schema: [], defaultVisibleColumns: [] };
        } finally {
            this.loadingSubject.next(false);
        }
    }
}