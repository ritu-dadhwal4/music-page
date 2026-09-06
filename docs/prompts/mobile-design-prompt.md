# Mobile design prompt

> Google Flow prompt used to generate `design/mobile.png` (390 px wide).
> Reproduced verbatim as written.

---

Design a premium mobile screen for a personalized music playlist called "Nostalgia." It is a heartfelt digital mixtape created as a gift for a best friend.

Create a vertically scrolling, single-page mobile music player. The design must feel warm, personal, cinematic, nostalgic, and handcrafted—not like Spotify or a generic music application.

## CANVAS AND VISUAL STYLE

- Mobile viewport: 390 px wide.
- Create a long, vertically scrollable screen.
- Background: soft warm ivory, approximately `#FAF5ED`.
- Add extremely subtle peach gradients, warm film grain, and a few tiny faded orange speckles.
- Main text: dark espresso brown.
- Secondary text: muted warm grey.
- Accent color: burnt orange, approximately `#C96322`.
- Use an elegant editorial serif font for the dedication and song title.
- Use a clean sans-serif font for controls and playlist information.
- Use a small monospaced font for track times and labels.
- Keep the layout centred, spacious, refined, and sentimental.
- Use soft shadows, thin borders, off-white cards, and rounded corners.
- Do not add a standard navigation bar, sidebar, search, account profile, advertisements, footer, or unrelated controls.

## DEDICATION HEADER

At the top, leave approximately 55 px of breathing room.

- Centre the large serif heading: "For my best friend"
- Use dark brown text, approximately 34 px, with an elegant editorial appearance.
- Directly underneath, add the uppercase subtitle: "CHEERS TO OUR 10 YEARS OF FRIENDSHIP"
- Use a smaller italic serif font.
- Increase letter spacing.
- Use muted taupe text.
- Keep both lines perfectly centred.

## MEMORY PHOTO

Below the dedication, place a large square instant-photo or Polaroid-style memory card.

- Width: approximately 285 px.
- Slightly rotate it by about -2 degrees.
- Use a thick off-white Polaroid frame.
- Add a soft shadow and rounded outer corners.
- Inside it, display a warm golden-hour photograph of two best friends sitting outdoors, laughing together while one plays an acoustic guitar.
- Use cinematic sunset lighting, warm amber tones, and subtle vintage grain.
- Make the picture feel like an authentic memory rather than a stock photograph.

Add handwritten-style details directly onto the Polaroid:

- At the upper-left: "THE WARMTH"
- Under the photograph: "Golden Hour Daze – 2009"
- Bottom-left: "KODAK 400"
- Bottom-right: "AURORA SKIES"
- Add a small decorative circular mark near the lower-right corner.

Do not place any separate button or floating UI over the faces.

## MAIN PLAYER CARD

Below the photo, create a large music-player card with comfortable spacing from the image.

- Use almost the full mobile width with approximately 20 px side margins.
- Background: warm white.
- Border radius: approximately 22 px.
- Add a thin warm-grey border and a soft shadow.
- Add generous internal padding.

At the top of the player:

- Centre the song title "Golden Hour Daze" in a large dark-brown serif font.
- Under it, centre "AURORA SKIES" in small uppercase italic serif text with wide letter spacing and muted taupe color.

**Progress section:**

- Add a wide horizontal progress bar.
- The completed portion should be burnt orange.
- The remaining portion should be pale beige-grey.
- Use a medium orange circular scrubber.
- Show "0:28" below the left side and "3:32" below the right side using monospaced grey text.

**Playback controls:**

Create a centred row containing five controls:

1. Shuffle icon
2. Previous track inside a pale circular button
3. Large burnt-orange circular Pause button
4. Next track inside a pale circular button
5. Repeat icon

- Make the centre Pause button the largest element.
- Give it a soft orange shadow.
- Use white pause bars.
- Use dark warm-grey icons for the other controls.

**Volume:**

- Add a pale rounded volume-control container beneath the playback controls.
- Put a low-volume speaker icon on the left.
- Add a horizontal slider in the centre.
- Use a burnt-orange circular volume knob positioned around 75%.
- Put a high-volume speaker icon on the right.

## QUEUE HEADER

Below the player card, create a row with:

- "UP NEXT" in uppercase muted-grey text on the left.
- A small rounded taupe pill beside it containing "5 tracks."
- "Queue details →" in burnt orange aligned to the right.

## PLAYLIST

Create five vertically stacked rounded track cards:

1. "1901 (Acoustic French Wave)" — Phoenix — currently playing
2. "The Drifter's Path" — Sarah Jenkins — 4:18
3. "Golden Hour Daze" — Aurora Skies — 3:32
4. "Drifting Coast" — Aurora Halo — 4:05
5. "Cassette Reverie" — Miles & The Echo — 3:49

Each card should include:

- A small square vintage album cover on the left, around 52 × 52 px.
- The track title in medium-weight dark-brown text.
- The artist name underneath in smaller muted-grey text.
- The track duration aligned vertically in the centre on the right.
- Warm off-white background.
- Rounded corners of approximately 16 px.
- A subtle shadow or fine border.
- Consistent spacing between cards.

Highlight the first track as the currently playing song:

- Use a very light peach background.
- Make the artist name burnt orange.
- Replace the duration with the uppercase orange label "NOW."

## INTERACTIONS

Create realistic prototype states for:

- Play and pause.
- Previous and next track.
- Shuffle and repeat.
- Scrubbing through a song.
- Adjusting the volume.
- Selecting any of the five playlist cards.
- Updating the song title, artist, album artwork, duration, active card, and playback state when a new track is selected.
- Keep the audio player visible in the natural page flow; do not turn it into a sticky bottom navigation bar.

The final screen should feel like an intimate musical gift celebrating ten years of friendship, with a sophisticated vintage-editorial design and a highly polished mobile experience.
