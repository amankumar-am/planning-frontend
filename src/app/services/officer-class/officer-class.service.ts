
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { ReferenceDataResponse } from '../generic.model';
import { CreateOfficerClassDto, OfficerClass, UpdateOfficerClassDto } from '../../models/officer-class.model';

@Injectable({
  providedIn: 'root'
})
export class OfficerClassService {
  private apiUrl = `${environment.apiBaseUrl}/officer-classs`;

  constructor(private http: HttpClient) { }

  // Get all officer-classs
  getAllOfficerClasss(): Observable<ReferenceDataResponse<OfficerClass>> {
    return this.http.get<ReferenceDataResponse<OfficerClass>>(this.apiUrl);
  }

  // Get officer-class by ID
  getOfficerClassById(id: number): Observable<OfficerClass> {
    return this.http.get<OfficerClass>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new officer-class
  createOfficerClass(officerClass: CreateOfficerClassDto): Observable<OfficerClass> {
    return this.http.post<OfficerClass>(this.apiUrl, officerClass).pipe(
      catchError(this.handleError)
    );
  }

  // Update officer-class
  updateOfficerClass(id: number, officerClass: UpdateOfficerClassDto): Observable<OfficerClass> {
    return this.http.put<OfficerClass>(`${this.apiUrl}/${id}`, officerClass).pipe(
      catchError(this.handleError)
    );
  }

  // Delete officer-class
  deleteOfficerClass(id: number): Observable<void> {
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
