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
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { environment } from '../../../environments/environment';
import { InputFileComponent } from '../../components/input-file/input-file.component';

@Component({
  selector: 'app-create-edit-playlist',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputComponent,
    InputTimeComponent,
    InputFileComponent,
    StarsComponent,
    DialogModule,
  ],
  templateUrl: './create-edit-playlist.component.html',
  styleUrl: './create-edit-playlist.component.scss',
})
export class CreateEditPlaylistComponent implements OnChanges {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  playlistDTO: PlaylistDTO;
  thumbnailFile: File | null = null;
  isEdit: boolean = false;

  isProduction: boolean = environment.PRODUCTION;

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
    private notificationService: AwesomeNotificationsService,
    private dialog: Dialog
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

      // Asegurarse de que el thumbnail sea una URL válida
      if (
        this.playlistDTO.thumbnail &&
        !this.playlistDTO.thumbnail.startsWith('data:image')
      ) {
        this.playlistDTO.thumbnail = `data:image/png;base64,${this.playlistDTO.thumbnail}`;
      }
    } else {
      this.playlistDTO.state = StateEnum.WATCHED;
    }
  }

  ngOnChanges() {
    this.isEdit = this.playlistDTO && this.playlistDTO.fullName ? true : false;
  }

  private secondsToHMS(seconds: number): string {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  private hmsToSeconds(hms: string): number {
    const [hours, minutes, seconds] = hms.split(':').map(Number);
    return hours * 3600 + minutes * 60 + (seconds || 0);
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

    if (this.playlistDTO.thumbnail) {
      this.playlistDTO.thumbnail = this.playlistDTO.thumbnail.replace(
        'data:image/png;base64,',
        ''
      );
    }

    console.log('Submitting playlistDTO:', this.playlistDTO);

    if (this.isEdit) {
      this.updatePlaylist();
    } else {
      this.createPlaylist();
    }
  }

  public automatizate() {
    const automatePromise = this.searchService
      .automatePlaylist(
        this.playlistDTO.playlistLink
          ? this.playlistDTO.playlistLink
          : 'not-found'
      )
      .then((playlistData) => {
        // Actualizar solo los campos específicos
        this.playlistDTO.realName =
          playlistData.realName || this.playlistDTO.realName;
        this.playlistDTO.fullName =
          playlistData.fullName || this.playlistDTO.fullName;
        this.playlistDTO.shortName =
          playlistData.shortName || this.playlistDTO.shortName;
        this.playlistDTO.orderView =
          playlistData.orderView !== undefined
            ? playlistData.orderView
            : this.playlistDTO.orderView;
        this.playlistDTO.playlistLink = playlistData.playlistLink;
        this.playlistDTO.state = playlistData.state; // Siempre actualizar el estado
        this.playlistDTO.chapters =
          playlistData.chapters !== undefined
            ? playlistData.chapters
            : this.playlistDTO.chapters;

        this.localChapters = playlistData.chapterList || [];
        this.newChapters = [];
      });

    this.notificationService.asyncOperation(
      automatePromise,
      'Buscando información...'
    );
  }

  public exportAsJson() {
    this.playlistDTO.thumbnail = this.playlistDTO.thumbnail?.replace(
      'data:image/png;base64,',
      ''
    );

    const dataStr = JSON.stringify(this.playlistDTO, null, 2);
    const dataUri =
      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileName = `${this.playlistDTO.fullName}-data_${this.getFormattedDateTime()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
  }

  public importAsJson(file: File) {
    const fileName = file.name.toLowerCase();

    // Verifica si el archivo tiene extensión .json
    if (!fileName.endsWith('.json')) {
      this.notificationService.alert('Debes importar un JSON');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        this.playlistDTO = jsonData;
        this.localChapters = this.playlistDTO.chapterList || [];

        // Verifica si el JSON tiene un thumbnail y lo asigna a la variable correspondiente
        if (this.playlistDTO.thumbnail) {
          this.playlistDTO.thumbnail = `data:image/png;base64,${this.playlistDTO.thumbnail}`;
        }

        this.notificationService.info('Datos importados correctamente');
      } catch (error) {
        this.notificationService.alert('Error al analizar el JSON');
        console.error('Error parsing JSON', error);
      }
    };
    reader.readAsText(file);
  }

  // Método para obtener la fecha y hora formateada
  private getFormattedDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
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
    const accentsMap: { [key: string]: string } = {
      á: 'a',
      é: 'e',
      í: 'i',
      ó: 'o',
      ú: 'u',
      Á: 'A',
      É: 'E',
      Í: 'I',
      Ó: 'O',
      Ú: 'U',
      ñ: 'n',
      Ñ: 'N',
    };
  
    // Primero reemplaza los acentos
    value = value.replace(/[áéíóúÁÉÍÓÚñÑ]/g, (match) => accentsMap[match]);

    value = value.toLowerCase();
    value = value.replace(/\s+/g, '-');
    value = value.replace(/[^a-z0-9-]/g, '');

    return value;
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
