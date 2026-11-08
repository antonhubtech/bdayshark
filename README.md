# A little place made just for you 💌

A dreamy blue Swiss-countryside love letter: butterfly cursor, locked envelope, four-digit code, falling maple leaves.

## Run it

```bash
npm install
npm run dev        # develop
npm run build      # outputs ./dist, ready to upload to any static host (Netlify, Vercel, GitHub Pages…)
```

## Write your message

Open **`src/config.js`** and replace `[WRITE MY PERSONAL MESSAGE HERE]` inside `PERSONAL_MESSAGE`.
Leave a blank line between paragraphs. You can also change the sign-off and add your name there.

## The codes

The two valid codes (`1111` and `0690`) live in `VALID_CODES` in `src/config.js`.

> The lock is a playful touch, not security. Anyone who views the page source can find the codes,
> so don't put anything truly private in the letter.

## Sound

Off by default. The speaker button (top right) starts original, synthesized ambience (soft wind, distant birds,
quiet piano notes). Nothing plays until it is clicked. No audio files are used, so there is nothing to license.

## Structure

```
src/
  App.jsx                 stage control (locked ↔ letter), full reset on close
  config.js               your message, codes, sign-off
  components/
    Scenery.jsx           layered SVG Swiss landscape + pointer parallax, clouds, light rays
    Atmosphere.jsx        fireflies, motes, floating hearts, butterfly passing by
    ButterflyCursor.jsx   blue butterfly cursor + sparkle trail (tap sparkles on touch)
    Butterfly.jsx         the butterfly drawing
    Loader.jsx            butterfly loading screen
    LockScreen.jsx        copy, envelope, PIN form, validation
    Envelope.jsx          envelope, wax seal that cracks, opening animation
    PinInput.jsx          4 boxes: auto-advance, backspace, arrows, paste, Enter
    Letter.jsx            the stationery letter + "Close this little letter ♡"
    MapleLeaves.jsx       canvas maple leaves (one light animation loop)
    AudioToggle.jsx       mute/unmute button
  audio/ambience.js       Web Audio ambience
```

Reduced-motion preference is respected: floating, parallax, fireflies and falling animation are replaced by calm static versions.

## Falling photo stickers

Three cut-out photos drift down with the maple leaves (one every few seconds). They live in
`src/assets/stickers/` as `baby.webp`, `yellow.webp`, `pink.webp`. To change them, replace those files
(keep the names) or edit the list at the top of `src/components/MapleLeaves.jsx`.
