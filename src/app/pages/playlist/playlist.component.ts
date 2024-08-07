import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';
import { PlaylistDTO, StateEnum } from '../../models/serie.model';
import { StarsComponent } from '../../components/stars/stars.component';
import { InputComponent } from '../../components/input/input.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { CreateEditPlaylistComponent } from '../../modals/create-edit-playlist/create-edit-playlist.component';
import { Observable } from 'rxjs/internal/Observable';
import { ConfirmActionComponent } from '../../modals/confirm-action/confirm-action.component';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [
    NavbarComponent,
    StarsComponent,
    InputComponent,
    SpinnerComponent,
    RouterModule,
  ],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss',
})
export class PlaylistComponent {
  private dialogConfig!: MatDialogConfig;
  public playlist: PlaylistDTO = new PlaylistDTO();
  public playlistStateStr: string = '';
  public isLoading: boolean = true;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private playlistService: PlaylistService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.subscriptions.add(
      this.playlistService.playlist$.subscribe((playlist) => {
        if (playlist) {
          this.playlist = playlist;
          this.changeStateName();
          this.isLoading = false;
        } else {
          this.isLoading = true;
        }
      })
    );

    this.loadPlaylist();

    this.dialogConfig = new MatDialogConfig();
    this.dialogConfig.width = '90%';
    this.dialogConfig.maxWidth = '820px';
    this.dialogConfig.height = 'auto';
    this.dialogConfig.maxHeight = '80vh';
    this.dialogConfig.data = { playlist: null };
    this.dialogConfig.enterAnimationDuration = '500ms';
    this.dialogConfig.exitAnimationDuration = '300ms';
    this.dialogConfig.hasBackdrop = true;
    this.dialogConfig.autoFocus = true;
    
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  str(str: number): string {
    return str.toString();
  }

  private loadPlaylist() {
    const currentUrl = this.router.url;
    const playlistId = this.extractPlaylistId(currentUrl);
    if (playlistId) {
      this.playlistService.getPlaylist(playlistId).subscribe(
        (playlist) => {
          this.playlist = playlist;
          this.changeStateName();
          this.isLoading = false;
        },
        (error) => {
          if (error.status === 404) {
            this.router.navigate(['/series']);
            this.isLoading = true;
          }
        }
      );
    }
  }

  public openEditDialog(playlist: PlaylistDTO) {
    this.dialogConfig.data = { playlist: playlist };

    const dialogRef = this.dialog.open(
      CreateEditPlaylistComponent,
      this.dialogConfig
    );

    dialogRef.afterClosed().subscribe();
  }

  public updatePlaylistState(playlist: PlaylistDTO) {
    let newState: StateEnum;

    switch (playlist.state) {
      case StateEnum.WATCHED:
        newState = StateEnum.WATCHING;
        break;
      case StateEnum.WATCHING:
        newState = StateEnum.NOT_WATCHED;
        break;
      case StateEnum.NOT_WATCHED:
        newState = StateEnum.WATCHED;
        break;
      default:
        newState = StateEnum.WATCHED;
        break;
    }

    const newStateName = newState;

    playlist.state = newState;

    this.playlistService
      .updatePlaylistState(playlist.shortName, newStateName).subscribe(
        () => {
          this.changeStateName();
        },
      );
  }

  public deletePlaylist(identifier: string) {
    this.confirmDeleteDialog().subscribe((confirmation) => {
      if (confirmation) {
        this.playlistService.deletePlaylist(identifier).subscribe();
        this.router.navigate(['/series']);
      }
    });
  }

  private confirmDeleteDialog(): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmActionComponent, {
      data: {
        title: 'Confirmar eliminación',
        text: '¿Estás seguro de que deseas eliminar esta playlist?',
        confirmIcon: 'fa-solid fa-trash',
        confirmText: 'Eliminar',
      },
      height: 'auto',
      width: '90vw',
      maxHeight: '250px',
      maxWidth: '500px',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '300ms',
      hasBackdrop: true,
      autoFocus: true,
    });

    return dialogRef.afterClosed();
  }

  onRatingGlobitoChange(newRating: number) {
    this.playlist.starsGlobito = newRating;
    this.updatePlaylist();
  }

  onRatingKukiChange(newRating: number) {
    this.playlist.starsKuki = newRating;
    this.updatePlaylist();
  }

  private updatePlaylist() {
    this.playlistService
      .updatePlaylist(this.playlist.fullName, this.playlist)
      .subscribe();
  }

  private changeStateName() {
    switch (this.playlist.state) {
      case StateEnum.WATCHED:
        this.playlistStateStr = 'Finalizada';
        break;
      case StateEnum.WATCHING:
        this.playlistStateStr = 'En curso';
        break;
      case StateEnum.NOT_WATCHED:
        this.playlistStateStr = 'No vista';
        break;
    }
  }

  private extractPlaylistId(url: string): string | null {
    const match = url.match(/\/series\/(.+)$/);
    return match ? match[1] : null;
  }

  public getThumbnailImage(thumbnail: string): string {
    return thumbnail == 'no-have-thumbmail'
      ? 'assets/imgs/no-have-thumbmail.png'
      : `data:image/jpeg;base64,${thumbnail}`;
  }
}
