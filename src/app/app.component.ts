import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AwesomeNotificationsService } from './services/awesome-notifications.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'GlobitoKuki';

  constructor(
    private awnService: AwesomeNotificationsService
  ) {}

  ngOnInit() {
    this.awnService.configNotifications();
  }
}
