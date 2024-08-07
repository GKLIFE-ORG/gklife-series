import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { PlaylistDTO } from '../models/serie.model';
import { AwesomeNotificationsService } from './awesome-notifications.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private backendUrl = environment.BACKEND_URL + '/search';

  constructor(
    private http: HttpClient,
    private awnService: AwesomeNotificationsService
  ) {}

  public automatePlaylist(playlistYtUrl: string): Promise<PlaylistDTO> {
    const url = `${this.backendUrl}/playlist-data?playlistYtUrl=${playlistYtUrl}`;
    return this.http.get<PlaylistDTO>(url).toPromise() as Promise<PlaylistDTO>;
  }
}
