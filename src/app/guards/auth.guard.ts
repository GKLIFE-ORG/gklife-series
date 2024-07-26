import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  async canActivate(): Promise<boolean> {
    
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/auth']);
      return false;
    }

    const isValidToken = await this.authService.verify(token);
    if (isValidToken) {
      return true;
    } else {
      this.router.navigate(['/auth']);
      return false;
    }
  }
}
