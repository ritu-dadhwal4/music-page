# Build a Personalised Music Page Using Google Flow + Claude Code + Netlify

If you're a student or an early-career professional, you need to know that AI is now one of the mandatory skills you can't avoid — whether you want to get a job, become an entrepreneur, or move into any career in the future. AI is already starting to take over certain tasks. But remember: AI won't take your job — someone using AI will. So start using AI across every part of your life, in your day-to-day work, and in building your business.

## About myself

Hi, I'm Ritu Dadhwal. I'm a graduate of NIT Hamirpur, and I currently work as a Product Manager. I help you become a skilled professional by teaching you AI in every 30-second reel — building 100 AI projects for you to learn from.

Follow my channel if you find it interesting. And you can always reach out to me for any of your queries via DM.

---

## What we are building

A personalised music page. You add YouTube songs, a photo and a dedication, then share one link. Whoever opens it sees a music player and nothing else — no login, no sign-up, no app to install.

You keep a secret link for yourself that shows a settings button. Everyone else gets the plain link.

This is a gift you can build in an afternoon and send to a best friend, a partner, or your parents.

**Live code:** https://github.com/ritu-dadhwal4/music-page

## What you'll need

- Google Flow (for the designs)
- Claude Code installed
- Node.js installed
- Git installed
- A GitHub account
- A Netlify account (free tier is enough)

---

## Step 1 — Create the two designs in Google Flow

Open Google Flow and run **two separate prompts**. One for desktop, one for mobile.

Do not ask for "a responsive music player" in one prompt. A wide screen wants songs in a row along the bottom. A phone wants them in a list. One prompt stretched across both gives you a design that fits neither.

Save the first image as `design/desktop.png` and the second as `design/mobile.png`.

### Prompt 1 — Desktop design

