export class AuthRequest {
  public username: string = '';
  public password: string = '';
}

export class AuthResponse {
  public message?: string = '';
  public token?: string = '';
  public isTokenValid?: boolean = false;
}
