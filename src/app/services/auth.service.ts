import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthRequest, AuthResponse } from '../models/auth.model';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { AwesomeNotificationsService } from './awesome-notifications.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private backendUrl = environment.BACKEND_URL + '/auth';

  constructor(
    private http: HttpClient,
    private awnService: AwesomeNotificationsService
  ) {}

  public async login(authRequest: AuthRequest): Promise<AuthResponse> {
    try {
      const response = await lastValueFrom(
        this.http.post<AuthResponse>(`${this.backendUrl}/login`, authRequest)
      );

      if (response.token && response.message) {
        localStorage.setItem('token', response.token);
        this.awnService.success(response.message);
      } else {
        console.error('Error logging in:', response.message);
      }

      return response;
    } catch (error: any) {
      this.awnService.alert(error.error.message);
      console.error('Error logging in:', error);
      throw error.error.message;
    }
  }

  public async verify(token: string): Promise<boolean> {
    try {
      const response = await lastValueFrom(
        this.http.post<AuthResponse>(`${this.backendUrl}/verify`, { token })
      );

      return response.isTokenValid || false;
    } catch (error: any) {
      console.error('Error verifying token:', error);
      return false;
    }
  }
}
