# KAN as a Dynamic Paper, Not Just a PDF

This prototype tests a Pretext-like layout feature inside a MyST article.

Instead of treating figures as fixed blocks, the figure below behaves like a movable artifact inside the paper. Drag the figure card and watch the surrounding text reflow around it.

```{anywidget} ./pretext-widget.mjs
{
  "text": "Kolmogorov-Arnold Networks provide a useful case for a dynamic paper because the model is both mathematically compact and visually interpretable. A reader should be able to inspect the paper, move a figure, and understand how the artifact relates to the surrounding argument. In this prototype, the draggable block represents a live figure or model artifact. The text is not statically typeset like a PDF. Instead, the layout is recalculated in the browser whenever the artifact moves. This demonstrates the first step toward a paper where prose, figures, equations, and executable visual evidence can coexist on the same page. The final goal is not just decoration, but a more flexible reading interface for scientific communication.",
  "height": 560,
  "figureWidth": 220,
  "figureHeight": 140,
  "initialX": 360,
  "initialY": 190
}
```

The current version is intentionally small. It proves the core interaction first: draggable figure, obstacle detection, and text reflow. Later versions can replace the placeholder card with a real KAN artifact, an image, a notebook output, or a live model visualization.