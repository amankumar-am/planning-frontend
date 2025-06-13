
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { ReferenceDataResponse } from '../generic.model';
import { CreateDesignationDto, Designation, UpdateDesignationDto } from '../../models/designation.model';

@Injectable({
  providedIn: 'root'
})
export class DesignationService {
  private apiUrl = `${environment.apiBaseUrl}/designations`;

  constructor(private http: HttpClient) { }

  // Get all designations
  getAllDesignations(): Observable<ReferenceDataResponse<Designation>> {
    return this.http.get<ReferenceDataResponse<Designation>>(this.apiUrl);
  }

  // Get designation by ID
  getDesignationById(id: number): Observable<Designation> {
    return this.http.get<Designation>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new designation
  createDesignation(designation: CreateDesignationDto): Observable<Designation> {
    return this.http.post<Designation>(this.apiUrl, designation).pipe(
      catchError(this.handleError)
    );
  }

  // Update designation
  updateDesignation(id: number, designation: UpdateDesignationDto): Observable<Designation> {
    return this.http.put<Designation>(`${this.apiUrl}/${id}`, designation).pipe(
      catchError(this.handleError)
    );
  }

  // Delete designation
  deleteDesignation(id: number): Observable<void> {
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
