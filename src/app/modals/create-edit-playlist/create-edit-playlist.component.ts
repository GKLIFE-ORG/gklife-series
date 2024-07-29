import { Component, Inject, Input, OnChanges } from '@angular/core';
import { PlaylistDTO } from '../../models/serie.model';
import { PlaylistService } from '../../services/playlist.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InputComponent } from '../../components/input/input.component';
import { StarsComponent } from '../../components/stars/stars.component';

@Component({
  selector: 'app-create-edit-playlist',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, StarsComponent],
  templateUrl: './create-edit-playlist.component.html',
  styleUrl: './create-edit-playlist.component.scss',
})
export class CreateEditPlaylistComponent implements OnChanges {
  playlistDTO: PlaylistDTO;
  thumbnailFile: File | null = null;
  isEdit: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CreateEditPlaylistComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { playlist: PlaylistDTO },
    private playlistService: PlaylistService
  ) {
    this.playlistDTO = data.playlist ? { ...data.playlist } : new PlaylistDTO();
    this.isEdit = !!data.playlist;
  }

  ngOnChanges() {
    this.isEdit = this.playlistDTO && this.playlistDTO.fullName ? true : false;
  }

  onFileSelected(event: any) {
    this.thumbnailFile = event.target.files[0];
  }

  onRatingGlobitoChange(newRating: number) {
    this.playlistDTO.starsGlobito = newRating;
  }

  onRatingKukiChange(newRating: number) {
    this.playlistDTO.starsKuki = newRating;
  }

  public onSubmit() {
    if (this.isEdit) {
      this.updatePlaylist();
    } else {
      this.createPlaylist();
    }
  }

  private createPlaylist() {
    console.log('creando: ', this.playlistDTO);

    if (this.thumbnailFile) {
      this.playlistService
        .createPlaylist(this.playlistDTO, this.thumbnailFile)
        .subscribe(
          (response) => {
            console.log(response);
            this.dialogRef.close(true);
          },
          (error) => {
            console.error(error);
          }
        );
    } else {
      this.playlistService.createPlaylist(this.playlistDTO).subscribe(
        (response) => {
          console.log(response);
          this.dialogRef.close(true);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  private updatePlaylist() {
    console.log('actualizando: ', this.playlistDTO);

    if (this.thumbnailFile) {
      this.playlistService
        .updatePlaylist(
          this.playlistDTO.fullName,
          this.playlistDTO,
          this.thumbnailFile
        )
        .subscribe(
          (response) => {
            console.log(response);
            this.dialogRef.close(true);
          },
          (error) => {
            console.error(error);
          }
        );
    } else {
      this.playlistService
        .updatePlaylist(this.playlistDTO.fullName, this.playlistDTO)
        .subscribe(
          (response) => {
            console.log(response);
            this.dialogRef.close(true);
          },
          (error) => {
            console.error(error);
          }
        );
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  close() {
    // Esta función será reemplazada dinámicamente
  }
}
