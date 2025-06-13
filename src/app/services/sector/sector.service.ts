// src/app/services/sector/sector.service.ts


import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { ReferenceDataResponse } from '../generic.model';
import { CreateSectorDto, Sector, UpdateSectorDto } from '../../models/sector.model';
import { QueryOptions, QueryHelper } from '../../core/query.helper';

@Injectable({
  providedIn: 'root'
})
export class SectorService {
  private apiUrl = `${environment.apiBaseUrl}/sectors`;

  constructor(private http: HttpClient) { }

  // Get all sectors
  getAllSectors(): Observable<ReferenceDataResponse<Sector>> {
    return this.http.get<ReferenceDataResponse<Sector>>(this.apiUrl);
  }

  // Get sectors with query (filtering, sorting, pagination)
  getSectorsWithQuery(options: QueryOptions): Observable<ReferenceDataResponse<Sector>> {
    const params = QueryHelper.buildQueryParams(options);
    return this.http.get<ReferenceDataResponse<Sector>>(`${this.apiUrl}/query`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // Get sector by ID
  getSectorById(id: number): Observable<Sector> {
    return this.http.get<Sector>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new sector
  createSector(sector: CreateSectorDto): Observable<Sector> {
    return this.http.post<Sector>(this.apiUrl, sector).pipe(
      catchError(this.handleError)
    );
  }

  // Update sector
  updateSector(id: number, sector: UpdateSectorDto): Observable<Sector> {
    return this.http.put<Sector>(`${this.apiUrl}/${id}`, sector).pipe(
      catchError(this.handleError)
    );
  }

  // Delete sector
  deleteSector(id: number): Observable<void> {
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