```
Design a premium desktop web interface for a personalised music playlist called "Nostalgia."

Create a single-page, full-screen music player with a warm, cinematic, vintage aesthetic. The design should feel like a personal digital mixtape made for someone special—not like Spotify, a dashboard, or a generic streaming platform.

CANVAS AND STYLE
- Desktop viewport: 1440 x 1024 px.
- Use a warm ivory, cream, beige, taupe, and burnt-orange color palette.
- Main background: soft ivory with very subtle peach, beige, and golden blurred gradients.
- Add a small amount of warm film grain.
- Use dark espresso brown for primary text and muted taupe for secondary text.
- Accent color: burnt orange, approximately #C96322.
- Use an elegant editorial serif font for branding and important song titles.
- Use a clean modern sans-serif font for secondary information and controls.
- Keep the interface spacious, minimal, refined, and nostalgic.
- Use thin borders, soft shadows, rounded corners, and translucent off-white surfaces.
- Do not add a sidebar, search bar, login buttons, navigation links, advertisements, dark mode, or unrelated content.

HEADER
Create a slim header approximately 72 px high across the top.
- Place the word "Nostalgia" on the left with approximately 56 px horizontal padding.
- Use an elegant black serif logotype, around 27 px.
- Add a thin, short, light-beige vertical divider immediately after the word.
- After the divider, show "CHEERS TO OUR 10 YEARS OF FRIENDSHIP" in a small italic serif, uppercase, wide letter spacing, muted taupe.
- Keep the rest of the header empty.
- Use a slightly lighter cream background than the main page.

MAIN STAGE
Below the header, create a large centred stage that occupies all remaining space above the playlist queue.
- At its centre, place a large video card in a 16:9 landscape ratio, approximately 640 px wide.
- Give the card a dark espresso surround about 12 px thick, rounded corners of roughly 18 px, and a soft diffused shadow.
- Inside the card, show a warm golden-hour music video still.
- The card must be 16:9. Do not make it square, and do not letterbox the picture inside it.
- Keep the surrounding stage calm and mostly empty.

FLOATING MUSIC PLAYER
Directly below the video card, overlay a horizontal music-player card that slightly overlaps the lower edge of the video card's frame.
- Card size: approximately 660 x 190 px.
- Use a translucent warm-white surface with a thin white border.
- Border radius: approximately 18 px.
- Add a soft, diffused shadow.
- The player card must not cover the video picture itself, only the frame beneath it.

Top row of the player:
- On the far left, show a small album thumbnail in a 16:9 landscape ratio, approximately 72 x 41 px, rounded corners.
- Beside it, show the song title "1901 (Acoustic French Wave)" in a bold serif font.
- Truncate the title with an ellipsis if needed.
- Under it, show "Phoenix / Summer Sunset Re-edit" in smaller muted sans-serif text.
- On the right, add controls in this order: Shuffle; Previous track inside a small pale circular button; Large burnt-orange circular Play button; Next track inside a small pale circular button; Repeat.
- Use simple outlined icons.
- The orange Play button should be the visual focus and have a subtle shadow.

Progress section:
- Place a full-width audio progress slider under the top row.
- The completed portion should be burnt orange, the remaining portion light beige-grey.
- Add a small dark circular slider handle with a thin light outline.
- Show "1:24" below the left side and "3:48" below the right side in small monospaced text.

Bottom row:
- On the right, add a speaker icon and a short volume slider.
- Use burnt orange for the filled volume level and pale beige for the remainder.

BOTTOM PLAYLIST QUEUE
Create a fixed horizontal queue panel across the entire bottom of the screen.
- Height: approximately 120 px.
- Background: warm translucent white.
- Add a faint top border and approximately 36 px horizontal padding.
- The queue should look like a horizontal carousel.

At the far left:
- Add a small queue icon in muted taupe.
- Show the uppercase label "UP NEXT."
- Beside it, show a small rounded pill containing the number "5."
- Add a thin vertical divider after this section.

Display five horizontal track cards:
1. "1901 (Acoustic)" - "Phoenix / Summer" - 3:48
2. "The Drifter's Path" - "Sarah Jenkins" - 4:18
3. "Golden Hour Daze" - "Aurora Skies" - 3:32
4. "Drifting Coast" - "Aurora Halo" - 4:05
5. "Cassette Reverie" - "Miles & The Echo" - 3:49

Each track card must include:
- An album cover in a 16:9 landscape ratio, approximately 80 x 45 px, rounded corners. These must not be square.
- Song title, artist name underneath, duration aligned to the right.
- A light cream background, rounded corners, a very subtle border.

Highlight the currently selected first track using a slightly peach-tinted background, a thin burnt-orange border, and orange song-title text.

Fade the right edge of the queue so it is clear more cards continue off screen.

INTERACTIONS
Create realistic prototype states for play and pause, previous and next track, shuffle and repeat, audio progress, volume adjustment, and clicking a song in the queue to change the active track. The active card receives the orange highlight, and artwork, title, artist, timing and player state update together.

The final screen must look like a polished, personal, nostalgic music experience built around a single large video card on a calm warm stage.
```

### Prompt 2 — Mobile design

