import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { ReferenceDataResponse } from '../generic.model';
import { CreateOfficeDto, Office, UpdateOfficeDto } from '../../models/office.model';
import { QueryOptions, QueryHelper } from '../../core/query.helper';

@Injectable({
  providedIn: 'root'
})
export class OfficeService {
  private apiUrl = `${environment.apiBaseUrl}/offices`;

  constructor(private http: HttpClient) { }

  // Get all offices
  getAllOffices(): Observable<ReferenceDataResponse<Office>> {
    return this.http.get<ReferenceDataResponse<Office>>(this.apiUrl);
  }

  // Get offices with query (filtering, sorting, pagination)
  getOfficesWithQuery(options: QueryOptions): Observable<ReferenceDataResponse<Office>> {
    const params = QueryHelper.buildQueryParams(options);
    return this.http.get<ReferenceDataResponse<Office>>(`${this.apiUrl}/query`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // Get office by ID
  getOfficeById(id: number): Observable<Office> {
    return this.http.get<Office>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new office
  createOffice(office: CreateOfficeDto): Observable<Office> {
    return this.http.post<Office>(this.apiUrl, office).pipe(
      catchError(this.handleError)
    );
  }

  // Update office
  updateOffice(id: number, office: UpdateOfficeDto): Observable<Office> {
    return this.http.put<Office>(`${this.apiUrl}/${id}`, office).pipe(
      catchError(this.handleError)
    );
  }

  // Delete office
  deleteOffice(id: number): Observable<void> {
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
