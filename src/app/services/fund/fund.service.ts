// src/app/services/fund/fund.service.ts


import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { ReferenceDataResponse } from '../generic.model';
import { CreateFundDto, Fund, UpdateFundDto } from '../../models/fund.model';

@Injectable({
  providedIn: 'root'
})
export class FundService {
  private apiUrl = `${environment.apiBaseUrl}/funds`;

  constructor(private http: HttpClient) { }

  // Get all funds
  getAllFunds(): Observable<ReferenceDataResponse<Fund>> {
    return this.http.get<ReferenceDataResponse<Fund>>(this.apiUrl);
  }

  // Get fund by ID
  getFundById(id: number): Observable<Fund> {
    return this.http.get<Fund>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new fund
  createFund(fund: CreateFundDto): Observable<Fund> {
    return this.http.post<Fund>(this.apiUrl, fund).pipe(
      catchError(this.handleError)
    );
  }

  // Update fund
  updateFund(id: number, fund: UpdateFundDto): Observable<Fund> {
    return this.http.put<Fund>(`${this.apiUrl}/${id}`, fund).pipe(
      catchError(this.handleError)
    );
  }

  // Delete fund
  deleteFund(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
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
