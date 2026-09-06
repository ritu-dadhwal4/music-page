/**
 * Minimal typings for the bits of the YouTube IFrame API this app touches.
 * The published @types package pulls in a lot for a handful of methods.
 */
export type YTPlayer = {
  loadVideoById(videoId: string, startSeconds?: number): void;
  cueVideoById(videoId: string, startSeconds?: number): void;
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  setVolume(volume: number): void;
  getVolume(): number;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  destroy(): void;
};

export const PlayerState = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
} as const;

type YTNamespace = {
  Player: new (element: HTMLElement | string, options: unknown) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;

/** Loads the IFrame API script exactly once per page, however many callers ask. */
export function loadYouTubeApi(): Promise<YTNamespace> {
  if (apiPromise) return apiPromise;

  apiPromise = new Promise<YTNamespace>((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('YouTube IFrame API can only load in the browser'));
      return;
    }
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }

    // The API calls this global once it is ready. Chain any existing handler
    // so we never clobber another script's callback.
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT?.Player) resolve(window.YT);
      else reject(new Error('YouTube IFrame API loaded without a Player constructor'));
    };

    const existing = document.querySelector<HTMLScriptElement>('script[data-yt-iframe-api]');
    if (!existing) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.dataset.ytIframeApi = 'true';
      script.onerror = () => reject(new Error('Could not load the YouTube player'));
      document.head.appendChild(script);
    }
  });

  return apiPromise;
}
