import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { YtVideoEmbedComponent } from '../../components/yt-video-embed/yt-video-embed.component';
import { InputComponent } from '../../components/input/input.component';
import { PlaylistDTO } from '../../models/serie.model';
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
  ],
  templateUrl: './series.component.html',
  styleUrl: './series.component.scss',
})
export class SeriesComponent {
  public playlistDTO: PlaylistDTO = new PlaylistDTO();
  public playlists: PlaylistDTO[] = [];
  private subscription!: Subscription;
  private dialogConfig!: MatDialogConfig;

  constructor(
    private playlistService: PlaylistService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.subscription = this.playlistService.playlists$.subscribe(
      (playlists) => {
        this.playlists = playlists;
      },
      (error) => {
        console.error(error);
      }
    );
    this.loadPlaylists();

    this.dialogConfig = new MatDialogConfig();
    this.dialogConfig.data = { playlist: null };
    this.updateDialogConfig(false);
    this.dialogConfig.enterAnimationDuration = '500ms';
    this.dialogConfig.exitAnimationDuration = '300ms';
    this.dialogConfig.hasBackdrop = true;
    this.dialogConfig.autoFocus = true;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public loadPlaylists() {
    this.playlistService.getAllPlaylists().subscribe();
  }

  public openCreateDialog() {
    this.updateDialogConfig(false);

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

  public openEditDialog(playlist: PlaylistDTO) {
    this.updateDialogConfig(true, playlist);

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

  public deletePlaylist(identifier: string) {
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

  private updateDialogConfig(isEdit: boolean = false, playlist?: PlaylistDTO) {
    // Data
    if (isEdit) {
      this.dialogConfig.data = { playlist: PlaylistDTO };
    } else {
      this.dialogConfig.data = { playlist: null };
    }
    // Width and Height
    if (window.innerWidth >= 1280) {
      this.dialogConfig.width = '42.5%';
      this.dialogConfig.height = '80%';
    }
    if (window.innerWidth < 1280) {
      this.dialogConfig.width = '60%';
    }
    if (window.innerWidth < 768) {
      this.dialogConfig.width = '90%';
      this.dialogConfig.height = '90%';
    }
  }
}
