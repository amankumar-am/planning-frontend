// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();
    private readonly TOKEN_KEY = 'auth_token';

    constructor(private http: HttpClient) {
        this.loadStoredUser();
    }

    private loadStoredUser(): void {
        const token = localStorage.getItem(this.TOKEN_KEY);
        if (token) {
            // Decode JWT token to get user info
            const payload = JSON.parse(atob(token.split('.')[1]));
            this.currentUserSubject.next({
                id: payload.sub,
                name: payload.name,
                email: payload.email
            });
        }
    }

    login(credentials: { email: string; password: string }): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.apiBaseUrl}/auth/login`, credentials).pipe(
            tap(response => {
                localStorage.setItem(this.TOKEN_KEY, response.token);
                this.currentUserSubject.next(response.user);
            })
        );
    }

    register(userData: { name: string; email: string; password: string }): Observable<AuthResponse> {
        console.log(userData);

        return this.http.post<AuthResponse>(`${environment.apiBaseUrl}/auth/register`, userData);
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        this.currentUserSubject.next(null);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
} 