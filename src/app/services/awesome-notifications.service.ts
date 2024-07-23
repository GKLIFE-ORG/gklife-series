import { Injectable } from '@angular/core';
import AWN from 'awesome-notifications';

@Injectable({
  providedIn: 'root'
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
    this.notifier.success(message);
  }

  public alert(message: string): void {
    this.notifier.alert(message);
  }
}
