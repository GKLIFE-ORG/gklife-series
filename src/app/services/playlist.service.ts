import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthRequest, AuthResponse } from '../model/auth.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private backendUrl = environment.BACKEND_URL;

  constructor(private http: HttpClient) {}


}
