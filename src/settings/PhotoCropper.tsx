'use client';

import { useEffect, useRef, useState } from 'react';

const FRAME = 260; // on-screen crop frame, px
const OUTPUT = 1000; // matches the server's photo target

/**
 * Square crop step for the polaroid photo. Drag to pan, slider to zoom; the
 * visible frame is exactly what gets saved. Cropping here rather than
 * server-side means the owner chooses the subject instead of an algorithm.
 */
export function PhotoCropper({
  file,
  onCancel,
  onCropped,
}: {
  file: File;
  onCancel: () => void;
  onCropped: (blob: Blob) => void;
}) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => setImage(img);
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!image) {
    return <p className="py-8 text-center text-sm text-secondary">Loading image…</p>;
  }

  // Scale so the shorter edge fills the frame at zoom 1 - no empty corners.
  const baseScale = FRAME / Math.min(image.width, image.height);
  const scale = baseScale * zoom;
  const drawW = image.width * scale;
  const drawH = image.height * scale;

  const clamp = (value: number, extent: number) => {
    const limit = Math.max(0, (extent - FRAME) / 2);
    return Math.min(limit, Math.max(-limit, value));
  };

  const x = clamp(offset.x, drawW);
  const y = clamp(offset.y, drawH);

  function onPointerDown(event: React.PointerEvent) {
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    dragRef.current = { x: event.clientX, y: event.clientY, ox: x, oy: y };
  }

  function onPointerMove(event: React.PointerEvent) {
    const drag = dragRef.current;
    if (!drag) return;
    setOffset({
      x: drag.ox + (event.clientX - drag.x),
      y: drag.oy + (event.clientY - drag.y),
    });
  }

  function finish() {
    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT;
    canvas.height = OUTPUT;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Map the on-screen frame back onto the source image.
    const ratio = OUTPUT / FRAME;
    ctx.drawImage(
      image!,
      (FRAME / 2 - drawW / 2 + x) * ratio,
      (FRAME / 2 - drawH / 2 + y) * ratio,
      drawW * ratio,
      drawH * ratio,
    );
    canvas.toBlob((blob) => blob && onCropped(blob), 'image/webp', 0.9);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-secondary">Drag to reposition, then save.</p>

      <div
        className="relative mx-auto touch-none overflow-hidden rounded-xl bg-on-surface"
        style={{ width: FRAME, height: FRAME }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => { dragRef.current = null; }}
        onPointerCancel={() => { dragRef.current = null; }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.src} alt="" draggable={false}
          className="absolute cursor-grab select-none active:cursor-grabbing"
          style={{
            width: drawW, height: drawH, maxWidth: 'none',
            left: FRAME / 2 - drawW / 2 + x,
            top: FRAME / 2 - drawH / 2 + y,
          }}
        />
      </div>

      <label className="block">
        <span className="text-sm text-on-surface">Zoom</span>
        <input
          type="range" min={1} max={3} step={0.01} value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="range-warm w-full"
          style={{ ['--range-progress' as string]: `${((zoom - 1) / 2) * 100}%` }}
        />
      </label>

      <div className="flex gap-2">
        <button
          type="button" onClick={finish}
          className="min-h-11 flex-1 rounded-lg bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-container"
        >
          Use this crop
        </button>
        <button
          type="button" onClick={onCancel}
          className="min-h-11 rounded-lg border border-outline-variant px-4 text-sm text-on-surface hover:bg-surface-container"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
