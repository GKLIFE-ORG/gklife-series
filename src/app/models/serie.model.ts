export class PlaylistDTO {
  public realName: string = '';
  public fullName: string = '';
  public shortName: string = '';

  public orderView?: number;
  public thumbnail?: string;

  public startViewingDate?: string;
  public endViewingDate?: string;
  public description?: string;
  public playlistLink?: string;

  public ourComment?: string;
  public starsKuki?: number;
  public starsGlobito?: number;

  public state?: StateEnum | string;

  public lastChapterViewed?: number;
  public lastChapterViewedTotalTime?: string;
  public lastChapterViewedActualTime?: string;

  public chapters?: number;
  public chapterList?: ChapterDTO[];
}

export class ChapterDTO {
  public chapterNumber: number = 1;
  public ytId?: string;

  public viewedTime?: string;
  public totalTime?: string;

  public havePreviousChapter?: boolean;
  public haveNextChapter?: boolean;
}

export enum StateEnum {
  WATCHED = 'WATCHED',
  WATCHING = 'WATCHING',
  NOT_WATCHED = 'NOT_WATCHED'
}
