import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { ReferenceDataResponse } from '../generic.model';
import { CreateEmploymentTypeDto, EmploymentType, UpdateEmploymentTypeDto } from '../../models/employment-type.model';
import { QueryOptions, QueryHelper } from '../../core/query.helper';

@Injectable({
  providedIn: 'root'
})
export class EmploymentTypeService {
  private apiUrl = `${environment.apiBaseUrl}/employment-types`;

  constructor(private http: HttpClient) { }

  // Get all employment-types
  getAllEmploymentTypes(): Observable<ReferenceDataResponse<EmploymentType>> {
    return this.http.get<ReferenceDataResponse<EmploymentType>>(this.apiUrl);
  }

  // Get employment types with query (filtering, sorting, pagination)
  getEmploymentTypesWithQuery(options: QueryOptions): Observable<ReferenceDataResponse<EmploymentType>> {
    const params = QueryHelper.buildQueryParams(options);
    return this.http.get<ReferenceDataResponse<EmploymentType>>(`${this.apiUrl}/query`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // Get employment-type by ID
  getEmploymentTypeById(id: number): Observable<EmploymentType> {
    return this.http.get<EmploymentType>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new employment-type
  createEmploymentType(employmentType: CreateEmploymentTypeDto): Observable<EmploymentType> {
    return this.http.post<EmploymentType>(this.apiUrl, employmentType).pipe(
      catchError(this.handleError)
    );
  }

  // Update employment-type
  updateEmploymentType(id: number, employmentType: UpdateEmploymentTypeDto): Observable<EmploymentType> {
    return this.http.put<EmploymentType>(`${this.apiUrl}/${id}`, employmentType).pipe(
      catchError(this.handleError)
    );
  }

  // Delete employment-type
  deleteEmploymentType(id: number): Observable<void> {
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
