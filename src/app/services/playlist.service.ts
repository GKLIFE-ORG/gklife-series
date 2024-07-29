import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PlaylistDTO } from '../models/serie.model';
import { AwesomeNotificationsService } from './awesome-notifications.service';
import { catchError } from 'rxjs/internal/operators/catchError';
import { tap } from 'rxjs/internal/operators/tap';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private backendUrl = environment.BACKEND_URL + '/series/playlist';
  private playlistsSubject: BehaviorSubject<PlaylistDTO[]> =
    new BehaviorSubject<PlaylistDTO[]>([]);
  public playlists$: Observable<PlaylistDTO[]> =
    this.playlistsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private awnService: AwesomeNotificationsService
  ) {
    this.loadPlaylists();
  }

  private loadPlaylists() {
    this.http
      .get<PlaylistDTO[]>(`${this.backendUrl}/all`)
      .pipe(
        catchError((error) => {
          this.awnService.alert(error.error.message);
          return of([] as PlaylistDTO[]);
        }),
        tap((playlists) => this.playlistsSubject.next(playlists))
      )
      .subscribe();
  }

  public refreshPlaylists() {
    this.loadPlaylists();
  }

  public getAllPlaylists(): Observable<PlaylistDTO[]> {
    return this.playlists$;
  }

  public createPlaylist(
    playlistDTO: PlaylistDTO,
    thumbnail?: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append(
      'playlistDTO',
      new Blob([JSON.stringify(playlistDTO)], { type: 'application/json' })
    );
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    return this.http.post(`${this.backendUrl}/create`, formData).pipe(
      tap(() => this.refreshPlaylists()),
      map((response: any) => {
        this.awnService.success(
          response.message || 'Playlist created successfully'
        );
        return response;
      }),
      catchError((error) => {
        this.awnService.alert(error.error.message);
        throw error;
      })
    );
  }

  public updatePlaylist(
    identifier: string,
    playlistDTO: PlaylistDTO,
    thumbnail?: File
  ): Observable<any> {
    const formData = new FormData();
    formData.append(
      'playlistDTO',
      new Blob([JSON.stringify(playlistDTO)], { type: 'application/json' })
    );
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    return this.http
      .put(`${this.backendUrl}/update?identifier=${identifier}`, formData)
      .pipe(
        tap(() => this.refreshPlaylists()),
        map((response: any) => {
          this.awnService.success(
            response.message || 'Playlist actualizada correctamente'
          );
          this.getAllPlaylists().subscribe();
          return response;
        }),
        catchError((error) => {
          this.awnService.alert(error.error.message);
          throw error;
        })
      );
  }

  public deletePlaylist(identifier: string): Observable<any> {
    return this.http
      .delete(`${this.backendUrl}/delete?identifier=${identifier}`)
      .pipe(
        tap(() => this.refreshPlaylists()),
        map((response: any) => {
          this.awnService.success(
            response.message || 'Playlist deleted successfully'
          );
          this.getAllPlaylists().subscribe();
          return response;
        }),
        catchError((error) => {
          this.awnService.alert(error.error.message);
          throw error;
        })
      );
  }
}
