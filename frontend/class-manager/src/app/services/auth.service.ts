import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { LoginRequest } from '../interfaces/login-request';
import { AuthResponse } from '../interfaces/auth-response';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { RegisterRequest } from '../interfaces/register-request';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl: string = environment.apiUrl;
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}account/login`, data)
      .pipe(
        map((response) => {
          if (response.isSuccess) {
            localStorage.setItem(this.tokenKey, response.token);
          }
          return response;
        })
      );
  }

  
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}account/register`, data)
      .pipe(
        map((response) => {
          if (response.isSuccess) {
            localStorage.setItem(this.tokenKey, response.token);
          }
          return response;
        })
      );
  }

  getUserDetail = () => {
    const token = this.getToken();
    if (!token) {
      true;
    }
    const decodedToken: any = jwtDecode(token);
    const userDetail = {
      id: decodedToken.nameid,
      fullName: decodedToken.name,
      email: decodedToken.email,
      roles: decodedToken.role || [],
    };
    return userDetail;
  };

  private isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }
    const decodedToken = jwtDecode(token);
    const isTokenExpired = Date.now() >= decodedToken['exp']! * 1000;
    if (isTokenExpired) {
      this.logout();
    }
    return isTokenExpired;
  }

  logout = (): void => {
    localStorage.removeItem(this.tokenKey);
  };

  isLoggedIn = (): boolean => {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return !this.isTokenExpired();
  };

  getToken = (): string => {
    return localStorage.getItem(this.tokenKey) || '';
  };
}
