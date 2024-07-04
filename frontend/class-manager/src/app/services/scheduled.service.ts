import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.development';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Scheduled } from '../interfaces/scheduled.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl: string = environment.apiUrl;
  private tokenKey = 'token';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getSchedules(): Observable<Scheduled[]> {
    return this.http.get<Scheduled[]>(`${this.apiUrl}/scheduleds`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  getSchedule(id: number): Observable<Scheduled> {
    return this.http.get<Scheduled>(`${this.apiUrl}/scheduleds/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  createSchedule(data: Scheduled): Observable<Scheduled> {
    return this.http.post<Scheduled>(`${this.apiUrl}/scheduleds`, data, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateSchedule(id: number, data: Scheduled): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/scheduleds/${id}`, data, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteSchedule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/scheduleds/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(error.message || error);
  }
}