```
Design a premium mobile screen for a personalized music playlist called "Nostalgia." It is a heartfelt digital mixtape created as a gift for a best friend.

Create a vertically scrolling, single-page mobile music player. The design must feel warm, personal, cinematic, nostalgic, and handcrafted—not like Spotify or a generic music application.

CANVAS AND VISUAL STYLE
- Mobile viewport: 390 px wide.
- Create a long, vertically scrollable screen.
- Background: soft warm ivory, approximately #FAF5ED.
- Add extremely subtle peach gradients and warm film grain.
- Main text: dark espresso brown. Secondary text: muted warm grey.
- Accent color: burnt orange, approximately #C96322.
- Use an elegant editorial serif font for the dedication and song title.
- Use a clean sans-serif font for controls and playlist information.
- Use a small monospaced font for track times and labels.
- Keep the layout centred, spacious, refined, and sentimental.
- Use soft shadows, thin borders, off-white cards, and rounded corners.
- Do not add a navigation bar, sidebar, search, account profile, advertisements, footer, or unrelated controls.

DEDICATION HEADER
At the top, leave approximately 55 px of breathing room.
- Centre the large serif heading: "For my best friend"
- Use dark brown text, approximately 34 px, elegant and editorial.
- Directly underneath, add the uppercase subtitle: "CHEERS TO OUR 10 YEARS OF FRIENDSHIP"
- Use a smaller italic serif font, increased letter spacing, muted taupe.
- Keep both lines perfectly centred.

MEMORY PHOTO
Below the dedication, place a Polaroid-style memory card.
- Width: approximately 285 px.
- Slightly rotate it by about -2 degrees.
- Use a thick off-white Polaroid frame, with a wider border along the bottom edge than the other three sides.
- Add a soft shadow and rounded outer corners.
- The picture window inside the frame must be a 16:9 landscape rectangle, not a square. This window will later hold a video, and a square window would put black bars above and below it.
- Inside the window, display a warm golden-hour photograph of two best friends sitting outdoors, laughing together while one plays an acoustic guitar.
- Use cinematic sunset lighting, warm amber tones, and subtle vintage grain.
- Make the picture feel like an authentic memory rather than a stock photograph.
- On the wide lower border, write "Golden Hour Daze - 2009" in a handwritten style.
- Do not place any button or floating UI over the faces.

MAIN PLAYER CARD
Below the photo, create a large music-player card with comfortable spacing from the image.
- Almost full mobile width with approximately 20 px side margins.
- Background: warm white. Border radius: approximately 22 px.
- Add a thin warm-grey border, a soft shadow, and generous internal padding.

At the top of the player:
- Centre the song title "Golden Hour Daze" in a large dark-brown serif font.
- Under it, centre "AURORA SKIES" in small uppercase italic serif with wide letter spacing, muted taupe.

Progress section:
- Add a wide horizontal progress bar.
- Completed portion burnt orange, remaining portion pale beige-grey.
- Use a medium orange circular scrubber.
- Show "0:28" below the left side and "3:32" below the right side in monospaced grey text.

Playback controls:
Create a centred row with five controls: Shuffle icon; Previous track inside a pale circular button; Large burnt-orange circular Pause button; Next track inside a pale circular button; Repeat icon.
- Make the centre Pause button the largest element with a soft orange shadow and white pause bars.
- Use dark warm-grey icons for the other controls.
- Every control should look comfortably large enough to tap with a thumb.

Volume:
- Add a pale rounded volume-control container beneath the playback controls.
- Low-volume speaker icon on the left, horizontal slider in the centre, high-volume speaker icon on the right.
- Use a burnt-orange circular volume knob positioned around 75%.

QUEUE HEADER
Below the player card, create a row with "UP NEXT" in uppercase muted-grey text on the left, and a small rounded taupe pill beside it containing "5 tracks."

PLAYLIST
Create five vertically stacked rounded track cards:
1. "1901 (Acoustic French Wave)" - Phoenix - currently playing
2. "The Drifter's Path" - Sarah Jenkins - 4:18
3. "Golden Hour Daze" - Aurora Skies - 3:32
4. "Drifting Coast" - Aurora Halo - 4:05
5. "Cassette Reverie" - Miles & The Echo - 3:49

Each card should include:
- An album cover on the left in a 16:9 landscape ratio, approximately 96 x 54 px. These must not be square or cropped.
- The track title in medium-weight dark-brown text.
- The artist name underneath in smaller muted-grey text.
- The track duration aligned vertically in the centre on the right.
- Warm off-white background, rounded corners of approximately 16 px, a subtle shadow or fine border.
- Consistent spacing between cards.

Highlight the first track as the currently playing song with a very light peach background, a burnt-orange artist name, and the uppercase orange label "NOW" in place of the duration.

INTERACTIONS
Create realistic prototype states for play and pause, previous and next track, shuffle and repeat, scrubbing, volume, and selecting any of the five playlist cards. Update the song title, artist, artwork, duration, active card and playback state when a new track is selected. Keep the audio player visible in the natural page flow, not as a sticky bottom navigation bar.

The final screen should feel like an intimate musical gift celebrating ten years of friendship, with a sophisticated vintage-editorial design and a highly polished mobile experience.
```

**Tip:** change the dedication, the subtitle and the song names to your own. Keep the pixel sizes and the 16:9 instructions — those are what make the design actually buildable.

---

## Step 2 — Create your project folder

```
mkdir music-page
cd music-page
mkdir design
```

