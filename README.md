# Progress

A mobile-first PWA for taking aligned progress photos and comparing them with
before/after collages. Implemented from the Claude Design file
`Progress Photo App.dc.html`.

## How it works

Every photo is taken against a draggable, resizable figure guide (front / side /
back, with or without head). The figure's position and size are stored with the
photo, so any two photos can be overlaid with their poses normalized — the
before/after slider and exported collages line up automatically.

## Screens

- **Gallery** — photo grid with date/weight labels
- **New photo** — choose camera or photo picker, figure pose, head toggle
- **Capture** — live camera (or picked image) with the alignment figure,
  size slider, and a 3s self-timer
- **Review** — tag with weight and notes, overlay or caption info style
- **Saved** — prompt to build a collage
- **Compare** — pick the "before" photo
- **Before / After** — draggable comparison slider, save or share as JPEG
- **Detail** — full view, delete, jump to compare

Photos are stored locally in `localStorage` (`pp_photos_v1`) as JPEG data URLs.

## Development

```sh
npm install
npm run dev      # start dev server
npm run build    # production build (generates the PWA service worker)
npm run lint     # eslint
```

Built with Vite + React 19, zustand for state, and vite-plugin-pwa.
Camera capture requires a secure context (localhost or HTTPS).
