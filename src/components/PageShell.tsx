'use client';

import { useConfig } from '@/settings/ConfigProvider';
import { PageBackground } from './PageBackground';
import { PlayerProvider } from '@/player/PlayerProvider';
import { Notice } from './Notice';
import { MobileLayout } from './mobile/MobileLayout';
import { DesktopLayout } from './desktop/DesktopLayout';
import { SettingsHost } from '@/settings/SettingsHost';

export function PageShell() {
  const { config, isSettingsMode } = useConfig();

  return (
    <div className={config.textTheme === 'light' ? 'page-text-light' : 'page-text-dark'}>
      <PageBackground config={config} />

      <PlayerProvider tracks={config.tracks}>
        {/*
          Both layouts render on the server and are gated with CSS, so the page
          never flashes the wrong one and no user-agent sniffing is involved.
          Only the player iframe picks a side at runtime, which is invisible
          because playback starts paused.
        */}
        <div className="lg:hidden">
          <MobileLayout config={config} isSettingsMode={isSettingsMode} />
        </div>
        <div className="hidden lg:block">
          <DesktopLayout config={config} isSettingsMode={isSettingsMode} />
        </div>
        <Notice />
      </PlayerProvider>

      <SettingsHost />
    </div>
  );
}
