# Design prompts

The two prompts in this folder are the ones that produced the reference
designs in [`design/`](../../design). They were written for Google Flow and run
separately — desktop and mobile were generated as **two distinct layouts**, not
one responsive design, which is why the finished app ships two separate layout
components rather than a single breakpoint-driven one.

| File | Output |
|---|---|
| [`desktop-design-prompt.md`](desktop-design-prompt.md) | `design/desktop.png` — 1440 × 1024, vinyl stage + bottom queue strip |
| [`mobile-design-prompt.md`](mobile-design-prompt.md) | `design/mobile.png` — 390 px wide, polaroid + stacked player + vertical queue |

Both prompts fix the same visual language: warm ivory ground, burnt orange
`#C96322` accent, editorial serif for display type, clean sans for controls,
monospace for timings. That palette was carried into the build as design
tokens — see `src/app/globals.css`.
