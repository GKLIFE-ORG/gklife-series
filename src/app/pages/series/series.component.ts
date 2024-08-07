import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { YtVideoEmbedComponent } from '../../components/yt-video-embed/yt-video-embed.component';
import { InputComponent } from '../../components/input/input.component';
import { PlaylistDTO, StateEnum } from '../../models/serie.model';
import { PlaylistService } from '../../services/playlist.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CreateEditPlaylistComponent } from '../../modals/create-edit-playlist/create-edit-playlist.component';
import { Subscription } from 'rxjs/internal/Subscription';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
} from '@angular/material/dialog';
import { ConfirmActionComponent } from '../../modals/confirm-action/confirm-action.component';
import { Observable } from 'rxjs/internal/Observable';
import { FilterSeriesComponent } from '../../modals/filter-series/filter-series.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';

@Component({
  selector: 'app-series',
  standalone: true,
  imports: [
    MatDialogModule,
    RouterModule,
    NavbarComponent,
    YtVideoEmbedComponent,
    InputComponent,
    CommonModule,
    FormsModule,
    CreateEditPlaylistComponent,
    SpinnerComponent
  ],
  templateUrl: './series.component.html',
  styleUrl: './series.component.scss',
})
export class SeriesComponent {
  public playlistDTO: PlaylistDTO = new PlaylistDTO();
  public playlists: PlaylistDTO[] = [];
  private subscription!: Subscription;
  private dialogConfig!: MatDialogConfig;
  public isLoading: boolean = true;

  constructor(
    private playlistService: PlaylistService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.subscription = this.playlistService.playlists$.subscribe(
      (playlists) => {
        this.playlists = playlists;
        this.isLoading = false;
        this.isCreatingPath();
      },
      (error) => {
        console.error(error);
      }
    );

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

    // this.openCreateDialog();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private isCreatingPath(): void {
    const currentUrl = this.router.url;
    if (currentUrl === '/series/nueva') {
      this.router.navigate(['/series']);
      this.openCreateDialog();
    }
  }

  public loadPlaylists() {
    this.playlistService.getAllPlaylists().subscribe();
  }

  public openCreateDialog() {
    const newOrderView = this.playlists.length + 1;
    this.dialogConfig.data = { playlist: null, newOrderView: newOrderView };

    const dialogRef = this.dialog.open(
      CreateEditPlaylistComponent,
      this.dialogConfig
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.playlistService.refreshPlaylists();
      }
    });
  }

  public openFilterDialog() {
    this.dialogConfig.data = { playlist: null };

    const dialogRef = this.dialog.open(FilterSeriesComponent, {
      data: { playlist: null },
      width: '90%',
      maxWidth: '820px',
      height: 'auto',
      maxHeight: '80vh',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '300ms',
      hasBackdrop: true,
      autoFocus: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.playlistService.refreshPlaylists();
      }
    });
  }

  public openEditDialog(playlist: PlaylistDTO) {
    this.dialogConfig.data = { playlist: playlist };

    const dialogRef = this.dialog.open(
      CreateEditPlaylistComponent,
      this.dialogConfig
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.playlistService.refreshPlaylists();
      }
    });
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

    this.playlistService.updatePlaylistState(playlist.shortName, newStateName).subscribe(
      () => {
        this.playlistService.refreshPlaylists();
      },
    );
  }

  public deletePlaylist(identifier: string) {
    this.confirmDeleteDialog().subscribe((confirmation) => {
      if (confirmation) {
        this.playlistService.deletePlaylist(identifier).subscribe(
          (response) => {
            console.log(response);
            this.playlistService.refreshPlaylists();
          },
          (error) => {
            console.error(error);
          }
        );
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

  public navigate(link: string, openInNewTab: boolean): void {
    if (openInNewTab) {
      window.open(link, '_blank');
    } else {
      this.router.navigate([link]);
    }
  }

  public changeDateFormat(date: string) {
    return date.replaceAll('-', '/');
  }

  public getThumbnailImage(thumbnail: string): string {
    return thumbnail == 'no-have-thumbmail'
      ? 'assets/imgs/no-have-thumbmail.png'
      : `data:image/jpeg;base64,${thumbnail}`;
  }
}
