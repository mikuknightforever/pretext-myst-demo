function render({ model, el }) {
  const text =
    model.get("text") ||
    "Drag the figure and the text will reflow around it.";

  const height = model.get("height") || 560;
  const figureWidth = model.get("figureWidth") || 220;
  const figureHeight = model.get("figureHeight") || 140;

  let figureX = model.get("initialX") || 320;
  let figureY = model.get("initialY") || 180;

  const padding = 32;
  const lineHeight = 30;
  const wordGap = 6;
  const obstacleGap = 16;
  const fontSize = 18;
  const fontFamily =
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

  const words = text.trim().replace(/\s+/g, " ").split(" ");

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = `${fontSize}px ${fontFamily}`;

  const style = document.createElement("style");
  style.textContent = `
    .pretext-stage {
      position: relative;
      width: 100%;
      height: ${height}px;
      overflow: hidden;
      border-radius: 22px;
      border: 1px solid rgba(15, 23, 42, 0.14);
      background: #f8fafc;
      box-shadow: 0 20px 60px rgba(15, 23, 42, 0.14);
      user-select: none;
      touch-action: none;
      margin: 1.5rem 0;
    }

    .pretext-text-layer {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .pretext-word {
      position: absolute;
      white-space: nowrap;
      font-size: ${fontSize}px;
      line-height: ${lineHeight}px;
      color: #111827;
    }

    .pretext-figure {
      position: absolute;
      z-index: 10;
      width: ${figureWidth}px;
      height: ${figureHeight}px;
      border: 0;
      border-radius: 18px;
      cursor: grab;
      background: linear-gradient(135deg, #111827, #2563eb);
      color: white;
      box-shadow: 0 22px 45px rgba(37, 99, 235, 0.28);
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      padding: 18px;
      text-align: left;
      font-family: ${fontFamily};
    }

    .pretext-figure:active {
      cursor: grabbing;
    }

    .pretext-kicker {
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      opacity: 0.72;
      font-weight: 800;
    }

    .pretext-title {
      font-size: 24px;
      line-height: 1.05;
      font-weight: 850;
    }

    .pretext-caption {
      font-size: 12px;
      line-height: 1.35;
      opacity: 0.82;
    }
  `;

  const stage = document.createElement("div");
  stage.className = "pretext-stage";

  const textLayer = document.createElement("div");
  textLayer.className = "pretext-text-layer";

  const figure = document.createElement("button");
  figure.className = "pretext-figure";
  figure.type = "button";

  figure.innerHTML = `
    <div class="pretext-kicker">Interactive Artifact</div>
    <div class="pretext-title">KAN<br/>Figure</div>
    <div class="pretext-caption">Drag me. The article text will wrap around this block.</div>
  `;

  stage.appendChild(textLayer);
  stage.appendChild(figure);

  el.innerHTML = "";
  el.appendChild(style);
  el.appendChild(stage);

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  let animationFrameId = null;

  function measureWord(word) {
    return ctx.measureText(word).width;
  }

  function setFigurePosition() {
    figure.style.left = `${figureX}px`;
    figure.style.top = `${figureY}px`;
  }

  function getFigureObstacle() {
    return {
      left: figureX - obstacleGap,
      right: figureX + figureWidth + obstacleGap,
      top: figureY - obstacleGap,
      bottom: figureY + figureHeight + obstacleGap
    };
  }

  function getAvailableSegmentsForLine(lineCenterY, obstacle) {
    const leftEdge = padding;
    const rightEdge = stage.clientWidth - padding;

    const lineHitsFigure =
      lineCenterY >= obstacle.top && lineCenterY <= obstacle.bottom;

    if (!lineHitsFigure) {
      return [[leftEdge, rightEdge]];
    }

    const segments = [];

    if (obstacle.left > leftEdge) {
      segments.push([leftEdge, Math.min(obstacle.left, rightEdge)]);
    }

    if (obstacle.right < rightEdge) {
      segments.push([Math.max(obstacle.right, leftEdge), rightEdge]);
    }

    return segments.filter(([start, end]) => end - start > 50);
  }

  function createWordElement(word, x, y) {
    const span = document.createElement("span");
    span.className = "pretext-word";
    span.textContent = word;
    span.style.left = `${x}px`;
    span.style.top = `${y}px`;
    return span;
  }

  function renderText() {
    textLayer.innerHTML = "";

    const obstacle = getFigureObstacle();

    let wordIndex = 0;
    let y = padding;

    while (wordIndex < words.length && y + lineHeight < height - padding) {
      const lineCenterY = y + lineHeight / 2;
      const segments = getAvailableSegmentsForLine(lineCenterY, obstacle);

      for (const [segmentStart, segmentEnd] of segments) {
        let x = segmentStart;

        while (wordIndex < words.length) {
          const word = words[wordIndex];
          const wordWidth = measureWord(word);

          if (x + wordWidth > segmentEnd) {
            break;
          }

          textLayer.appendChild(createWordElement(word, x, y));

          x += wordWidth + wordGap;
          wordIndex += 1;
        }
      }

      y += lineHeight;
    }
  }

  function rerenderSoon() {
    if (animationFrameId) return;

    animationFrameId = requestAnimationFrame(() => {
      setFigurePosition();
      renderText();
      animationFrameId = null;
    });
  }

  function handlePointerDown(event) {
    isDragging = true;

    const figureRect = figure.getBoundingClientRect();

    offsetX = event.clientX - figureRect.left;
    offsetY = event.clientY - figureRect.top;

    figure.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    if (!isDragging) return;

    const stageRect = stage.getBoundingClientRect();

    let nextX = event.clientX - stageRect.left - offsetX;
    let nextY = event.clientY - stageRect.top - offsetY;

    const maxX = stage.clientWidth - figureWidth;
    const maxY = height - figureHeight;

    figureX = Math.max(0, Math.min(nextX, maxX));
    figureY = Math.max(0, Math.min(nextY, maxY));

    rerenderSoon();
  }

  function handlePointerUp() {
    isDragging = false;
  }

  figure.addEventListener("pointerdown", handlePointerDown);
  figure.addEventListener("pointermove", handlePointerMove);
  figure.addEventListener("pointerup", handlePointerUp);
  figure.addEventListener("pointercancel", handlePointerUp);

  const resizeObserver = new ResizeObserver(() => {
    rerenderSoon();
  });

  resizeObserver.observe(stage);

  setFigurePosition();
  renderText();

  return () => {
    resizeObserver.disconnect();
    figure.removeEventListener("pointerdown", handlePointerDown);
    figure.removeEventListener("pointermove", handlePointerMove);
    figure.removeEventListener("pointerup", handlePointerUp);
    figure.removeEventListener("pointercancel", handlePointerUp);
  };
}

export default { render };