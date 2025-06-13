
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { ReferenceDataResponse } from '../generic.model';
import { CreateStateDto, State, UpdateStateDto } from '../../models/state.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private apiUrl = `${environment.apiBaseUrl}/states`;

  constructor(private http: HttpClient) { }

  // Get all states
  getAllStates(): Observable<ReferenceDataResponse<State>> {
    return this.http.get<ReferenceDataResponse<State>>(this.apiUrl);
  }

  // Get state by ID
  getStateById(id: number): Observable<State> {
    return this.http.get<State>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new state
  createState(state: CreateStateDto): Observable<State> {
    return this.http.post<State>(this.apiUrl, state).pipe(
      catchError(this.handleError)
    );
  }

  // Update state
  updateState(id: number, state: UpdateStateDto): Observable<State> {
    return this.http.put<State>(`${this.apiUrl}/${id}`, state).pipe(
      catchError(this.handleError)
    );
  }

  // Delete state
  deleteState(id: number): Observable<void> {
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
