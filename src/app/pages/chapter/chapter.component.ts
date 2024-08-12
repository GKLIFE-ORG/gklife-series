import { PlaylistService } from './../../services/playlist.service';
import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PlaylistDTO, ChapterDTO } from '../../models/serie.model';
import { CommonModule } from '@angular/common';
import { YtVideoEmbedComponent } from '../../components/yt-video-embed/yt-video-embed.component';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-chapter',
  standalone: true,
  imports: [NavbarComponent, CommonModule, RouterModule, YtVideoEmbedComponent],
  templateUrl: './chapter.component.html',
  styleUrl: './chapter.component.scss',
})
export class ChapterComponent {
  playlist!: PlaylistDTO;
  currentChapter!: ChapterDTO;
  private routeSub!: Subscription; // Subscripción para cambios en la ruta

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private playlistService: PlaylistService
  ) {}

  ngOnInit(): void {
    const playlistData = this.playlistService.getPlaylistData();

    if (!playlistData) {
      const serieName = this.route.snapshot.paramMap.get('serie-name')!;
      this.playlistService.getPlaylist(serieName).subscribe(
        (playlist) => {
          this.setPlaylistAndChapter(playlist);
        },
        (error) => {
          this.router.navigate(['/series']); // Si ocurre un error, redirigir a la lista de series.
        }
      );
    } else {
      this.setPlaylistAndChapter(playlistData);
    }

    this.playlistService.playlist$.subscribe((playlist) => {
      if (playlist) {
        this.setPlaylistAndChapter(playlist);
      }
    });

    // Suscripción a cambios en los parámetros de la ruta
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const chapterNumber = +params.get('chapter-number')!;
      this.currentChapter = this.playlist.chapterList!.find(
        (ch) => ch.chapterNumber === chapterNumber
      )!;
    });
  }

  private setPlaylistAndChapter(playlist: PlaylistDTO): void {
    this.playlist = playlist;
  
    const chapterNumber = +this.route.snapshot.paramMap.get('chapter-number')!;
    const chapter = this.playlist.chapterList?.find(
      (ch) => ch.chapterNumber === chapterNumber
    );
  
    if (chapter) {
      this.currentChapter = chapter;
    } else {
      this.router.navigate(['/series', this.playlist.fullName]);
    }
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
