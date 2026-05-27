function render({ model, el }) {
  const text =
    model.get("text") ||
    "This page demonstrates a Pretext-style reading mode for dynamic papers. In normal mode, the article behaves like a regular MyST page. When Pretext Mode is enabled, the page switches into an interactive reading surface where the figure becomes draggable and the surrounding text dynamically reflows around it. This prototype moves beyond a small localized animation and tests a broader page-level interaction model.";

  const figureWidth = model.get("figureWidth") || 250;
  const figureHeight = model.get("figureHeight") || 160;

  let figureX = model.get("initialX") || 420;
  let figureY = model.get("initialY") || 220;

  const figureKicker = model.get("figureKicker") || "Draggable Artifact";
  const figureTitle = model.get("figureTitle") || "Interactive Figure";
  const figureCaption =
    model.get("figureCaption") ||
    "Drag this figure in Pretext Mode. The text will dynamically wrap around it.";

  const padding = 42;
  const lineHeight = 32;
  const wordGap = 6;
  const obstacleGap = 20;
  const fontSize = 19;
  const fontFamily =
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

  const words = text.trim().replace(/\s+/g, " ").split(" ");

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = `${fontSize}px ${fontFamily}`;

  const style = document.createElement("style");
  style.textContent = `
    .pretext-root {
      font-family: ${fontFamily};
    }

    .pretext-inline-controller {
      margin: 1.5rem 0;
      padding: 18px 20px;
      border-radius: 18px;
      border: 1px solid rgba(15, 23, 42, 0.14);
      background: #f8fafc;
      color: #111827;
      font-family: ${fontFamily};
      box-shadow: 0 12px 36px rgba(15, 23, 42, 0.08);
    }

    .pretext-inline-controller-title {
      margin: 0 0 8px;
      font-size: 18px;
      font-weight: 800;
      color: #111827;
    }

    .pretext-inline-controller-text {
      margin: 0 0 14px;
      font-size: 14px;
      line-height: 1.6;
      color: #475569;
    }

    .pretext-open-button,
    .pretext-close-button {
      border: 1px solid rgba(15, 23, 42, 0.18);
      border-radius: 999px;
      padding: 10px 16px;
      background: #111827;
      color: #ffffff;
      font-weight: 800;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.16);
    }

    .pretext-open-button:hover,
    .pretext-close-button:hover {
      background: #1f2937;
    }

    .pretext-page-overlay {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      display: none;
      flex-direction: column;
      background: #f8fafc;
      color: #111827;
      font-family: ${fontFamily};
    }

    .pretext-root.pretext-mode-on .pretext-page-overlay {
      display: flex;
    }

    .pretext-overlay-bar {
      height: 68px;
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 0 24px;
      border-bottom: 1px solid rgba(15, 23, 42, 0.12);
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(14px);
      box-sizing: border-box;
    }

    .pretext-overlay-heading {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .pretext-overlay-title {
      font-size: 16px;
      font-weight: 850;
      letter-spacing: -0.01em;
      color: #111827;
    }

    .pretext-overlay-subtitle {
      font-size: 12px;
      color: #64748b;
    }

    .pretext-stage {
      position: relative;
      flex: 1 1 auto;
      min-height: 0;
      overflow: hidden;
      background:
        radial-gradient(circle at top left, rgba(37, 99, 235, 0.08), transparent 32%),
        #ffffff;
      user-select: none;
      touch-action: none;
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
      border-radius: 20px;
      cursor: grab;
      background: linear-gradient(135deg, #111827, #2563eb);
      color: white;
      box-shadow:
        0 24px 55px rgba(37, 99, 235, 0.30),
        inset 0 1px 0 rgba(255, 255, 255, 0.18);
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      padding: 20px;
      text-align: left;
      font-family: ${fontFamily};
      box-sizing: border-box;
    }

    .pretext-figure:active {
      cursor: grabbing;
    }

    .pretext-kicker {
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      opacity: 0.72;
      font-weight: 850;
    }

    .pretext-title {
      font-size: 26px;
      line-height: 1.05;
      font-weight: 900;
      letter-spacing: -0.03em;
    }

    .pretext-caption {
      font-size: 12px;
      line-height: 1.4;
      opacity: 0.84;
    }

    .pretext-footer-hint {
      position: absolute;
      left: 24px;
      bottom: 18px;
      z-index: 20;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.72);
      color: white;
      font-size: 12px;
      pointer-events: none;
      backdrop-filter: blur(10px);
    }
  `;

  const root = document.createElement("div");
  root.className = "pretext-root";

  const controller = document.createElement("section");
  controller.className = "pretext-inline-controller";

  const controllerTitle = document.createElement("p");
  controllerTitle.className = "pretext-inline-controller-title";
  controllerTitle.textContent = "Pretext Page-Level Mode";

  const controllerText = document.createElement("p");
  controllerText.className = "pretext-inline-controller-text";
  controllerText.textContent =
    "Open Pretext Mode to switch from the normal MyST article into a page-level draggable figure-aware reading surface.";

  const openButton = document.createElement("button");
  openButton.className = "pretext-open-button";
  openButton.type = "button";
  openButton.textContent = "Open Pretext Mode";

  controller.appendChild(controllerTitle);
  controller.appendChild(controllerText);
  controller.appendChild(openButton);

  const overlay = document.createElement("section");
  overlay.className = "pretext-page-overlay";
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("role", "dialog");

  const overlayBar = document.createElement("header");
  overlayBar.className = "pretext-overlay-bar";

  const heading = document.createElement("div");
  heading.className = "pretext-overlay-heading";

  const overlayTitle = document.createElement("div");
  overlayTitle.className = "pretext-overlay-title";
  overlayTitle.textContent = "Pretext Mode: Page-Level Figure-Aware Layout";

  const overlaySubtitle = document.createElement("div");
  overlaySubtitle.className = "pretext-overlay-subtitle";
  overlaySubtitle.textContent =
    "Drag the figure. The text is recomputed around the figure as a layout obstacle.";

  heading.appendChild(overlayTitle);
  heading.appendChild(overlaySubtitle);

  const closeButton = document.createElement("button");
  closeButton.className = "pretext-close-button";
  closeButton.type = "button";
  closeButton.textContent = "Exit Pretext Mode";

  overlayBar.appendChild(heading);
  overlayBar.appendChild(closeButton);

  const stage = document.createElement("div");
  stage.className = "pretext-stage";

  const textLayer = document.createElement("div");
  textLayer.className = "pretext-text-layer";

  const figure = document.createElement("button");
  figure.className = "pretext-figure";
  figure.type = "button";

  const kickerElement = document.createElement("div");
  kickerElement.className = "pretext-kicker";
  kickerElement.textContent = figureKicker;

  const titleElement = document.createElement("div");
  titleElement.className = "pretext-title";
  titleElement.textContent = figureTitle;

  const captionElement = document.createElement("div");
  captionElement.className = "pretext-caption";
  captionElement.textContent = figureCaption;

  figure.appendChild(kickerElement);
  figure.appendChild(titleElement);
  figure.appendChild(captionElement);

  const footerHint = document.createElement("div");
  footerHint.className = "pretext-footer-hint";
  footerHint.textContent = "Tip: press Esc to exit Pretext Mode.";

  stage.appendChild(textLayer);
  stage.appendChild(figure);
  stage.appendChild(footerHint);

  overlay.appendChild(overlayBar);
  overlay.appendChild(stage);

  root.appendChild(controller);
  root.appendChild(overlay);

  el.innerHTML = "";
  el.appendChild(style);
  el.appendChild(root);

  let pretextMode = false;
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  let animationFrameId = null;
  let previousBodyOverflow = "";

  function measureWord(word) {
    ctx.font = `${fontSize}px ${fontFamily}`;
    return ctx.measureText(word).width;
  }

  function clampFigurePosition() {
    const maxX = Math.max(0, stage.clientWidth - figureWidth);
    const maxY = Math.max(0, stage.clientHeight - figureHeight);

    figureX = Math.max(0, Math.min(figureX, maxX));
    figureY = Math.max(0, Math.min(figureY, maxY));
  }

  function setFigurePosition() {
    clampFigurePosition();
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

    return segments.filter(([start, end]) => end - start > 60);
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
    if (!pretextMode) return;

    const stageWidth = stage.clientWidth;
    const stageHeight = stage.clientHeight;

    if (stageWidth <= 0 || stageHeight <= 0) return;

    textLayer.innerHTML = "";

    const obstacle = getFigureObstacle();

    let wordIndex = 0;
    let y = padding;

    while (wordIndex < words.length && y + lineHeight < stageHeight - padding) {
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
    if (!pretextMode) return;
    if (animationFrameId) return;

    animationFrameId = requestAnimationFrame(() => {
      setFigurePosition();
      renderText();
      animationFrameId = null;
    });
  }

  function openPretextMode() {
    pretextMode = true;
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    root.classList.add("pretext-mode-on");

    requestAnimationFrame(() => {
      setFigurePosition();
      renderText();
      closeButton.focus();
    });
  }

  function closePretextMode() {
    pretextMode = false;
    isDragging = false;
    root.classList.remove("pretext-mode-on");
    document.body.style.overflow = previousBodyOverflow;
    textLayer.innerHTML = "";
    openButton.focus();
  }

  function handlePointerDown(event) {
    if (!pretextMode) return;

    isDragging = true;

    const figureRect = figure.getBoundingClientRect();

    offsetX = event.clientX - figureRect.left;
    offsetY = event.clientY - figureRect.top;

    figure.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    if (!isDragging || !pretextMode) return;

    const stageRect = stage.getBoundingClientRect();

    const nextX = event.clientX - stageRect.left - offsetX;
    const nextY = event.clientY - stageRect.top - offsetY;

    const maxX = Math.max(0, stage.clientWidth - figureWidth);
    const maxY = Math.max(0, stage.clientHeight - figureHeight);

    figureX = Math.max(0, Math.min(nextX, maxX));
    figureY = Math.max(0, Math.min(nextY, maxY));

    rerenderSoon();
  }

  function handlePointerUp() {
    isDragging = false;
  }

  function handleKeyDown(event) {
    if (event.key === "Escape" && pretextMode) {
      closePretextMode();
    }
  }

  openButton.addEventListener("click", openPretextMode);
  closeButton.addEventListener("click", closePretextMode);

  figure.addEventListener("pointerdown", handlePointerDown);
  figure.addEventListener("pointermove", handlePointerMove);
  figure.addEventListener("pointerup", handlePointerUp);
  figure.addEventListener("pointercancel", handlePointerUp);

  window.addEventListener("keydown", handleKeyDown);

  const resizeObserver = new ResizeObserver(() => {
    rerenderSoon();
  });

  resizeObserver.observe(stage);

  return () => {
    resizeObserver.disconnect();

    openButton.removeEventListener("click", openPretextMode);
    closeButton.removeEventListener("click", closePretextMode);

    figure.removeEventListener("pointerdown", handlePointerDown);
    figure.removeEventListener("pointermove", handlePointerMove);
    figure.removeEventListener("pointerup", handlePointerUp);
    figure.removeEventListener("pointercancel", handlePointerUp);

    window.removeEventListener("keydown", handleKeyDown);

    root.classList.remove("pretext-mode-on");
    document.body.style.overflow = previousBodyOverflow;
  };
}

export default { render };