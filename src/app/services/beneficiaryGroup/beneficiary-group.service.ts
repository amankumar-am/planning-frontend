// src/app/services/beneficiaryGroup/beneficiary-group.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { ReferenceDataResponse } from '../generic.model';
import { CreateBeneficiaryGroupDto, BeneficiaryGroup, UpdateBeneficiaryGroupDto } from './beneficiaryGroup.model';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryGroupService {
  private apiUrl = `${environment.apiBaseUrl}/bg`;

  constructor(private http: HttpClient) { }

  // Get all beneficiary groups
  getAllBeneficiaryGroups(): Observable<ReferenceDataResponse<BeneficiaryGroup>> {
    return this.http.get<ReferenceDataResponse<BeneficiaryGroup>>(this.apiUrl);
  }

  // Get beneficiary group by ID
  getBeneficiaryGroupById(id: number): Observable<BeneficiaryGroup> {
    return this.http.get<BeneficiaryGroup>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new beneficiary group
  createBeneficiaryGroup(beneficiaryGroup: CreateBeneficiaryGroupDto): Observable<BeneficiaryGroup> {
    return this.http.post<BeneficiaryGroup>(this.apiUrl, beneficiaryGroup).pipe(
      catchError(this.handleError)
    );
  }

  // Update beneficiary group
  updateBeneficiaryGroup(id: number, beneficiaryGroup: UpdateBeneficiaryGroupDto): Observable<BeneficiaryGroup> {
    return this.http.put<BeneficiaryGroup>(`${this.apiUrl}/${id}`, beneficiaryGroup).pipe(
      catchError(this.handleError)
    );
  }

  // Delete beneficiary group
  deleteBeneficiaryGroup(id: number): Observable<void> {
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