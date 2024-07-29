export class PlaylistDTO {
  public realName: string = '';
  public fullName: string = '';
  public shortName: string = '';
  public orderView?: number;
  public chapters?: number;
  public startViewingDate?: string;
  public endViewingDate?: string;
  public playlistLink?: string;

  public description?: string;
  public ourComment?: string;
  public starsKuki?: number;
  public starsGlobito?: number;

  public thumbnail?: string;
  public chapterList?: ChapterDTO[];
}

export class ChapterDTO {
  public chapterNumber: number = 1;
  public ytId?: string;
}
