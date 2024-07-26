import { CommonModule } from '@angular/common';
import {
  Component,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import AWN from 'awesome-notifications';
import { AuthService } from '../../services/auth.service';
import { AuthRequest } from '../../model/auth.model';
import { AwesomeNotificationsService } from '../../services/awesome-notifications.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements AfterViewInit {
  @ViewChildren(
    'input0, input1, input2, input3, input4, input5, input6, input7'
  )
  inputs!: QueryList<ElementRef>;

  public password: string[] = ['', '', '', '', '', '', '', ''];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngAfterViewInit(): void {
    this.inputs.first.nativeElement.focus();
    this.preventFocusLoss();
  }

  onInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1 && index < 7) {
      this.inputs.toArray()[index + 1].nativeElement.focus();
    }

    if (index === 7 && this.password.join('').length === 8) {
      this.login();
    }
  }

  onKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      if (this.password[index] === '') {
        if (index > 0) {
          this.inputs.toArray()[index - 1].nativeElement.focus();
          this.password[index - 1] = '';
        }
      } else {
        this.password[index] = '';
      }
    }
  }

  public async login() {
    const authRequest: AuthRequest = {
      username: 'globitokuki',
      password: this.password.join(''),
    };

    try {
      const response = await this.authService.login(authRequest);
      
      if (response.isTokenValid && response.token) {
        this.router.navigate(['/']);
      }
    } catch (error: any) {
      this.password = ['', '', '', '', '', '', '', ''];
      this.inputs.forEach((input) => (input.nativeElement.value = ''));
      this.inputs.first.nativeElement.focus();
    }
  }

  // async checkPassword(): Promise<void> {
  //   const enteredPassword = this.password.join('');
  //   const authRequest: AuthRequest = { pin: enteredPassword };
  //   const isValidPin = await this.authService.verifyAuthentication(authRequest);

  //   if (isValidPin) {
  //     this.awnService.success('Bienvenida!');
  //     this.router.navigate(['/']);
  //   } else {
  //     this.awnService.alert('PIN inválido');
  //     this.password = ['', '', '', '', '', '', '', ''];
  //     this.inputs.forEach((input) => (input.nativeElement.value = ''));
  //     this.inputs.first.nativeElement.focus();
  //   }
  // }

  preventFocusLoss(): void {
    document.addEventListener('click', (event) => {
      if (
        document.activeElement !== this.inputs.first.nativeElement &&
        !this.isAnyInputFocused()
      ) {
        this.inputs.first.nativeElement.focus();
      }
    });

    document.addEventListener('focusin', (event) => {
      if (
        document.activeElement !== this.inputs.first.nativeElement &&
        !this.isAnyInputFocused()
      ) {
        this.inputs.first.nativeElement.focus();
      }
    });

    this.inputs.forEach((input, index) => {
      input.nativeElement.addEventListener('focus', () => {
        if (index > 0 && this.password.slice(0, index).includes('')) {
          this.inputs.first.nativeElement.focus();
        }
      });
    });
  }

  isAnyInputFocused(): boolean {
    return this.inputs.some(
      (input) => input.nativeElement === document.activeElement
    );
  }
}
