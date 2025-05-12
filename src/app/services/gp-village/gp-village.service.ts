// src/app/services/gp-village/gp-village.service.ts


import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { ReferenceDataResponse } from '../generic.model';
import { CreateGpVillageDto, GpVillage, UpdateGpVillageDto } from '../../models/gp-village.model';

@Injectable({
  providedIn: 'root'
})
export class GpVillageService {
  private apiUrl = `${environment.apiBaseUrl}/gpVillages`;

  constructor(private http: HttpClient) { }

  // Get all gp-villages
  getAllGpVillages(): Observable<ReferenceDataResponse<GpVillage>> {
    return this.http.get<ReferenceDataResponse<GpVillage>>(this.apiUrl);
  }

  // Get gp-village by ID
  getGpVillageById(id: number): Observable<GpVillage> {
    return this.http.get<GpVillage>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new gp-village
  createGpVillage(gpVillage: CreateGpVillageDto): Observable<GpVillage> {
    return this.http.post<GpVillage>(this.apiUrl, gpVillage).pipe(
      catchError(this.handleError)
    );
  }

  // Update gp-village
  updateGpVillage(id: number, gpVillage: UpdateGpVillageDto): Observable<GpVillage> {
    return this.http.put<GpVillage>(`${this.apiUrl}/${id}`, gpVillage).pipe(
      catchError(this.handleError)
    );
  }

  // Delete gp-village
  deleteGpVillage(id: number): Observable<void> {
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
