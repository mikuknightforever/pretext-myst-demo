# Dynamic Paper Pretext Demo

This page demonstrates a prototype for page-level Pretext-style interaction in MyST.

The goal is to move beyond a small localized animated region and test a broader reading mode. In the normal MyST page, the article behaves like a regular document. When Pretext Mode is enabled, the page switches into an interactive reading surface where a figure can be dragged and the surrounding text dynamically reflows around it.

```{anywidget} ./pretext-widget.mjs
{
  "text": "This prototype demonstrates a page-level Pretext-style reading mode for dynamic papers. A normal article layout is useful for stable reading, but dynamic papers may need a second mode where figures, images, model artifacts, and visual evidence can be rearranged interactively. In this mode, the figure becomes a draggable object. The text is measured, placed line by line, and recomputed around the figure as a rectangular layout obstacle. This is not a final document engine, but it shows how a MyST page could support a broader Pretext interaction mode controlled by an on-off toggle similar to a dark or light mode switch. The long-term goal is to connect this behavior to real figures and article content instead of only rendering a local animated region.",
  "figureKicker": "Page-Level Object",
  "figureTitle": "Interactive Figure",
  "figureCaption": "Drag this figure. The page-level text layout will reflow around it.",
  "figureWidth": 260,
  "figureHeight": 165,
  "initialX": 430,
  "initialY": 230
}
```

## Prototype status

This version uses a page-level overlay for Pretext Mode. It is a step toward article-level integration, but it does not yet reflow the native MyST article DOM directly.

Next steps include supporting real images, multiple draggable figures, and deeper integration with MyST article content.