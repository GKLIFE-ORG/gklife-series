import { Component, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-yt-video-embed',
  standalone: true,
  imports: [],
  templateUrl: './yt-video-embed.component.html',
  styleUrl: './yt-video-embed.component.scss',
})
export class YtVideoEmbedComponent {
  public mainSrcOption!: SafeResourceUrl;
  @Input() ytId: string = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.updateVideoUrl();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ytId']) {
      this.updateVideoUrl();
    }
  }

  private updateVideoUrl() {
    this.mainSrcOption = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${this.ytId}`
    );
  }
}
