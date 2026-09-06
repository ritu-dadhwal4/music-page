'use client';

import { useEffect, useState } from 'react';
import { fallbackThumbnail } from '@/lib/youtube';

/**
 * `maxresdefault` is missing for plenty of uploads and answers with a 404 or a
 * grey placeholder when it is, so every thumbnail falls back to `mqdefault`.
 * Both are true 16:9 - width and height are set explicitly so rows keep their
 * height while images load rather than reflowing the list.
 */
export function Thumbnail({
  src,
  youtubeId,
  alt,
  width,
  height,
  className = '',
}: {
  src: string;
  youtubeId: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  const [current, setCurrent] = useState(src);

  useEffect(() => setCurrent(src), [src]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      onError={() => {
        const fallback = fallbackThumbnail(youtubeId);
        if (current !== fallback) setCurrent(fallback);
      }}
      className={`bg-surface-container object-cover ${className}`}
      style={{ width, height }}
    />
  );
}