Put your two images inside `design/` named `desktop.png` and `mobile.png`.

---

## Step 3 — Write SPEC.md

This is the step most people skip, and it is the one that decides whether the result works.

The images show what the product **looks like**. They say nothing about what it **does**. A picture cannot tell you what happens when a song gets deleted from YouTube, or what a stranger sees if they guess your secret link.

Create a file called `SPEC.md` in your folder and paste this in.

### Prompt 3 — SPEC.md

```
# SPEC.md - Personalised Music Page

Build a personalised music page. One user (the owner) configures it, then shares a public link. Anyone with the link sees a read-only player page.

Reference designs are in design/: one mobile screenshot and one desktop screenshot. Match the visual style closely - warm cream background, serif display type, orange accent, rounded cards, generous spacing.

These are two distinct layouts, not one responsive layout. The desktop design is not a widened mobile design. Build them as separate layout components sharing the same state, data layer, and player logic.

Breakpoints:
- Mobile layout: under 1024px. Design target 390px. Tablets get this layout at a 560px max-width, centered.
- Desktop layout: 1024px and above. Design target 1440px.
Switch on viewport width, not user-agent sniffing.

## 1. Stack
Next.js (App Router) + TypeScript, Tailwind CSS, Netlify Blobs for config and image storage. No database, no auth provider, no external UI library. Deployed on Netlify.

## 2. The two modes
- Public: "/" shows the player page only. No settings UI, no gear icon, no edit affordance of any kind.
- Settings: "/?edit=<EDIT_KEY>" shows the player page plus a gear icon that opens the settings panel.

EDIT_KEY is an environment variable, checked server-side on every write. Never validate it only in the browser.

If ?edit= is present but wrong, render the public page exactly as if the parameter were absent. Do not show an error - an error tells a stranger they found the right parameter name.

## 3. Data model
Stored in Netlify Blobs under a single key: config.

Track: id (stable across reorders), youtubeId (11 chars), title, artist, thumbnail, duration (seconds or null).

Config: version, pageTitle, subtitle, photoUrl, photoCaption, backgroundMobileUrl, backgroundDesktopUrl, overlayOpacity (0 to 0.8), textTheme ('dark' or 'light'), tracks.

Track order IS the array order. Reordering is an array splice, not a sort field - a separate order integer drifts out of sync the first time a delete happens mid-list.

Seed the app with a default config so a fresh deploy renders something rather than crashing.

## 4. API routes
GET /api/config - returns the stored config, or the default. Public.
POST /api/config - full Config object. Validate the key server-side, reject with 401 on mismatch. Validate the shape and reject unknown fields. Overwrite wholesale, no partial merges.
POST /api/upload - single image. Auth-gated. Accept jpeg, png, webp only. Reject anything over 4MB with a clear message. Downscale by purpose: desktop background to 2000px wide, mobile background to 1200px, photo to 1000x1000. Store as WebP.
GET /api/youtube?url=... - extract the video ID from watch, youtu.be, shorts and embed URLs, with or without extra query params, and from a bare 11-character ID. Fetch the oEmbed endpoint for the title.

Do not store oEmbed's thumbnail_url. It returns hqdefault.jpg, a 4:3 image with black letterbox bars baked in above and below the 16:9 frame. Build the URL from the video ID instead: maxresdefault.jpg as primary, mqdefault.jpg as fallback via an onError handler, because maxresdefault does not exist for every video.

If YOUTUBE_API_KEY is set, also call the Data API for the duration. If absent, return duration: null.

If the video is private, deleted or has embedding disabled, return a clear error - the owner needs to know before they publish, not after a friend opens the link.

## 5. Mobile layout
Single column, top to bottom: header (pageTitle, subtitle), polaroid frame, player card, up-next list.

Polaroid frame - white-bordered tilted card, wider border along the bottom. The YouTube iframe renders inside its inner window and must remain visible and unobscured at all times. Never hide it, cover it, or shrink it to zero while audio plays.

The inner window is 16:9 landscape, not the near-square of a real polaroid. A square window letterboxes every video with warm bars top and bottom.

photoCaption renders on the lower white border in a handwritten style. When photoUrl is set and nothing is playing, show the photo. On first play, the iframe replaces it.

Player card - white rounded card. Title (serif, large), artist below (italic caps). Seek bar with elapsed and total time; poll the player roughly 4x per second while playing and stop when paused. Shuffle, previous, play/pause, next, repeat, with play/pause as a large filled orange circle. Volume slider. If duration is null, show total time as --:-- until the player reports it.

Up Next list - "UP NEXT" label, a pill with the track count, then rows. Each row: thumbnail, title, artist, duration right-aligned. Thumbnails render at their native 16:9 ratio at 96x54 with rounded corners - do not crop to square. Set explicit width and height on the img so rows do not reflow as images load. The playing row gets a peach highlight and shows "NOW" in orange instead of the duration. Tapping a row plays that track. Hide the duration column entirely if no track has a duration.

Empty state - when tracks is empty, replace the player card and list with a centered message and, in settings mode only, an "Add your first song" button that opens the panel.

## 6. Desktop layout
Structurally different from mobile: a fixed top bar, a centered stage, and a queue strip pinned along the bottom.

Top bar - thin, full width, cream. pageTitle at the left in the serif face, small. A thin vertical divider, then subtitle in small italic caps. Settings gear at the far right, settings mode only.

Stage - fills the space between the top bar and the queue strip. Keep it calm: the video card is the only thing in it, on the warm gradient. The iframe sits centered in a rounded rectangle card at 16:9, roughly 640px wide, with a dark surround about 12px thick. The card's width must respond to viewport height, not only width, so a short laptop screen shrinks it rather than pushing the queue strip off the bottom.

The floating player control card sits below the video card, overlapping its lower edge slightly. This card is horizontal, not the tall stacked mobile card: thumbnail and title on the left, transport controls inline to the right, seek bar and timings on a second line, small volume slider bottom right. Do not let it cover the video - the overlap is with the video card's own padding and shadow, never the iframe.

Queue strip - pinned to the bottom, full width. Left end: a queue icon, the "UP NEXT" label, and a pill with the track count. To the right: track cards in a horizontal scroller, each with a 16:9 thumbnail at 80x45, title, artist and duration. The playing card gets an orange border and peach fill. Scroll with the wheel and with keyboard arrows. Fade the right edge. When the playing track scrolls out of view, scroll it back in automatically on track change.

Empty state - no video card, a centered message where the player card would sit, queue strip hidden entirely.

Shared between layouts: all player state, the config, the API layer, and the settings panel logic. Only the presentational components differ. Do not fork the player controller.

## 7. Player behaviour
Load the IFrame API once. One player instance, reused for every track - call the load-video method to switch tracks rather than tearing down and rebuilding the iframe.

The page opens paused. Never attempt autoplay; mobile browsers block it and a silent failure reads as a broken site.

On track end, advance to the next track. At the end of the list, stop if repeat is off and restart from the top if repeat is on. Shuffle picks randomly from tracks not yet played in the current cycle; do not re-randomise the visible list order.

If a video fails to load, skip to the next automatically and show a small non-blocking notice. Do not let one dead link freeze the page.

## 8. Settings panel
Full-screen slide-over from the right, closes with an X. Two tabs.

Music tab - a field to paste a YouTube link plus an Add button. On add, call /api/youtube, show a row spinner, then append the track. Show inline errors on the field, not as an alert. Track rows: thumbnail, editable title, editable artist, up arrow, down arrow, delete. Use arrow buttons, not drag-and-drop - drag on touch is fiddly. Disable the up arrow on the first row and the down arrow on the last. Delete asks for confirmation inline (the row turns into "Remove? Yes / No"), not a browser confirm dialog.

Appearance tab - two background slots side by side, "Mobile background" (portrait preview) and "Desktop background" (landscape preview), each with upload, live preview and Remove. If only one is set, use it for both rather than falling back to the plain gradient, and say so in the UI. Overlay darkness slider, 0 to 0.8. Text theme toggle: dark or light. Profile photo with a square crop step before saving. Photo caption, page title and subtitle text fields.

When a background is uploaded, sample its average brightness and auto-suggest the matching text theme; the owner can override. When the last background is removed, revert the text theme to dark - light text on the cream gradient is unreadable.

Publish - a fixed button at the bottom of the panel, visible on both tabs. Changes apply to the live preview immediately but are not saved until Publish is pressed. Warn on close if there are unsaved changes. On success show a success screen: checkmark, the public URL in a bordered box, a Copy Link button and a native share button. The shared URL must never include ?edit= - strip it explicitly.

## 9. Device constraints
Mobile - design target 390px; test at 390 and 430. Minimum tap target 44x44px, especially the arrow and delete icons. Seek and volume sliders need touch handlers, not just mouse events. The settings panel must not shift layout when the on-screen keyboard opens; use dynamic viewport units. The polaroid tilt must not cause horizontal overflow at 390px.

Desktop - test at 1280, 1440 and 1920, and check short viewports around 700px tall. The queue strip is pinned; the stage scrolls independently if it overflows. Hover states exist on desktop and do not on mobile. Any motion should respect prefers-reduced-motion and stop when the tab is hidden.

## 10. Environment variables
EDIT_KEY - required. The settings passcode.
YOUTUBE_API_KEY - optional. Enables track durations.

Netlify Blobs needs no configuration when deployed on Netlify.

## 11. Out of scope
No accounts, no multiple pages per deploy, no playlists, no comments, no analytics, no MP3 upload or self-hosted audio.

## 12. Build order
1. Config type, default config, Blobs read/write, /api/config
2. Mobile layout, static, fed by the default config
3. YouTube IFrame API integration and the custom transport controls, wired into the mobile layout
4. Desktop layout, reusing the exact same player controller from step 3
5. /api/youtube and the Music tab
6. /api/upload and the Appearance tab
7. Publish flow and success screen
8. Empty states, error states, polish on both layouts

Get steps 1 to 3 working and verified before starting 4. The player is the part most likely to need iteration, and iterating on it twice across two layouts is wasted work. Step 4 should add no new player logic at all.
```

