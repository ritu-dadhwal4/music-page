'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Track } from '@/lib/types';
import { PlayerState, loadYouTubeApi, type YTPlayer } from './youtube-api';
import { useIsDesktopLayout } from './usePlayerLayout';
import { pickNextIndex } from './queue';

const POLL_MS = 250; // ~4x per second, per spec. Only runs while playing.

export type LayoutKind = 'mobile' | 'desktop';

type PlayerContextValue = {
  tracks: Track[];
  currentIndex: number;
  currentTrack: Track | null;
  isPlaying: boolean;
  isReady: boolean;
  /** True until the first play - the polaroid shows the photo, not the video. */
  hasStarted: boolean;
  currentTime: number;
  /** Config duration when known, otherwise whatever the player reports. */
  duration: number | null;
  volume: number;
  muted: boolean;
  shuffle: boolean;
  repeat: boolean;
  notice: string | null;
  playTrackAt: (index: number) => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seekTo: (seconds: number) => void;
  changeVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  dismissNotice: () => void;
  registerSlot: (layout: LayoutKind, element: HTMLElement | null) => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function usePlayer(): PlayerContextValue {
  const value = useContext(PlayerContext);
  if (!value) throw new Error('usePlayer must be used inside <PlayerProvider>');
  return value;
}

export function PlayerProvider({ tracks, children }: { tracks: Track[]; children: ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [reportedDuration, setReportedDuration] = useState<number | null>(null);
  const [volume, setVolume] = useState(75);
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [slots, setSlots] = useState<Record<LayoutKind, HTMLElement | null>>({
    mobile: null,
    desktop: null,
  });

  /**
   * The player lives in a DOM node React does not own. The IFrame API
   * *replaces* the element it is handed with the iframe, so a React-rendered
   * host would leave React holding a detached node - and unmounting it when
   * the active layout changes would take the player with it. Creating the
   * container by hand and moving it between slots keeps one player alive
   * across the breakpoint.
   */
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ytTargetRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const isDesktop = useIsDesktopLayout();

  // Refs mirror state that the YouTube event callbacks need. Those callbacks
  // are registered once when the player is constructed and would otherwise
  // close over the first render's values forever.
  const tracksRef = useRef(tracks);
  const indexRef = useRef(currentIndex);
  const shuffleRef = useRef(shuffle);
  const repeatRef = useRef(repeat);
  const playedRef = useRef<Set<string>>(new Set());
  /** Videos that failed to load, so a dead run of links cannot loop forever. */
  const failedRef = useRef<Set<string>>(new Set());

  tracksRef.current = tracks;
  indexRef.current = currentIndex;
  shuffleRef.current = shuffle;
  repeatRef.current = repeat;

  const currentTrack = tracks[currentIndex] ?? null;

  // ---- track selection -----------------------------------------------------

  const pickNext = useCallback(
    (fromIndex: number, isAutoAdvance: boolean): number | null =>
      pickNextIndex({
        tracks: tracksRef.current,
        fromIndex,
        shuffle: shuffleRef.current,
        repeat: repeatRef.current,
        isAutoAdvance,
        played: playedRef.current,
      }),
    [],
  );

  // ---- imperative player control -------------------------------------------

  const goToIndex = useCallback((index: number, autoplay: boolean) => {
    const track = tracksRef.current[index];
    if (!track) return;

    setCurrentIndex(index);
    setCurrentTime(0);
    setReportedDuration(null);
    playedRef.current.add(track.id);

    const player = playerRef.current;
    if (!player) return;

    if (autoplay) {
      setHasStarted(true);
      player.loadVideoById(track.youtubeId);
    } else {
      player.cueVideoById(track.youtubeId);
    }
  }, []);

  const advance = useCallback(
    (isAutoAdvance: boolean) => {
      const nextIndex = pickNext(indexRef.current, isAutoAdvance);
      if (nextIndex === null) {
        setIsPlaying(false);
        playedRef.current.clear();
        return;
      }
      goToIndex(nextIndex, true);
    },
    [goToIndex, pickNext],
  );

  const advanceRef = useRef(advance);
  advanceRef.current = advance;

  // The iframe lives in exactly one slot - whichever layout is on screen.
  const activeSlot = isDesktop ? slots.desktop ?? slots.mobile : slots.mobile ?? slots.desktop;

  const ensureContainer = useCallback(() => {
    if (!containerRef.current) {
      const container = document.createElement('div');
      container.className = 'absolute inset-0';
      // The API swaps this child out for the iframe and copies its className,
      // so the iframe ends up filling the container.
      const target = document.createElement('div');
      target.className = 'h-full w-full';
      container.appendChild(target);
      containerRef.current = container;
      ytTargetRef.current = target;
    }
    return containerRef.current;
  }, []);

  // Move the live player into whichever layout is showing. Reparenting an
  // iframe reloads it, so this only ever fires on a real breakpoint crossing.
  useEffect(() => {
    if (!activeSlot) return;
    const container = ensureContainer();
    if (container.parentElement !== activeSlot) activeSlot.appendChild(container);
  }, [activeSlot, ensureContainer]);

  // ---- player construction -------------------------------------------------

  useEffect(() => {
    if (tracks.length === 0 || !activeSlot) return;

    let cancelled = false;

    loadYouTubeApi()
      .then((YT) => {
        const target = ytTargetRef.current;
        if (cancelled || !target || playerRef.current) return;

        playerRef.current = new YT.Player(target, {
          host: 'https://www.youtube-nocookie.com',
          videoId: tracksRef.current[indexRef.current]?.youtubeId,
          playerVars: {
            // Page opens paused, always. A blocked autoplay on mobile reads
            // as a broken site.
            autoplay: 0,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            origin: typeof window !== 'undefined' ? window.location.origin : undefined,
          },
          events: {
            onReady: (event: { target: YTPlayer }) => {
              if (cancelled) return;
              playerRef.current = event.target;
              event.target.setVolume(volume);
              setIsReady(true);
            },
            onStateChange: (event: { data: number }) => {
              if (cancelled) return;
              switch (event.data) {
                case PlayerState.PLAYING:
                  setIsPlaying(true);
                  setHasStarted(true);
                  break;
                case PlayerState.PAUSED:
                  setIsPlaying(false);
                  break;
                case PlayerState.ENDED:
                  advanceRef.current(true);
                  break;
                default:
                  break;
              }
            },
            onError: () => {
              if (cancelled) return;
              const failed = tracksRef.current[indexRef.current];
              if (failed) failedRef.current.add(failed.id);
              setNotice(
                failed
                  ? `“${failed.title}” can’t be played here. Skipping to the next track.`
                  : 'That track can’t be played here. Skipping to the next track.',
              );
              // One dead link must not freeze the page. If every remaining
              // track is dead, stop rather than spin.
              const allDead = tracksRef.current.every((t) => failedRef.current.has(t.id));
              if (allDead) setIsPlaying(false);
              else advanceRef.current(true);
            },
          },
        });
      })
      .catch(() => {
        if (!cancelled) setNotice('The music player could not load. Try refreshing the page.');
      });

    return () => {
      cancelled = true;
    };
    // Constructed once, as soon as a slot exists. Track changes go through
    // loadVideoById - the player is never torn down and rebuilt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks.length > 0, activeSlot !== null]);

  // ---- progress polling ----------------------------------------------------

  useEffect(() => {
    if (!isPlaying || !isReady) return;

    const tick = () => {
      const player = playerRef.current;
      if (!player) return;
      setCurrentTime(player.getCurrentTime() ?? 0);
      const reported = player.getDuration();
      if (typeof reported === 'number' && reported > 0) setReportedDuration(reported);
    };

    tick();
    const id = window.setInterval(tick, POLL_MS);
    return () => window.clearInterval(id);
  }, [isPlaying, isReady]);

  // A stale notice should not sit on screen indefinitely.
  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(null), 6000);
    return () => window.clearTimeout(id);
  }, [notice]);

  // ---- public actions ------------------------------------------------------

  const playTrackAt = useCallback(
    (index: number) => {
      if (index === indexRef.current && playerRef.current && hasStarted) {
        // Tapping the row that is already playing toggles instead of restarting.
        if (isPlaying) playerRef.current.pauseVideo();
        else playerRef.current.playVideo();
        return;
      }
      failedRef.current.delete(tracksRef.current[index]?.id ?? '');
      goToIndex(index, true);
    },
    [goToIndex, hasStarted, isPlaying],
  );

  const togglePlay = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (isPlaying) player.pauseVideo();
    else player.playVideo();
  }, [isPlaying]);

  const next = useCallback(() => advanceRef.current(false), []);

  const previous = useCallback(() => {
    const player = playerRef.current;
    // Standard transport behaviour: restart the track unless we are near its
    // start, in which case step back a track.
    if (player && player.getCurrentTime() > 3) {
      player.seekTo(0, true);
      setCurrentTime(0);
      return;
    }
    const list = tracksRef.current;
    if (list.length === 0) return;
    const prevIndex = (indexRef.current - 1 + list.length) % list.length;
    goToIndex(prevIndex, true);
  }, [goToIndex]);

  const seekTo = useCallback((seconds: number) => {
    const player = playerRef.current;
    if (!player) return;
    player.seekTo(seconds, true);
    setCurrentTime(seconds);
  }, []);

  const changeVolume = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(next)));
    setVolume(clamped);
    const player = playerRef.current;
    if (!player) return;
    player.setVolume(clamped);
    if (clamped === 0) {
      player.mute();
      setMuted(true);
    } else if (player.isMuted()) {
      player.unMute();
      setMuted(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (player.isMuted()) {
      player.unMute();
      setMuted(false);
    } else {
      player.mute();
      setMuted(true);
    }
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle((on) => {
      // Starting a shuffle run begins a fresh cycle from the current track.
      playedRef.current = new Set(
        on ? [] : [tracksRef.current[indexRef.current]?.id].filter(Boolean) as string[],
      );
      return !on;
    });
  }, []);

  const toggleRepeat = useCallback(() => setRepeat((on) => !on), []);

  const dismissNotice = useCallback(() => setNotice(null), []);

  const registerSlot = useCallback((layout: LayoutKind, element: HTMLElement | null) => {
    setSlots((current) => (current[layout] === element ? current : { ...current, [layout]: element }));
  }, []);

  const duration =
    currentTrack?.duration ??
    (reportedDuration && reportedDuration > 0 ? reportedDuration : null);

  const value = useMemo<PlayerContextValue>(
    () => ({
      tracks,
      currentIndex,
      currentTrack,
      isPlaying,
      isReady,
      hasStarted,
      currentTime,
      duration,
      volume,
      muted,
      shuffle,
      repeat,
      notice,
      playTrackAt,
      togglePlay,
      next,
      previous,
      seekTo,
      changeVolume,
      toggleMute,
      toggleShuffle,
      toggleRepeat,
      dismissNotice,
      registerSlot,
    }),
    [
      tracks, currentIndex, currentTrack, isPlaying, isReady, hasStarted, currentTime,
      duration, volume, muted, shuffle, repeat, notice, playTrackAt, togglePlay, next,
      previous, seekTo, changeVolume, toggleMute, toggleShuffle, toggleRepeat,
      dismissNotice, registerSlot,
    ],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
