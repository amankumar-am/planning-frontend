import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { ReferenceDataResponse } from '../generic.model';
import { CreateOfficeLevelDto, OfficeLevel, UpdateOfficeLevelDto } from '../../models/office-level.model';
import { QueryOptions, QueryHelper } from '../../core/query.helper';

@Injectable({
  providedIn: 'root'
})
export class OfficeLevelService {
  private apiUrl = `${environment.apiBaseUrl}/office-levels`;

  constructor(private http: HttpClient) { }

  // Get all office-levels
  getAllOfficeLevels(): Observable<ReferenceDataResponse<OfficeLevel>> {
    return this.http.get<ReferenceDataResponse<OfficeLevel>>(this.apiUrl);
  }

  // Get office levels with query (filtering, sorting, pagination)
  getOfficeLevelsWithQuery(options: QueryOptions): Observable<ReferenceDataResponse<OfficeLevel>> {
    const params = QueryHelper.buildQueryParams(options);
    return this.http.get<ReferenceDataResponse<OfficeLevel>>(`${this.apiUrl}/query`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // Get office-level by ID
  getOfficeLevelById(id: number): Observable<OfficeLevel> {
    return this.http.get<OfficeLevel>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new office-level
  createOfficeLevel(officeLevel: CreateOfficeLevelDto): Observable<OfficeLevel> {
    return this.http.post<OfficeLevel>(this.apiUrl, officeLevel).pipe(
      catchError(this.handleError)
    );
  }

  // Update office-level
  updateOfficeLevel(id: number, officeLevel: UpdateOfficeLevelDto): Observable<OfficeLevel> {
    return this.http.put<OfficeLevel>(`${this.apiUrl}/${id}`, officeLevel).pipe(
      catchError(this.handleError)
    );
  }

  // Delete office-level
  deleteOfficeLevel(id: number): Observable<void> {
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
