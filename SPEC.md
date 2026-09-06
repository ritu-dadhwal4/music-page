# SPEC.md — Personalized Music Page

Build a personalized music page. One user (the owner) configures it, then shares a public link. Anyone with the link sees a read-only player page.

Reference designs in `design/`: one mobile screenshot and one desktop screenshot. Match the visual style closely — warm cream background, serif display type, orange accent, rounded cards, generous spacing.

**These are two distinct layouts, not one responsive layout.** The desktop design is not a widened mobile design — it has a different structure, a different player card shape, and a different queue orientation. Build them as separate layout components sharing the same state, data layer, and player logic.

Breakpoints:
- **Mobile layout:** viewport width under `1024px`. Design target 390px. Tablets get this layout at a wider max-width (`560px`, centered).
- **Desktop layout:** `1024px` and above. Design target 1440px.

Switch on viewport width, not user-agent sniffing. Render the correct layout on the server where possible to avoid a visible layout flash on load.

---

## 1. Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Netlify Blobs (`@netlify/blobs`) for config storage and image storage
- No database, no auth provider, no external UI library
- Deployed on Netlify

---

## 2. The two modes

There is **one site**, not two apps.

| Mode | How to enter | What's visible |
|---|---|---|
| **Public** | `/` | Player page only. No settings UI, no gear icon, no edit affordance of any kind. |
| **Settings** | `/?edit=<EDIT_KEY>` | Player page plus a gear icon top-right that opens the settings panel. |

`EDIT_KEY` is an environment variable. The value in the query string is checked **server-side** on every write. Never validate it only in the browser — a client-side check can be bypassed with devtools, and the write endpoint is what actually matters.

If `?edit=` is present but wrong, render the public page exactly as if the parameter were absent. Do not show an error — an error message tells a stranger they found the right parameter name.

---

## 3. Data model

Stored in Netlify Blobs under a single key: `config`.

```ts
type Track = {
  id: string;            // nanoid, stable across reorders
  youtubeId: string;     // 11-char video ID
  title: string;         // from oEmbed, owner-editable
  artist: string;        // owner-typed, may be empty
  thumbnail: string;     // YouTube thumbnail URL
  duration: number | null; // seconds; null when unavailable
};

type Config = {
  version: 1;
  pageTitle: string;      // "For my best friend"
  subtitle: string;       // "CHEERS TO OUR 10 YEARS OF FRIENDSHIP"
  photoUrl: string | null;  // polaroid image
  photoCaption: string;     // handwritten line inside the polaroid frame
  backgroundMobileUrl: string | null;   // portrait
  backgroundDesktopUrl: string | null;  // landscape
  overlayOpacity: number;   // 0–0.8, default 0
  textTheme: 'dark' | 'light'; // dark text (default) or light text
  tracks: Track[];          // array order IS the play order
};
```

Track order is the array order. Reordering is an array splice, not a sort field — a separate `order` integer will drift out of sync the first time a delete happens mid-list.

Seed the app with a default config so a fresh deploy renders something rather than crashing.

---

## 4. API routes

### `GET /api/config`
Returns the stored config, or the default if none exists. Public, no auth.

### `POST /api/config`
Body: full `Config` object. Header or query carries the edit key.
- Validate the key server-side against `process.env.EDIT_KEY`. Reject with 401 on mismatch.
- Validate the shape before writing. Reject unknown fields.
- Overwrite the `config` blob wholesale. No partial merges — simpler and there's exactly one writer.

### `POST /api/upload`
Accepts a single image file. Auth-gated the same way.
- Accept `image/jpeg`, `image/png`, `image/webp` only.
- Reject anything over **4 MB** with a clear message.
- Downscale server-side by purpose: desktop background to max 2000px wide, mobile background to max 1200px wide, photo to 1000×1000. Store as WebP.
- The request carries a `purpose` field (`background-mobile` | `background-desktop` | `photo`) so the endpoint knows which target size to use.
- Write to Netlify Blobs under `images/<nanoid>.webp`, return the public URL.

### `GET /api/youtube?url=<youtube-url>`
Called when the owner pastes a link.
1. Extract the video ID. Accept all these forms: `youtube.com/watch?v=ID`, `youtu.be/ID`, `youtube.com/shorts/ID`, `youtube.com/embed/ID`, and any of them with extra query params. Also accept a bare 11-character ID.
2. Fetch `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<ID>&format=json` for `title`. No API key needed.
3. **Do not store oEmbed's `thumbnail_url`.** It returns `hqdefault.jpg`, which is a 480×360 4:3 image with black letterbox bars baked in above and below the 16:9 frame — dropping it into a 16:9 slot produces visible black bands. Construct the URL from the video ID instead:
   - Primary: `https://i.ytimg.com/vi/<ID>/maxresdefault.jpg` (1280×720, true 16:9)
   - Fallback: `https://i.ytimg.com/vi/<ID>/mqdefault.jpg` (320×180, true 16:9)

   `maxresdefault` does not exist for every video and returns a 404 or a placeholder when missing, so the `<img>` must have an `onError` handler that swaps to `mqdefault`. Verify visually with a few real videos — thumbnail availability varies by upload.
