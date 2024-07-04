import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.development';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Weighted } from '../interfaces/weighted.model';

@Injectable({
  providedIn: 'root'
})
export class WeightedService {
  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getWeighteds(eventId: number): Observable<Weighted[]> {
    return this.http.get<Weighted[]>(`${this.apiUrl}/weighted/event/${eventId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  getWeighted(id: number): Observable<Weighted> {
    return this.http.get<Weighted>(`${this.apiUrl}/weighted/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  createWeighted(data: Weighted): Observable<Weighted> {
    return this.http.post<Weighted>(`${this.apiUrl}/weighted`, data, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateWeighted(id: number, data: Weighted): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/weighted/${id}`, data, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteWeighted(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/weighted/${id}`, {
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
