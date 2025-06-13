import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { ReferenceDataResponse } from '../generic.model';
import { CreatePrantDto, Prant, UpdatePrantDto } from '../../models/prant.model';
import { QueryOptions, QueryHelper } from '../../core/query.helper';

@Injectable({
  providedIn: 'root'
})
export class PrantService {
  private apiUrl = `${environment.apiBaseUrl}/prants`;

  constructor(private http: HttpClient) { }

  // Get all prants
  getAllPrants(): Observable<ReferenceDataResponse<Prant>> {
    return this.http.get<ReferenceDataResponse<Prant>>(this.apiUrl);
  }

  // Get prants with query (filtering, sorting, pagination)
  getPrantsWithQuery(options: QueryOptions): Observable<ReferenceDataResponse<Prant>> {
    const params = QueryHelper.buildQueryParams(options);
    return this.http.get<ReferenceDataResponse<Prant>>(`${this.apiUrl}/query`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // Get prant by ID
  getPrantById(id: number): Observable<Prant> {
    return this.http.get<Prant>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new prant
  createPrant(prant: CreatePrantDto): Observable<Prant> {
    return this.http.post<Prant>(this.apiUrl, prant).pipe(
      catchError(this.handleError)
    );
  }

  // Update prant
  updatePrant(id: number, prant: UpdatePrantDto): Observable<Prant> {
    return this.http.put<Prant>(`${this.apiUrl}/${id}`, prant).pipe(
      catchError(this.handleError)
    );
  }

  // Delete prant
  deletePrant(id: number): Observable<void> {
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
