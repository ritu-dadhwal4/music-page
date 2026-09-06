import type { Config } from '@/lib/types';

/**
 * A half-configured page reads as broken, so a single uploaded background is
 * used for both breakpoints rather than falling back to the plain gradient.
 * The Appearance tab says so in the UI where the owner can see it.
 */
export function PageBackground({ config }: { config: Config }) {
  const mobile = config.backgroundMobileUrl ?? config.backgroundDesktopUrl;
  const desktop = config.backgroundDesktopUrl ?? config.backgroundMobileUrl;

  return (
    <div aria-hidden className="fixed inset-0 -z-10 bg-surface">
      {/* The warm cream gradient from the design, used whenever no photo is set. */}
      <div className="absolute inset-0 bg-linear-to-br from-[#f7ede1] via-surface to-[#f1e3d6]" />

      {mobile ? (
        <div
          className="absolute inset-0 bg-cover bg-center lg:hidden"
          style={{ backgroundImage: `url(${JSON.stringify(mobile)})` }}
        />
      ) : null}

      {desktop ? (
        <div
          className="absolute inset-0 hidden bg-cover bg-center lg:block"
          style={{ backgroundImage: `url(${JSON.stringify(desktop)})` }}
        />
      ) : null}

      {config.overlayOpacity > 0 ? (
        <div className="absolute inset-0 bg-black" style={{ opacity: config.overlayOpacity }} />
      ) : null}
    </div>
  );
}