4. **If `YOUTUBE_API_KEY` is set**, additionally call the Data API `videos.list` with `part=contentDetails` and parse the ISO 8601 duration into seconds. If the key is absent, return `duration: null`.
5. If oEmbed returns 401 or 404, the video is private, deleted, or embedding-disabled. Return a clear error — the owner needs to know before they publish, not after a friend opens the link.

---

## 5. Public page — mobile layout

Follow the mobile screenshot in `design/` closely. Top to bottom, single column:

**Header block** — `pageTitle` in the serif display face, large. `subtitle` below it in small italic letter-spaced caps.

**Polaroid frame** — the white-bordered tilted card from the design, with a wider border along the bottom edge. This is where the YouTube player lives.
- The inner window is **16:9 landscape**, not the near-square of a real polaroid. A square window letterboxes every video with warm bars top and bottom — the same artifact this spec rejects for thumbnails.
- The YouTube iframe renders **inside** the polaroid's inner window. It must remain visible and unobscured at all times. Do not set `display:none`, do not cover it with an overlay, do not shrink it to zero, do not play audio with the player hidden.
- `photoCaption` renders on the lower white border in the handwritten style.
- When `photoUrl` is set and no track is playing, show the photo in the frame. On first play, the iframe replaces it.

**Player card** — white rounded card, exactly as designed.
- Current track title (serif, large), artist below (italic caps).
- Seek bar with elapsed and total time. Poll the IFrame API's current time roughly 4× per second while playing; stop polling when paused.
- Shuffle · previous · play/pause · next · repeat. Play/pause is the large filled orange circle.
- Volume slider, wired to the IFrame API's volume methods.
- If a track's `duration` is null, show the total time as `--:--` until the player reports it after load.

**Up Next list** — `UP NEXT` label, a pill with the track count, and the rows.
- Row: thumbnail, title, artist, duration right-aligned.
- Thumbnails render at their native **16:9** aspect ratio — do not crop to square. Size them `96×54` with rounded corners. Row height follows from the thumbnail plus padding.
- Set explicit width and height on the `<img>` so rows don't reflow as thumbnails load in.
- The currently playing row gets the peach highlight background and shows `NOW` in orange instead of the duration.
- Tapping a row plays that track.
- Hide the duration column entirely if no track has a duration, rather than showing a column of dashes.

**Empty state** — when `tracks` is empty, replace the player card and list with a centered message and, in settings mode only, an "Add your first song" button.

---

## 5b. Public page — desktop layout

Follow the desktop screenshot in `design/`. Structurally different from mobile: a fixed top bar, a centered stage, and a queue strip pinned along the bottom.

**Top bar** — thin, full width, cream. `pageTitle` at the left in the serif face, small. A thin vertical divider after it, then `subtitle` in small italic caps. Settings gear at the far right (settings mode only).

**Stage** — fills the space between the top bar and the queue strip. Keep it calm: the video card is the only thing in it, on the warm gradient, with nothing competing for attention.
- The **YouTube iframe sits centered in the stage** in a rounded rectangle card at 16:9, roughly `640px` wide, with a dark espresso surround about `12px` thick. Same rule as mobile: it stays visible and unobscured whenever a track is playing.
- The card's width must respond to viewport *height*, not only width, so a short laptop screen shrinks it rather than pushing the queue strip off the bottom.
- The floating **player control card** sits below the video card, overlapping its lower edge slightly, as in the screenshot. This card is **horizontal**, not the tall stacked mobile card: thumbnail and track title on the left, then transport controls inline to the right (shuffle · previous · play/pause · next · repeat), with the seek bar and timings on a second line, and a small volume slider bottom right.
- Do not let the control card cover the video. The overlap is with the video card's own padding and drop shadow, never the iframe itself.
- When no background image is set, the stage uses the warm cream gradient from the design.

**Queue strip** — pinned to the bottom, full width, on a lighter surface.
- Left end: a queue icon, the `UP NEXT` label, and a pill with the track count.
- To the right: track cards in a **horizontal** scroller. Each card shows a 16:9 thumbnail (`80×45`), title, artist, and duration.
- The playing card gets the orange border and peach fill from the design.
- Scroll horizontally with the wheel and with keyboard arrows. Fade the right edge to signal more content. When the playing track scrolls out of view, scroll it back into view automatically on track change.
- Clicking a card plays that track.

