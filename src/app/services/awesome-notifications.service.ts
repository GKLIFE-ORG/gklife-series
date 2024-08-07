import { Injectable } from '@angular/core';
import AWN from 'awesome-notifications';

@Injectable({
  providedIn: 'root',
})
export class AwesomeNotificationsService {
  private notifier!: AWN;

  public configNotifications(): void {
    let options: any = {
      maxNotifications: 1,
      labels: {
        success: 'Correcto',
      },
    };
    this.notifier = new AWN(options);
  }

  public success(message: string): void {
    this.notifier.success(message || 'Operación exitosa');
  }

  public info(message: string): void {
    this.notifier.info(message || 'Operación exitosa');
  }

  public alert(message: string): void {
    this.notifier.alert(message || 'Ocurrió un error');
  }

  public asyncOperation<T>(promise: Promise<T>, message: string): Promise<T> {
    return this.notifier.async(
      promise,
      (response: any) => this.success(response?.message || 'Operación exitosa'),
      (error: any) => this.alert(error?.error?.message || 'Ocurrió un error'),
      message || 'Procesando...'
    );
  }
}
