# Pretext MyST Demo

A working MyST prototype for page-level draggable figure-aware text wrapping.

This project explores a Pretext-style reading mode for dynamic papers. In normal mode, the page behaves like a regular MyST article. When Pretext Mode is enabled, the page switches into an interactive reading surface where a figure/card can be dragged and the surrounding text dynamically reflows around it.

## Current behavior

- Runs inside a MyST article page.
- Uses `{anywidget}` to load a JavaScript widget.
- Provides a Pretext Mode toggle.
- Normal mode shows a regular MyST article page.
- Pretext Mode opens a page-level interactive reading surface.
- A figure/card can be dragged inside the page-level surface.
- Text dynamically reflows around the figure using rectangle obstacle detection.

## Why this exists

The purpose of this prototype is to test a broader page-level integration mode for Pretext-style interactions, rather than limiting the effect to a small animated region.

The current version proves that:

1. MyST can load an interactive JavaScript widget through `{anywidget}`.
2. A page-level Pretext Mode can be toggled on and off.
3. Draggable figures can act as layout obstacles.
4. Text can be recomputed and visually wrapped around those obstacles.

## Tech stack

- MyST Markdown
- MyST AnyWidget
- JavaScript
- HTML/CSS
- MyST `article-theme`

## Run locally

Install MyST:

```bash
npm install -g mystmd
```

Start the local development server:

```bash
myst start
```

Then open the local URL shown in the terminal, usually:

```text
http://localhost:3000
```

## Main files

- `myst.yml`: MyST project configuration.
- `index.md`: MyST article page and widget invocation.
- `pretext-widget.mjs`: Core JavaScript widget implementing the Pretext Mode prototype.
- `pretext-widget-local-demo.mjs`: Backup of the earlier localized demo version, if present.

## Current implementation

The current prototype uses a page-level overlay approach:

- The normal MyST article remains visible by default.
- Clicking the Pretext Mode button opens an interactive full-page reading surface.
- The widget manually lays out text word by word.
- The draggable figure is treated as a rectangular obstacle.
- When the figure moves, the text layout is recomputed.

## Current limitations

This is still a prototype, not a final MyST extension.

Current limitations:

- The text inside Pretext Mode is rendered by the widget, not by reflowing the native MyST article DOM.
- Only one draggable figure/card is supported.
- The obstacle shape is rectangular.
- Complex MyST content such as equations, citations, footnotes, tables, and cross-references is not yet supported inside the dynamic layout.
- The current version demonstrates the interaction model, not a full production-ready document layout engine.

## Next steps

Possible next improvements:

1. Replace the placeholder card with a real image or figure.
2. Support multiple draggable figures.
3. Make the toggle visually closer to a dark/light mode switch.
4. Add configurable figure title, caption, image source, and initial position.
5. Explore scanning real MyST article content and converting selected figures into draggable obstacles.
6. Move from a page-level overlay prototype toward deeper article-theme integration.
