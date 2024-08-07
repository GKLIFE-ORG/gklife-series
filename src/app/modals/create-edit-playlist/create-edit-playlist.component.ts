import { ChapterDTO, StateEnum } from './../../models/serie.model';
import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { PlaylistDTO } from '../../models/serie.model';
import { PlaylistService } from '../../services/playlist.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StarsComponent } from '../../components/stars/stars.component';
import { InputComponent } from '../../components/input/input.component';
import { Router } from '@angular/router';
import { AwesomeNotificationsService } from '../../services/awesome-notifications.service';
import { SearchService } from '../../services/search.service';
import { InputTimeComponent } from '../../components/input-time/input-time.component';

@Component({
  selector: 'app-create-edit-playlist',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, InputTimeComponent, StarsComponent],
  templateUrl: './create-edit-playlist.component.html',
  styleUrl: './create-edit-playlist.component.scss',
})
export class CreateEditPlaylistComponent implements OnChanges {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  playlistDTO: PlaylistDTO;
  thumbnailFile: File | null = null;
  isEdit: boolean = false;

  newChapters: ChapterDTO[] = [];
  localChapters: ChapterDTO[] = [];

  showRemoveButton: boolean = true;

  public stateOptions = [
    { key: StateEnum.WATCHED, value: 'Finalizada' },
    { key: StateEnum.WATCHING, value: 'En curso' },
    { key: StateEnum.NOT_WATCHED, value: 'No vista' },
  ];

  constructor(
    public dialogRef: MatDialogRef<CreateEditPlaylistComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { playlist: PlaylistDTO; newOrderView: number },
    private playlistService: PlaylistService,
    private searchService: SearchService,
    private notificationService: AwesomeNotificationsService
  ) {
    this.notificationService.configNotifications();

    this.playlistDTO = data.playlist ? { ...data.playlist } : new PlaylistDTO();
    this.isEdit = !!data.playlist; // si data.playlist es undefined, se asigna false, si no, true

    if (!this.isEdit) {
      this.playlistDTO.orderView = data.newOrderView;
    }

    this.localChapters = this.isEdit ? [...this.playlistDTO.chapterList!] : [];
  }

  ngOnInit() {
    if (this.isEdit) {
      this.playlistDTO.state = this.convertState(this.playlistDTO.state);
    } else {
      this.playlistDTO.state = StateEnum.WATCHED;
    }
  }

  ngOnChanges() {
    this.isEdit = this.playlistDTO && this.playlistDTO.fullName ? true : false;
  }

  private secondsToHMS(seconds: number): string {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  private hmsToSeconds(hms: string): number {
    const [hours, minutes, seconds] = hms.split(':').map(Number);
    return (hours * 3600) + (minutes * 60) + (seconds || 0);
  }

  convertState(state: StateEnum | string | undefined): StateEnum {
    if (typeof state === 'string') {
      switch (state) {
        case 'WATCHED':
          return StateEnum.WATCHED;
        case 'WATCHING':
          return StateEnum.WATCHING;
        case 'NOT_WATCHED':
          return StateEnum.NOT_WATCHED;
      }
    }
    return state as StateEnum;
  }

  addNewChapterField() {
    const newChapterNumber = this.isEdit
      ? this.localChapters.length + this.newChapters.length + 1
      : this.newChapters.length + 1;

    this.newChapters.push({
      chapterNumber: newChapterNumber,
      ytId: '',
      viewedTime: '00:00:00',
      totalTime: '00:00:00',
    });

    this.scrollToBottom();

    this.showRemoveButton = false;
  }

  removeChapter(index: number, type: string) {
    if (type === 'existing') {
      this.localChapters.splice(index, 1);
      this.localChapters.forEach((chapter, i) => {
        chapter.chapterNumber = i + 1;
      });
    } else if (type === 'new') {
      this.newChapters.splice(index, 1);
      this.newChapters.forEach((chapter, i) => {
        chapter.chapterNumber = this.localChapters.length + i + 1;
      });
    }
  }

  private scrollToBottom() {
    setTimeout(() => {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    }, 0);
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
    if (!this.playlistDTO.chapterList) {
      this.playlistDTO.chapterList = [];
    }

    this.newChapters.forEach((newChapter) => {
      this.localChapters.push({
        chapterNumber: this.localChapters.length + 1,
        ytId: newChapter.ytId,
        viewedTime: '00:00:00',
        totalTime: newChapter.totalTime,
      });
    });

    this.newChapters = [];

    this.playlistDTO.chapterList = this.localChapters;

    console.log('Submitting playlistDTO:', this.playlistDTO);

    if (this.isEdit) {
      this.updatePlaylist();
    } else {
      this.createPlaylist();
    }
  }

  public onAutomatizate() {
    const automatePromise = this.searchService
      .automatePlaylist(this.playlistDTO.playlistLink ? this.playlistDTO.playlistLink : 'not-found')
      .then((playlistData) => {
        // Actualizar solo los campos específicos
        this.playlistDTO.realName = playlistData.realName || this.playlistDTO.realName;
        this.playlistDTO.fullName = playlistData.fullName || this.playlistDTO.fullName;
        this.playlistDTO.shortName = playlistData.shortName || this.playlistDTO.shortName;
        this.playlistDTO.orderView = playlistData.orderView !== undefined ? playlistData.orderView : this.playlistDTO.orderView;
        this.playlistDTO.playlistLink = playlistData.playlistLink;
        this.playlistDTO.state = playlistData.state; // Siempre actualizar el estado
        this.playlistDTO.chapters = playlistData.chapters !== undefined ? playlistData.chapters : this.playlistDTO.chapters;
        
        this.localChapters = playlistData.chapterList || [];
        this.newChapters = [];
      });

    this.notificationService.asyncOperation(
      automatePromise,
      'Buscando información...'
    );
  }

  private createPlaylist() {
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

  public onNoClick(): void {
    this.dialogRef.close();
  }

  close() {
    console.log('hola');
  }

  public onRealNameChange(value: string, valueFromChange: string) {
    if (valueFromChange === 'realName') {
      this.playlistDTO.realName = value;
      this.playlistDTO.fullName = this.formatFullName(value);
      this.playlistDTO.shortName = this.formatShortName(value);
    } else if (valueFromChange === 'fullName') {
      this.playlistDTO.fullName = this.formatFullName(value);
      this.playlistDTO.realName = this.formatRealName(value);
      this.playlistDTO.shortName = this.formatShortName(
        this.playlistDTO.realName
      );
    }
  }

  private formatFullName(value: string): string {
    return value.toLowerCase().replace(/\s+/g, '-');
  }

  private formatRealName(value: string): string {
    const excludeWords = [
      'de',
      'que',
      'y',
      'a',
      'o',
      'pero',
      'mas',
      'ni',
      'e',
      'u',
      'las',
      'son',
      'tu',
    ];
    return value
      .split('-')
      .map((word) =>
        excludeWords.includes(word)
          ? word
          : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(' ');
  }

  private formatShortName(value: string): string {
    return value
      .split(' ')
      .map((word) => word.charAt(0).toLowerCase())
      .join('');
  }
}
