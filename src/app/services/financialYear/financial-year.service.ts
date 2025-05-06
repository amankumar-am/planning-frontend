// src/app/services/financialYear/financial-year.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { ReferenceDataResponse } from '../generic.model';
import { CreateFinancialYearDto, FinancialYear, UpdateFinancialYearDto } from './financialYear.model';

@Injectable({
  providedIn: 'root'
})
export class FinancialYearService {
  private apiUrl = `${environment.apiBaseUrl}/fy`;

  constructor(private http: HttpClient) { }

  // Get all financial years
  getAllFinancialYears(): Observable<ReferenceDataResponse<FinancialYear>> {
    return this.http.get<ReferenceDataResponse<FinancialYear>>(this.apiUrl);
  }

  // Get current financial year
  getCurrentFinancialYear(): Observable<FinancialYear> {
    return this.http.get<FinancialYear>(`${this.apiUrl}/current`).pipe(
      catchError(this.handleError)
    );
  }

  // Get financial year by ID
  getFinancialYearById(id: number): Observable<FinancialYear> {
    return this.http.get<FinancialYear>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new financial year
  createFinancialYear(financialYear: CreateFinancialYearDto): Observable<FinancialYear> {
    return this.http.post<FinancialYear>(this.apiUrl, financialYear).pipe(
      catchError(this.handleError)
    );
  }

  // Update financial year
  updateFinancialYear(id: number, financialYear: UpdateFinancialYearDto): Observable<FinancialYear> {
    return this.http.put<FinancialYear>(`${this.apiUrl}/${id}`, financialYear).pipe(
      catchError(this.handleError)
    );
  }

  // Delete financial year
  deleteFinancialYear(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Set financial year as current
  setCurrentFinancialYear(id: number): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/${id}/set-current`, {}).pipe(
      catchError(this.handleError)
    );
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