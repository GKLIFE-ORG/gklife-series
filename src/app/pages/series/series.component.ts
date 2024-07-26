import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { YtVideoEmbedComponent } from '../../components/yt-video-embed/yt-video-embed.component';
import { InputComponent } from '../../components/input/input.component';

@Component({
  selector: 'app-series',
  standalone: true,
  imports: [NavbarComponent, YtVideoEmbedComponent, InputComponent],
  templateUrl: './series.component.html',
  styleUrl: './series.component.scss',
})
export class SeriesComponent {}