The full file is also on GitHub: https://github.com/ritu-dadhwal4/music-page/blob/main/SPEC.md

---

## Step 4 — Build it with Claude Code

Open Claude Code inside your folder:

```
claude
```

Then give it this.

### Prompt 4 — Build

```
Read SPEC.md and look at the two reference designs in design/. Build the application exactly as specified, following the build order in section 12.

Get steps 1 to 3 working and verified before you start step 4. When you build the desktop layout, it should add no new player logic at all - it reuses the same player controller as mobile.
```

Two things to insist on:

**Build in order, not all at once.** Storage, then the mobile screen, then the player. Check the result yourself before the desktop screen gets built on top of it.

**The desktop layout must add no player logic.** If it needs some, the player was not built properly the first time.

---

## Step 5 — Run it on your machine

Install everything:

```
npm install
```

Set your secret passcode. Make it long and random — this is the only thing between a stranger and editing your page:

```
echo 'EDIT_KEY=my-long-random-passcode-9f2b' > .env.local
```

Start it:

```
npm run dev
```

Open `http://localhost:3000` to see the public page.

To get the settings gear, add your passcode to the address:

```
http://localhost:3000/?edit=my-long-random-passcode-9f2b
```

**Check these five things before moving on:**

1. Press play — a song should start
2. Pause, skip forward, skip back, drag the progress bar, move the volume
3. Let a song finish — the next should start on its own
4. Narrow the window below 1024px — the layout should switch to the phone version
5. Open the plain address with no passcode — the gear must be gone

