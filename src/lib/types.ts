export type Track = {
  id: string;
  youtubeId: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: number | null;
};

export type TextTheme = 'dark' | 'light';

export type Config = {
  version: 1;
  pageTitle: string;
  subtitle: string;
  photoUrl: string | null;
  photoCaption: string;
  backgroundMobileUrl: string | null;
  backgroundDesktopUrl: string | null;
  overlayOpacity: number;
  textTheme: TextTheme;
  tracks: Track[];
};
