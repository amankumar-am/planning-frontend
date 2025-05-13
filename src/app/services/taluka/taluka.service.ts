// src/app/services/taluka/taluka.service.ts


import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { ReferenceDataResponse } from '../generic.model';
import { CreateTalukaDto, Taluka, UpdateTalukaDto } from '../../models/taluka.model';

@Injectable({
  providedIn: 'root'
})
export class TalukaService {
  private apiUrl = `${environment.apiBaseUrl}/talukas`;

  constructor(private http: HttpClient) { }

  // Get all talukas
  getAllTalukas(): Observable<ReferenceDataResponse<Taluka>> {
    return this.http.get<ReferenceDataResponse<Taluka>>(this.apiUrl);
  }

  // Get taluka by ID
  getTalukaById(id: number): Observable<Taluka> {
    return this.http.get<Taluka>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getTalukaByDistrict(id: number): Observable<Taluka> {
    return this.http.get<Taluka>(`${this.apiUrl}/district/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new taluka
  createTaluka(taluka: CreateTalukaDto): Observable<Taluka> {
    return this.http.post<Taluka>(this.apiUrl, taluka).pipe(
      catchError(this.handleError)
    );
  }

  // Update taluka
  updateTaluka(id: number, taluka: UpdateTalukaDto): Observable<Taluka> {
    return this.http.put<Taluka>(`${this.apiUrl}/${id}`, taluka).pipe(
      catchError(this.handleError)
    );
  }

  // Delete taluka
  deleteTaluka(id: number): Observable<void> {
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