**Empty state** — no video card; centered message where the player card would sit; queue strip hidden entirely.

**Shared between layouts:** all player state, the config, the API layer, and the settings panel logic. Only the presentational components differ. Do not fork the player controller.

---

## 6. Player behaviour (YouTube IFrame API)

Load the IFrame API script once. One player instance, reused for every track — call the load-video method to switch tracks rather than tearing down and rebuilding the iframe.

- Page opens **paused**. Never attempt autoplay; mobile browsers block it and a silent failed autoplay reads as a broken site.
- On track end, advance to the next track. At the end of the list: stop if repeat is off, restart from the top if repeat is on.
- Shuffle picks randomly from tracks not yet played in the current cycle. Don't re-randomise the visible list order — the list stays in config order, only playback jumps.
- If a video fails to load (removed, private, embedding disabled), skip to the next track automatically and show a small non-blocking notice. Don't let one dead link freeze the whole page.

---

## 7. Settings panel

Full-screen slide-over from the right, closes with an X. Two tabs.

### Music tab
- Text field: "Paste a YouTube link" + Add button.
- On add: call `/api/youtube`, show a row spinner, then append the track. Show inline errors on the field, not as an alert.
- Track rows: thumbnail, editable title, editable artist, up arrow, down arrow, delete.
- Use **arrow buttons, not drag-and-drop.** Drag on touch is fiddly and will fail on camera at the worst moment.
- Disable the up arrow on the first row and the down arrow on the last.
- Delete asks for confirmation inline (row turns into "Remove? Yes / No"), not a browser confirm dialog.

### Appearance tab
- **Two background slots, side by side:** "Mobile background" (portrait preview frame) and "Desktop background" (landscape preview frame). Each with upload, live preview, and Remove.
- If only one is set, use it for both rather than falling back to the plain gradient — a half-configured page looks broken. Label this behaviour in the UI so the owner understands why.
- Overlay darkness slider, 0 to 0.8. One slider, applies to both.
- Text theme toggle: Dark text / Light text.
- Profile photo: upload with a square crop step before saving.
- Photo caption, page title, subtitle text fields.

**Contrast note:** the design assumes dark text on a light background. If the owner uploads a dark photo, dark text becomes unreadable. That's what the overlay slider and text theme toggle are for. When a background is uploaded, sample its average brightness and auto-suggest the appropriate text theme — the owner can override.

### Publish
- Fixed button at the bottom of the panel, visible on both tabs.
- Changes apply to the live preview immediately but are **not saved** until Publish is pressed.
- Warn on close if there are unsaved changes.
- On success, show the success screen: checkmark, the public URL in a bordered box, Copy Link button, native share button.
- The shared URL must **never** include `?edit=`. Strip it explicitly when building the link.

---

## 8. Device constraints

**Mobile**
- Design target 390px wide. Test at 390 and 430.
- Minimum tap target 44×44px. The arrow and delete icons in the track list are the ones most likely to end up too small.
- Seek and volume sliders need touch handlers, not just mouse events.
- The settings panel must not shift layout when the on-screen keyboard opens. Use dynamic viewport units.
- The polaroid tilt is decorative — make sure it doesn't cause horizontal overflow at 390px.

**Desktop**
- Test at 1280, 1440, and 1920. The stage is vertically centered, so check short viewports (around 700px tall) — the video card must scale down rather than push the queue strip off screen.
- The queue strip is pinned; the stage scrolls independently if it ever overflows.
- Hover states exist on desktop and don't on mobile. Queue cards and transport controls need them.
- Any motion should respect `prefers-reduced-motion` and stop when the tab is hidden.

---

## 9. Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `EDIT_KEY` | Yes | Settings-mode passcode |
| `YOUTUBE_API_KEY` | No | Enables track durations |

Netlify Blobs needs no configuration when deployed on Netlify. For local development, follow the current `@netlify/blobs` local-dev setup — check the package docs rather than guessing, as the local API has changed between versions.

---

## 10. Out of scope

No accounts, no multiple pages per deploy, no playlists, no comments, no analytics, no MP3 upload or self-hosted audio.

---

## 11. Build order

1. Config type, default config, Blobs read/write, `/api/config`
2. Mobile layout, static, fed by the default config
3. YouTube IFrame API integration and the custom transport controls, wired into the mobile layout
4. Desktop layout, reusing the exact same player controller from step 3
5. `/api/youtube` and the Music tab
6. `/api/upload` and the Appearance tab
7. Publish flow and success screen
8. Empty states, error states, polish on both layouts

Get steps 1–3 working and verified before starting 4. The player is the part most likely to need iteration, and iterating on it twice across two layouts is wasted work. Step 4 should add no new player logic at all — if it does, step 3 wasn't factored properly.
