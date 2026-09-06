'use client';

import type { Config } from '@/lib/types';

/** Thin, full width. Title, a hairline divider, then the subtitle. */
export function TopBar({ config }: { config: Config }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-outline-variant/40 bg-surface/70 px-6 backdrop-blur-sm">
      <h1 className="font-headline text-xl leading-none font-medium text-page">
        {config.pageTitle}
      </h1>
      {config.subtitle ? (
        <>
          <span aria-hidden className="h-5 w-px bg-outline-variant" />
          <p className="font-headline text-[0.7rem] tracking-[0.18em] text-page-muted uppercase italic">
            {config.subtitle}
          </p>
        </>
      ) : null}
    </header>
  );
}