---

## Step 6 — Add your music and pictures

Click the gear.

**Music tab** — paste a YouTube link and press Add. The title and artist fill in automatically. Reorder with the arrows, delete with the bin icon. If a video is private or taken down, you get told right away.

**Appearance tab** — upload a background for phone and desktop, adjust the overlay darkness, choose dark or light text, set the photo in the frame, and edit the dedication.

**Press Publish.** Nothing is saved until you do.

---

## Step 7 — Put the code on GitHub

Netlify deploys from GitHub, so the code needs to be there first.

Before you push, make sure `.env.local` is in `.gitignore`. Your passcode must never be uploaded.

```
git init
git add -A
git status
git commit -m "Music page"
```

Check the `git status` output — `.env.local` must not be listed.

Then create the repository:

```
gh repo create music-page --public --source=. --push
```

Or create an empty repo on github.com and connect it:

```
git remote add origin https://github.com/YOUR-NAME/music-page.git
git branch -M main
git push -u origin main
```

---

## Step 8 — Deploy on Netlify

First add a file called `netlify.toml` in your project root:

```
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "22"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

Commit and push it:

```
git add netlify.toml && git commit -m "Add Netlify config"
git push
```

Then:

1. Sign in at https://app.netlify.com
2. Click **Add new site → Import an existing project**
3. Choose **GitHub** and authorise it
4. Pick your `music-page` repository
5. Leave the build settings alone — Netlify reads `netlify.toml` and detects Next.js
6. **Before you deploy, open "Add environment variables"** — this is the step people miss, and the build fails without it

Add these:

| Key | Value | Required |
|---|---|---|
| `EDIT_KEY` | Your long random passcode (use a different one from your local file) | Yes |
| `YOUTUBE_API_KEY` | Your YouTube Data API key, for song lengths | No |

Then press **Deploy**. The first build takes two or three minutes.

You get an address like `your-site-name.netlify.app`. Rename it under **Site configuration → Change site name**.

**Storage needs no setup.** Songs and pictures are kept in Netlify Blobs, which is switched on automatically. No database to create, nothing to configure.

One thing to know: the settings you added on your own machine do not travel to the live site. Open the live site with your passcode and add your songs there once.

**From now on, every push rebuilds the site automatically:**

```
git add -A && git commit -m "Change the dedication"
git push
```

---

## Step 9 — Share the link

Open your live site with your passcode, add your songs, and press Publish.

The success screen gives you the link to share — and it removes the passcode for you. Copy it from there, not from your browser bar:

- **Yours:** `your-site.netlify.app/?edit=your-passcode` — keep this private
- **Theirs:** `your-site.netlify.app` — send this one

Anyone opening the plain address sees the player and nothing else.

**Keep your passcode out of screenshots.** It sits in the address bar while you edit.

---

## What you can do with this project

### Put it on your CV

This is a real shipped product with a link anyone can open, which counts for far more than a tutorial nobody can see. It also covers unusually broad ground for one project: design, front end, back end and deployment.

Include both links — the live site and the GitHub repository.

Bullets you can adapt:

- Built and deployed a personalised music-sharing web application in TypeScript (Next.js, React, Tailwind), with owner-only editing gated by a server-side key and a public read-only view.
- Integrated the YouTube IFrame API with custom playback controls, and implemented two structurally distinct layouts for mobile and desktop sharing a single player controller.
- Worked design-first: generated reference designs from written prompts, translated them into a technical specification covering data model, endpoints and edge cases, then implemented against it and deployed continuously to Netlify.

That last one is worth keeping. Plenty of people can say they used an AI tool. Far fewer can describe a repeatable process where the design, the written brief and the code each fed the next.

### Give it to someone

The product was designed as a gift and works best as one. It costs nothing to run, needs no app, and the person receiving it just opens a link.

- A friend — songs from the years you have known each other
- A partner — an anniversary, or the songs from one particular trip
- Family — your parents' wedding year, or the music your grandparents grew up with
- A wedding — the playlist with a photo and a message, shared with everyone invited
- Someone leaving — a colleague or friend moving away, with a note in the dedication
- Long distance — one page you both keep adding to

Change the dedication, subtitle and caption for each person. A second page is a new deploy of the same code, so it takes minutes rather than an afternoon.

### Show it in a portfolio

Screenshot both layouts side by side — the phone and desktop views look different enough that the pair makes the point on its own. Link the live site so people can press play.

---

## The one thing to take away

Writing **two** design prompts instead of one decided the entire architecture of this project.

Two separate designs meant two separate layouts, which meant one shared player sitting behind both, which shaped how the whole application is put together. That was a thirty-second decision at the very start, and everything followed from it.

Get the brief right and the code follows. Get it wrong and no amount of AI will save you.

**Full code:** https://github.com/ritu-dadhwal4/music-page
