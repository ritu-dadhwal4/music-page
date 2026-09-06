'use client';

import type { Config } from '@/lib/types';
import { usePlayer } from '@/player/PlayerProvider';
import { EmptyState } from '../EmptyState';
import { Polaroid } from './Polaroid';
import { PlayerCard } from './PlayerCard';
import { UpNextList } from './UpNextList';

/**
 * Single column, top to bottom: header, polaroid, player card, up next.
 * Tablets get this same layout at a wider max-width rather than the desktop
 * structure, which needs the room for the vinyl stage.
 */
export function MobileLayout({ config, isSettingsMode }: { config: Config; isSettingsMode: boolean }) {
  const { tracks } = usePlayer();

  return (
    <div className="mx-auto w-full max-w-[560px] px-4 pt-10 pb-12">
      <header className="text-center">
        <h1 className="font-headline text-[2rem] leading-tight font-medium tracking-wide text-page">
          {config.pageTitle}
        </h1>
        {config.subtitle ? (
          <p className="mt-1 font-headline text-xs tracking-[0.18em] text-page-muted uppercase italic">
            {config.subtitle}
          </p>
        ) : null}
      </header>

      <div className="mt-6">
        <Polaroid photoUrl={config.photoUrl} caption={config.photoCaption} />
      </div>

      {tracks.length === 0 ? (
        <div className="mt-6">
          <EmptyState isSettingsMode={isSettingsMode} />
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <PlayerCard />
          <UpNextList />
        </div>
      )}
    </div>
  );
}
