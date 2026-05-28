# Native MyST Article Pretext Demo

This page is written as a normal MyST article first. The Pretext widget below does not receive the article text manually. Instead, it scans the already-rendered article paragraphs and uses them as the source text for the interactive Pretext reading mode.

The goal of this version is to move closer to native MyST article integration. The normal page remains readable as a regular document. When Pretext Mode is opened, the widget extracts the article prose and the marked figure, then generates a page-level draggable figure-aware layout.

This approach is still a prototype. It does not directly reflow the original MyST DOM in place yet. However, it does use the native MyST article as the source of truth, which is a step beyond the earlier version where text was passed manually through the widget JSON.

<figure
  class="pretext-draggable"
  data-pretext-kicker="Native Article Figure"
  data-pretext-title="Draggable Figure"
  style="margin: 1.5rem 0; padding: 1rem; border: 1px solid #cbd5e1; border-radius: 16px; background: #f8fafc;"
>
  <div style="height: 170px; border-radius: 14px; background: linear-gradient(135deg, #111827, #2563eb); color: white; display: grid; place-items: center; font-weight: 800; font-size: 24px;">
    Native MyST Figure
  </div>
  <figcaption>
    This figure is part of the normal MyST article. It is marked with <code>class="pretext-draggable"</code>, so the Pretext widget can find it and convert it into a draggable layout obstacle.
  </figcaption>
</figure>

The figure above is not inside the widget. It is ordinary article content rendered by MyST. The widget is placed after the article content and scans the page when the user opens Pretext Mode.

In the long term, this direction could become closer to a real article-level reading mode: selected figures, images, model outputs, or notebook artifacts could become movable objects, while the prose responds to those objects dynamically.

```{anywidget} ./pretext-widget.mjs
{
  "figureWidth": 270,
  "figureHeight": 185,
  "initialX": 430,
  "initialY": 230
}
```

## Prototype status

This version uses native MyST article content as the source for the Pretext layout.

Current behavior:

- The article is written normally in MyST.
- A normal article figure is marked with `class="pretext-draggable"`.
- The widget scans the rendered article DOM.
- Paragraph text is extracted from native article paragraphs.
- The marked figure is extracted and represented as a draggable object.
- The Pretext view is still rendered as an overlay prototype.

Next steps include reflowing richer MyST content, supporting multiple figures, and exploring deeper integration with the MyST article theme.