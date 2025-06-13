// src/app/services/district/district.service.ts


import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { ReferenceDataResponse } from '../generic.model';
import { CreateDistrictDto, District, UpdateDistrictDto } from '../../models/district.model';
import { QueryOptions, QueryHelper } from '../../core/query.helper';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {
  private apiUrl = `${environment.apiBaseUrl}/districts`;

  constructor(private http: HttpClient) { }

  // Get all districts
  getAllDistricts(): Observable<ReferenceDataResponse<District>> {
    return this.http.get<ReferenceDataResponse<District>>(this.apiUrl);
  }

  // Get districts with query (filtering, sorting, pagination)
  getDistrictsWithQuery(options: QueryOptions): Observable<ReferenceDataResponse<District>> {
    const params = QueryHelper.buildQueryParams(options);
    return this.http.get<ReferenceDataResponse<District>>(`${this.apiUrl}/query`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // Get district by ID
  getDistrictById(id: number): Observable<District> {
    return this.http.get<District>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new district
  createDistrict(district: CreateDistrictDto): Observable<District> {
    return this.http.post<District>(this.apiUrl, district).pipe(
      catchError(this.handleError)
    );
  }

  // Update district
  updateDistrict(id: number, district: UpdateDistrictDto): Observable<District> {
    return this.http.put<District>(`${this.apiUrl}/${id}`, district).pipe(
      catchError(this.handleError)
    );
  }

  // Delete district
  deleteDistrict(id: number): Observable<void> {
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
