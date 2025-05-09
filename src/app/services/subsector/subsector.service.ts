// src/app/services/subsector/subsector.service.ts


import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { ReferenceDataResponse } from '../generic.model';
import { CreateSubsectorDto, Subsector, UpdateSubsectorDto } from '../../models/subsector.model';

@Injectable({
  providedIn: 'root'
})
export class SubsectorService {
  private apiUrl = `${environment.apiBaseUrl}/subsectors`;

  constructor(private http: HttpClient) { }

  // Get all subsectors
  getAllSubsectors(): Observable<ReferenceDataResponse<Subsector>> {
    return this.http.get<ReferenceDataResponse<Subsector>>(this.apiUrl);
  }

  // Get subsector by ID
  getSubsectorById(id: number): Observable<Subsector> {
    return this.http.get<Subsector>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new subsector
  createSubsector(subsector: CreateSubsectorDto): Observable<Subsector> {
    return this.http.post<Subsector>(this.apiUrl, subsector).pipe(
      catchError(this.handleError)
    );
  }

  // Update subsector
  updateSubsector(id: number, subsector: UpdateSubsectorDto): Observable<Subsector> {
    return this.http.put<Subsector>(`${this.apiUrl}/${id}`, subsector).pipe(
      catchError(this.handleError)
    );
  }

  // Delete subsector
  deleteSubsector(id: number): Observable<void> {
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
