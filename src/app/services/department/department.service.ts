import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { ReferenceDataResponse } from '../generic.model';
import { CreateDepartmentDto, Department, UpdateDepartmentDto } from '../../models/department.model';
import { QueryOptions, QueryHelper } from '../../core/query.helper';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = `${environment.apiBaseUrl}/departments`;

  constructor(private http: HttpClient) { }

  // Get all departments
  getAllDepartments(): Observable<ReferenceDataResponse<Department>> {
    return this.http.get<ReferenceDataResponse<Department>>(this.apiUrl);
  }

  // Get departments with query (filtering, sorting, pagination)
  getDepartmentsWithQuery(options: QueryOptions): Observable<ReferenceDataResponse<Department>> {
    const params = QueryHelper.buildQueryParams(options);
    return this.http.get<ReferenceDataResponse<Department>>(`${this.apiUrl}/query`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // Get department by ID
  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new department
  createDepartment(department: CreateDepartmentDto): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, department).pipe(
      catchError(this.handleError)
    );
  }

  // Update department
  updateDepartment(id: number, department: UpdateDepartmentDto): Observable<Department> {
    return this.http.put<Department>(`${this.apiUrl}/${id}`, department).pipe(
      catchError(this.handleError)
    );
  }

  // Delete department
  deleteDepartment(id: number): Observable<void> {
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
