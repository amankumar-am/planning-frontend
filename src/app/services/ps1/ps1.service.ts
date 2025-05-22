// src/app/services/ps1/ps1.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { ReferenceDataResponse } from '../generic.model';
import { CreatePs1Dto, Ps1, UpdatePs1Dto } from '../../models/ps1.model';
import { ApiChartDataResponse, ApiUniqueCountResponse } from '../../models/dashboard.model';

export interface ApiAvailableFinancialYear {
  id: string; // Or number, whatever your API returns
  name: string; // e.g., "FY 2023-24"
}
export interface CountData {
  title: string;
  uniqueCount: number;
  url?: string;
}

export interface ChartData { // This is the Angular-side ChartData, not directly the API response
  chartType: string;
  title: string;
  xAxisTitle: string;
  // API returns `label` and `value`. Angular charts might expect `name` and `value` or other properties.
  // We'll map this in Ps1UtilsService. For now, let's expect ApiChartDataPoint from the API.
  data: { name: string | number; value: number; url?: string }[]; // Adjusted for typical chart libraries
}

export interface MapData {
  geoJSON: any;
  locations: { name: string; lat: number; lon: number; work_id: string; url: string; additional_details: { stage: string; created_date: string } }[];
}

export interface DashboardData {
  globalCountDataArray: CountData[];
  countDataArray: CountData[];
  chartDataArray: ChartData[];
  pendingDataArray: CountData[];
  geoJSON: any;
  locations: MapData['locations'];
  financialYears: { label: string; value: string }[]; // Assuming this comes from somewhere else or is static
}


@Injectable({
  providedIn: 'root'
})
export class Ps1Service {
  private apiUrl = `${environment.apiBaseUrl}/ps1`;
  private talukaApiUrl = `${environment.apiBaseUrl}/talukas`;
  private sectorApiUrl = `${environment.apiBaseUrl}/sectors`;
  private fundApiUrl = `${environment.apiBaseUrl}/funds`;
  constructor(private http: HttpClient) { }

  // Get all Ps1s
  getAllPs1s(): Observable<ReferenceDataResponse<Ps1>> {
    return this.http.get<ReferenceDataResponse<Ps1>>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Get Ps1 by ID
  getPs1ById(id: number): Observable<Ps1> {
    return this.http.get<Ps1>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new Ps1
  createPs1(ps1: CreatePs1Dto): Observable<Ps1> {
    return this.http.post<Ps1>(this.apiUrl, ps1).pipe(
      catchError(this.handleError)
    );
  }

  // Update Ps1
  updatePs1(id: number, ps1: UpdatePs1Dto): Observable<Ps1> {
    return this.http.put<Ps1>(`${this.apiUrl}/${id}`, ps1).pipe(
      catchError(this.handleError)
    );
  }

  // Delete Ps1
  deletePs1(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // --- New Dashboard Specific Methods ---

  /**
   * Fetches unique count data for a specific column and financial year.
   * API: GET /api/ps1/dashboard/count/:fyId/:columnName
   * @param fyId Financial Year ID
   * @param columnName 'fund' | 'taluka' | 'sector' | 'stage'
   * @param title Optional title to pass as a query parameter to the API
   */
  getDashboardUniqueCount(
    fyId: number | string,
    columnName: 'fund' | 'taluka' | 'sector' | 'stage' | 'total_count',
    title?: string
  ): Observable<ApiUniqueCountResponse> {
    let params = new HttpParams();
    if (title) {
      params = params.set('title', title);
    }
    return this.http.get<ApiUniqueCountResponse>(
      `${this.apiUrl}/dashboard/count/${fyId}/${columnName}`,
      { params }
    ).pipe(catchError(this.handleError));
  }

  getDashboardStageWiseCount(
    fyId: number | string,
    stageId: number | string,
    title?: string
  ): Observable<ApiUniqueCountResponse> {
    let params = new HttpParams();
    if (title) {
      params = params.set('title', title);
    }
    return this.http.get<ApiUniqueCountResponse>(
      `${this.apiUrl}/dashboard/count/${fyId}/stage/${stageId}`,
      { params }
    ).pipe(catchError(this.handleError));
  }

  /**
   * Fetches chart data for a specific column and financial year.
   * API: GET /api/ps1/dashboard/chart/:fyId/:groupByColumn
   * @param fyId Financial Year ID
   * @param groupByColumn 'fund' | 'taluka' | 'sector' | 'stage'
   * @param title Optional title for the chart (passed as query param)
   * @param xAxisTitle Optional X-axis title (passed as query param)
   */
  getDashboardChartData(
    fyId: number | string,
    groupByColumn: 'fund' | 'taluka' | 'sector' | 'stage',
    title?: string,
    xAxisTitle?: string
  ): Observable<ApiChartDataResponse> {
    let params = new HttpParams();
    if (title) {
      params = params.set('title', title);
    }
    if (xAxisTitle) {
      params = params.set('xAxisTitle', xAxisTitle);
    }
    return this.http.get<ApiChartDataResponse>(
      `${this.apiUrl}/dashboard/chart/${fyId}/${groupByColumn}`,
      { params }
    ).pipe(catchError(this.handleError));
  }

  getGlobalTotalRecords(): Observable<ApiUniqueCountResponse> { // Reusing ApiUniqueCountResponse
    return this.http.get<ApiUniqueCountResponse>(`${this.apiUrl}/dashboard/global/total-records`)
      .pipe(catchError(this.handleError));
  }

  getGlobalDistinctFinancialYearsCount(): Observable<ApiUniqueCountResponse> {
    return this.http.get<ApiUniqueCountResponse>(`${this.apiUrl}/dashboard/global/distinct-financial-years`)
      .pipe(catchError(this.handleError));
  }

  getAvailableFinancialYearsFromApi(): Observable<ApiAvailableFinancialYear[]> {
    return this.http.get<ApiAvailableFinancialYear[]>(`${this.apiUrl}/dashboard/available-financial-years`)
      .pipe(catchError(this.handleError));
  }

  getTotalTalukaFromApi(): Observable<ApiUniqueCountResponse> {
    return this.http.get<ApiUniqueCountResponse>(`${this.talukaApiUrl}/dashboard/global/district/2/total-talukas`)
      .pipe(catchError(this.handleError));
  }

  getTotalSectorsFromApi(): Observable<ApiUniqueCountResponse> {
    return this.http.get<ApiUniqueCountResponse>(`${this.sectorApiUrl}/dashboard/global/total-sectors`)
      .pipe(catchError(this.handleError));
  }

  getTotalFundsFromApi(): Observable<ApiUniqueCountResponse> {
    return this.http.get<ApiUniqueCountResponse>(`${this.fundApiUrl}/dashboard/global/total-funds`)
      .pipe(catchError(this.handleError));
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message || error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}