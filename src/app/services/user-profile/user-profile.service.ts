
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { ReferenceDataResponse } from '../generic.model';
import { CreateUserProfileDto, UserProfile, UpdateUserProfileDto } from '../../models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private apiUrl = `${environment.apiBaseUrl}/user-profiles`;

  constructor(private http: HttpClient) { }

  // Get all user-profiles
  getAllUserProfiles(): Observable<ReferenceDataResponse<UserProfile>> {
    return this.http.get<ReferenceDataResponse<UserProfile>>(this.apiUrl);
  }

  // Get user-profile by ID
  getUserProfileById(id: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new user-profile
  createUserProfile(userProfile: CreateUserProfileDto): Observable<UserProfile> {
    return this.http.post<UserProfile>(this.apiUrl, userProfile).pipe(
      catchError(this.handleError)
    );
  }

  // Update user-profile
  updateUserProfile(id: number, userProfile: UpdateUserProfileDto): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/${id}`, userProfile).pipe(
      catchError(this.handleError)
    );
  }

  // Delete user-profile
  deleteUserProfile(id: number): Observable<void> {
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
