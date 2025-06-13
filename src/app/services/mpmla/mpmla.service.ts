
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { ReferenceDataResponse } from '../generic.model';
import { CreateMpmlaDto, Mpmla, UpdateMpmlaDto } from '../../models/mpmla.model';

@Injectable({
  providedIn: 'root'
})
export class MpmlaService {
  private apiUrl = `${environment.apiBaseUrl}/mpmlas`;

  constructor(private http: HttpClient) { }

  // Get all mpmlas
  getAllMpmlas(): Observable<ReferenceDataResponse<Mpmla>> {
    return this.http.get<ReferenceDataResponse<Mpmla>>(this.apiUrl);
  }

  // Get mpmla by ID
  getMpmlaById(id: number): Observable<Mpmla> {
    return this.http.get<Mpmla>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new mpmla
  createMpmla(mpmla: CreateMpmlaDto): Observable<Mpmla> {
    return this.http.post<Mpmla>(this.apiUrl, mpmla).pipe(
      catchError(this.handleError)
    );
  }

  // Update mpmla
  updateMpmla(id: number, mpmla: UpdateMpmlaDto): Observable<Mpmla> {
    return this.http.put<Mpmla>(`${this.apiUrl}/${id}`, mpmla).pipe(
      catchError(this.handleError)
    );
  }

  // Delete mpmla
  deleteMpmla(id: number): Observable<void> {
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
