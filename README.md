# Pretext MyST Demo

This is a working prototype for a Pretext-style draggable figure-aware text wrapping feature in MyST.

## Current behavior

- Runs inside a MyST article page.
- Uses `{anywidget}` to load a JavaScript widget.
- Renders a draggable figure/card.
- Dynamically reflows text around the figure using rectangle obstacle detection.

## Run locally

```bash
npm install -g mystmd
myst start