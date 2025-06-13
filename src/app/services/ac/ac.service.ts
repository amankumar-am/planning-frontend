
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { ReferenceDataResponse } from '../generic.model';
import { CreateAcDto, Ac, UpdateAcDto } from '../../models/ac.model';

@Injectable({
  providedIn: 'root'
})
export class AcService {
  private apiUrl = `${environment.apiBaseUrl}/acs`;

  constructor(private http: HttpClient) { }

  // Get all acs
  getAllAcs(): Observable<ReferenceDataResponse<Ac>> {
    return this.http.get<ReferenceDataResponse<Ac>>(this.apiUrl);
  }

  // Get ac by ID
  getAcById(id: number): Observable<Ac> {
    return this.http.get<Ac>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new ac
  createAc(ac: CreateAcDto): Observable<Ac> {
    return this.http.post<Ac>(this.apiUrl, ac).pipe(
      catchError(this.handleError)
    );
  }

  // Update ac
  updateAc(id: number, ac: UpdateAcDto): Observable<Ac> {
    return this.http.put<Ac>(`${this.apiUrl}/${id}`, ac).pipe(
      catchError(this.handleError)
    );
  }

  // Delete ac
  deleteAc(id: number): Observable<void> {
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
