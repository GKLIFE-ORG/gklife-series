import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PlaylistDTO, StateEnum } from '../models/serie.model';
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
  // Lista de playlists
  private playlistsSubject: BehaviorSubject<PlaylistDTO[]> = new BehaviorSubject<PlaylistDTO[]>([]);
  public playlists$: Observable<PlaylistDTO[]> = this.playlistsSubject.asObservable();
  // Playlist individual
  private playlistSubject: BehaviorSubject<PlaylistDTO | null> = new BehaviorSubject<PlaylistDTO | null>(null);
  public playlist$: Observable<PlaylistDTO | null> = this.playlistSubject.asObservable();

  constructor(
    private http: HttpClient,
    private awnService: AwesomeNotificationsService
  ) {
    this.loadPlaylists();
  }

  setPlaylistData(data: PlaylistDTO) {
    this.playlistSubject.next(data);
  }

  getPlaylistData(): PlaylistDTO | null {
    return this.playlistSubject.value;
  }

  public destroyPlaylistData() {
    this.playlistSubject.next(null);
  }

  public refreshPlaylists() {
    this.loadPlaylists();
  }

  public getAllPlaylists(): Observable<PlaylistDTO[]> {
    return this.playlists$;
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

  public getPlaylist(identifier: string): Observable<PlaylistDTO> {
    return this.http
      .get<PlaylistDTO>(`${this.backendUrl}/specific/${identifier}`)
      .pipe(
        tap((playlist) => {
          this.playlistSubject.next(playlist);
          console.log(playlist);
        }),
        catchError((error) => {
          this.awnService.alert(error.error.message);
          throw error;
        })
      );
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
        tap(() => {
          this.refreshPlaylists();
          this.playlistSubject.next(playlistDTO);
        }),
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

  public updatePlaylistState(identifier: string, state: string): Observable<any> {
    console.log(identifier, state);
    return this.http
      .put(`${this.backendUrl}/update/state`, null, {
        params: {
          identifier,
          state,
        }
      })
      .pipe(
        tap(() => this.refreshPlaylists()),
        map((response: any) => {
          this.awnService.info(
            response.message || 'Estado actualizado'
          );
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
        tap(() => {
          this.refreshPlaylists();
          this.playlistSubject.next(null);
        }),
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
