import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  async canActivate(): Promise<boolean> {
    const pin = localStorage.getItem('pin');
    if (!pin) {
      this.router.navigate(['/auth']);
      return false;
    }

    const isValidPin = await this.authService.verifyAuthentication({ pin });
    if (isValidPin) {
      return true;
    } else {
      this.router.navigate(['/auth']);
      return false;
    }
  }
}
