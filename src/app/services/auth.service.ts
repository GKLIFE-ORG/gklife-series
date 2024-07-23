import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthRequest, AuthResponse } from '../model/auth.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private backendUrl = environment.BACKEND_URL;

  constructor(private http: HttpClient) {}

  public async verifyAuthentication(authRequest: AuthRequest): Promise<boolean> {
    try {
      const response: AuthResponse | undefined = await this.http
        .post<AuthResponse>(this.backendUrl + '/auth/verify', authRequest)
        .toPromise();
      if (response) {
        localStorage.setItem('pin', authRequest.pin);
        return response.isValidPin;
      } else {
        console.error('No hubo respuesta del servidor');
        return false;
      }
    } catch (error: any) {
      console.error('Error verificando el PIN', error);
      return false;
    }
  }
}
