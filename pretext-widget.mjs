function render({ model, el }) {
  const draggableSelector =
    model.get("draggableSelector") || ".pretext-draggable";

  const articleSelector = model.get("articleSelector") || "article, main";

  const fontFamily =
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

  const style = document.createElement("style");
  style.textContent = `
    .pretext-root {
      font-family: ${fontFamily};
    }

    .pretext-draggable {
      width: 360px !important;
      max-width: 45% !important;
      float: right !important;
      clear: none !important;
      margin: 0.5rem 0 1rem 1.5rem !important;
      padding: 1rem !important;
      border: 1px solid #cbd5e1 !important;
      border-radius: 16px !important;
      background: #f8fafc !important;
      box-sizing: border-box !important;
    }

    .pretext-draggable > div {
      width: 100% !important;
      height: 170px !important;
      border-radius: 14px !important;
      box-sizing: border-box !important;
    }

    .pretext-draggable figcaption {
      margin-top: 0.75rem !important;
      font-size: 0.9rem !important;
      line-height: 1.45 !important;
    }

    .pretext-inline-controller {
      margin: 1.5rem 0;
      padding: 18px 20px;
      border-radius: 18px;
      border: 1px solid rgba(148, 163, 184, 0.28);
      background: rgba(248, 250, 252, 0.92);
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
      background: Canvas;
      color: CanvasText;
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
      border-bottom: 1px solid rgba(148, 163, 184, 0.25);
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(14px);
      box-sizing: border-box;
    }

    @media (prefers-color-scheme: dark) {
      .pretext-overlay-bar {
        background: rgba(15, 23, 42, 0.88);
      }
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
    }

    .pretext-overlay-subtitle {
      font-size: 12px;
      color: #64748b;
    }

    .pretext-snapshot-scroll {
      position: relative;
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      background: Canvas;
      color: CanvasText;
    }

    .pretext-snapshot-shell {
      position: relative;
      padding-top: 36px;
      padding-bottom: 96px;
      box-sizing: border-box;
    }

    .pretext-snapshot-shell article,
    .pretext-snapshot-shell main {
      width: 100%;
      max-width: none;
      margin: 0;
    }

    .pretext-snapshot-shell .pretext-root,
    .pretext-snapshot-shell .pretext-inline-controller,
    .pretext-snapshot-shell .pretext-page-overlay {
      display: none !important;
    }

    .pretext-active-draggable {
      position: relative;
      z-index: 30;
      cursor: grab !important;
      touch-action: none;
      user-select: none;
      will-change: transform;
      outline: 2px solid rgba(37, 99, 235, 0.35);
      outline-offset: 4px;
      transition: outline-color 120ms ease, box-shadow 120ms ease;
    }

    .pretext-active-draggable.pretext-absolute-dragging {
      position: absolute !important;
      float: none !important;
      clear: none !important;
      margin: 0 !important;
      z-index: 50 !important;
      box-sizing: border-box !important;
    }

    .pretext-drag-placeholder {
      visibility: hidden !important;
      pointer-events: none !important;
      box-sizing: border-box !important;
    }

    .pretext-active-draggable:hover {
      outline-color: rgba(37, 99, 235, 0.7);
      box-shadow: 0 18px 42px rgba(37, 99, 235, 0.18);
    }

    .pretext-active-draggable.is-dragging {
      cursor: grabbing !important;
      outline-color: rgba(37, 99, 235, 0.95);
      box-shadow: 0 24px 60px rgba(37, 99, 235, 0.28);
    }

    .pretext-partial-reflow-layer {
      position: absolute;
      inset: 0;
      z-index: 40;
      pointer-events: none;
    }

    .pretext-partial-word {
      position: absolute;
      white-space: nowrap;
      pointer-events: none;
    }

    .pretext-reflow-hidden {
      visibility: hidden !important;
    }

    .pretext-footer-hint {
      position: fixed;
      left: 24px;
      bottom: 18px;
      z-index: 2147483647;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.78);
      color: white;
      font-size: 12px;
      pointer-events: none;
      backdrop-filter: blur(10px);
    }
  `;

  function ensureGlobalPretextSourceStyles() {
    const styleId = "pretext-global-source-styles";

    if (document.getElementById(styleId)) return;

    const globalStyle = document.createElement("style");
    globalStyle.id = styleId;
    globalStyle.textContent = `
    figure.pretext-draggable {
      width: 360px !important;
      max-width: 45% !important;
      float: right !important;
      clear: none !important;
      margin: 0.5rem 0 1rem 1.5rem !important;
      padding: 1rem !important;
      border: 1px solid #cbd5e1 !important;
      border-radius: 16px !important;
      background: #f8fafc !important;
      box-sizing: border-box !important;
    }

    figure.pretext-draggable > div {
      width: 100% !important;
      height: 170px !important;
      border-radius: 14px !important;
      box-sizing: border-box !important;
    }

    figure.pretext-draggable figcaption {
      margin-top: 0.75rem !important;
      font-size: 0.9rem !important;
      line-height: 1.45 !important;
    }
  `;

    document.head.appendChild(globalStyle);
  }

  ensureGlobalPretextSourceStyles();

  const root = document.createElement("div");
  root.className = "pretext-root";

  const controller = document.createElement("section");
  controller.className = "pretext-inline-controller";

  const controllerTitle = document.createElement("p");
  controllerTitle.className = "pretext-inline-controller-title";
  controllerTitle.textContent = "Native Layout Snapshot Pretext Mode";

  const controllerText = document.createElement("p");
  controllerText.className = "pretext-inline-controller-text";
  controllerText.textContent =
    "Open Pretext Mode to clone the native MyST article layout. Drag the marked figure to locally reflow nearby text while the rest of the article remains unchanged.";

  const openButton = document.createElement("button");
  openButton.className = "pretext-open-button";
  openButton.type = "button";
  openButton.textContent = "Open Native Layout Snapshot";

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
  overlayTitle.textContent = "Pretext Mode: Native Snapshot + Partial Reflow";

  const overlaySubtitle = document.createElement("div");
  overlaySubtitle.className = "pretext-overlay-subtitle";
  overlaySubtitle.textContent =
    "Initial layout is preserved. Drag the marked figure to reflow only nearby paragraphs.";

  heading.appendChild(overlayTitle);
  heading.appendChild(overlaySubtitle);

  const closeButton = document.createElement("button");
  closeButton.className = "pretext-close-button";
  closeButton.type = "button";
  closeButton.textContent = "Exit Pretext Mode";

  overlayBar.appendChild(heading);
  overlayBar.appendChild(closeButton);

  const snapshotScroll = document.createElement("div");
  snapshotScroll.className = "pretext-snapshot-scroll";

  const snapshotShell = document.createElement("div");
  snapshotShell.className = "pretext-snapshot-shell";

  const partialReflowLayer = document.createElement("div");
  partialReflowLayer.className = "pretext-partial-reflow-layer";

  snapshotScroll.appendChild(snapshotShell);

  const footerHint = document.createElement("div");
  footerHint.className = "pretext-footer-hint";
  footerHint.textContent =
    "B2 prototype: native snapshot remains; dragging only reflows nearby paragraphs. Press Esc to exit.";

  overlay.appendChild(overlayBar);
  overlay.appendChild(snapshotScroll);
  overlay.appendChild(footerHint);

  root.appendChild(controller);
  root.appendChild(overlay);

  el.innerHTML = "";
  el.appendChild(style);
  el.appendChild(root);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  let pretextMode = false;
  let previousBodyOverflow = "";
  let cleanupDragHandlers = [];
  let activeDrag = null;

  function clampNumber(value, min, max) {
    return Math.max(min, Math.min(value, max));
  }

  function getArticleRoot() {
    return (
      el.closest("article") ||
      document.querySelector(articleSelector) ||
      document.querySelector("main") ||
      document.body
    );
  }

  function getContentRectFromArticle(articleRoot) {
    const contentElements = Array.from(
      articleRoot.querySelectorAll("h1, h2, h3, p, figure, ul, ol, blockquote")
    ).filter((node) => {
      if (node.closest(".pretext-root")) return false;
      if (node.closest("nav, header, footer, aside")) return false;
      return true;
    });

    if (contentElements.length === 0) {
      return articleRoot.getBoundingClientRect();
    }

    const rects = contentElements
      .map((node) => node.getBoundingClientRect())
      .filter((rect) => rect.width > 0 && rect.height > 0);

    if (rects.length === 0) {
      return articleRoot.getBoundingClientRect();
    }

    const left = Math.min(...rects.map((rect) => rect.left));
    const right = Math.max(...rects.map((rect) => rect.right));
    const top = Math.min(...rects.map((rect) => rect.top));
    const bottom = Math.max(...rects.map((rect) => rect.bottom));

    return {
      left,
      right,
      top,
      bottom,
      width: right - left,
      height: bottom - top
    };
  }

  function removeDuplicateIds(container) {
    container.querySelectorAll("[id]").forEach((node) => {
      node.removeAttribute("id");
    });
  }

  function removeWidgetArtifacts(container) {
    container.querySelectorAll(".pretext-root").forEach((node) => {
      node.remove();
    });

    container.querySelectorAll("script").forEach((node) => {
      node.remove();
    });
  }

  function cloneNativeArticle() {
    const articleRoot = getArticleRoot();
    const articleRect = getContentRectFromArticle(articleRoot);

    const clone = articleRoot.cloneNode(true);

    removeDuplicateIds(clone);
    removeWidgetArtifacts(clone);

    return {
      clone,
      articleRect
    };
  }

  function applySnapshotColumn(articleRect) {
    const viewportWidth = window.innerWidth;
    const maxAvailableWidth = Math.max(360, viewportWidth - 48);

    const width = clampNumber(
      articleRect.width || 760,
      360,
      maxAvailableWidth
    );

    const left = clampNumber(
      articleRect.left || 24,
      24,
      Math.max(24, viewportWidth - width - 24)
    );

    snapshotShell.style.width = `${width}px`;
    snapshotShell.style.marginLeft = `${left}px`;
    snapshotShell.style.marginRight = "24px";
  }

  function resetSnapshot() {
    cleanupDragHandlers.forEach((cleanup) => cleanup());
    cleanupDragHandlers = [];
    activeDrag = null;
    partialReflowLayer.innerHTML = "";
    snapshotShell.innerHTML = "";
  }

  function clearPartialReflow() {
    snapshotShell
      .querySelectorAll(".pretext-reflow-hidden")
      .forEach((node) => {
        node.classList.remove("pretext-reflow-hidden");
      });

    partialReflowLayer.innerHTML = "";
  }

  function ensurePartialReflowLayer() {
    if (!partialReflowLayer.parentElement) {
      snapshotShell.appendChild(partialReflowLayer);
    }
  }

  function getShellRelativeRect(element) {
    const elementRect = element.getBoundingClientRect();
    const shellRect = snapshotShell.getBoundingClientRect();

    return {
      left: elementRect.left - shellRect.left,
      top: elementRect.top - shellRect.top,
      right: elementRect.right - shellRect.left,
      bottom: elementRect.bottom - shellRect.top,
      width: elementRect.width,
      height: elementRect.height
    };
  }

  function shouldIgnoreParagraph(paragraph) {
    if (paragraph.closest(".pretext-inline-controller")) return true;
    if (paragraph.closest(".pretext-footer-hint")) return true;
    if (paragraph.closest(".pretext-partial-reflow-layer")) return true;
    if (paragraph.closest("nav, header, footer, aside")) return true;
    if (paragraph.closest("figure")) return true;
    if (paragraph.closest(".pretext-ignore")) return true;
    return false;
  }

  function getParagraphsInSnapshot() {
    return Array.from(snapshotShell.querySelectorAll("p")).filter(
      (paragraph) => !shouldIgnoreParagraph(paragraph)
    );
  }

  function getAffectedParagraphs(obstacleRect) {
    const paragraphs = getParagraphsInSnapshot();

    const zoneTop = obstacleRect.top - 360;
    const zoneBottom = obstacleRect.bottom + 360;

    let affected = paragraphs.filter((paragraph) => {
      const rect = getShellRelativeRect(paragraph);
      return rect.bottom >= zoneTop && rect.top <= zoneBottom;
    });

    if (affected.length === 0 && paragraphs.length > 0) {
      const obstacleCenter = (obstacleRect.top + obstacleRect.bottom) / 2;

      affected = paragraphs
        .map((paragraph) => {
          const rect = getShellRelativeRect(paragraph);
          const center = (rect.top + rect.bottom) / 2;

          return {
            paragraph,
            distance: Math.abs(center - obstacleCenter)
          };
        })
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 2)
        .map((item) => item.paragraph);
    }

    return affected;
  }

  function getNativeTextStyle(referenceParagraph) {
    const computed = window.getComputedStyle(referenceParagraph);

    const fontSize = parseFloat(computed.fontSize) || 16;

    const lineHeight =
      computed.lineHeight === "normal"
        ? fontSize * 1.5
        : parseFloat(computed.lineHeight) || fontSize * 1.5;

    const paragraphGap = Math.max(
      parseFloat(computed.marginBottom) || 0,
      lineHeight * 0.7
    );

    return {
      fontSize,
      lineHeight,
      paragraphGap,
      fontFamily: computed.fontFamily || fontFamily,
      fontWeight: computed.fontWeight || "400",
      color: computed.color || "CanvasText"
    };
  }

  function measureWord(word, textStyle) {
    ctx.font = `${textStyle.fontWeight} ${textStyle.fontSize}px ${textStyle.fontFamily}`;
    return ctx.measureText(word).width;
  }

  function createWordElement(word, x, y, textStyle) {
    const span = document.createElement("span");
    span.className = "pretext-partial-word";
    span.textContent = word;

    span.style.left = `${x}px`;
    span.style.top = `${y}px`;
    span.style.fontSize = `${textStyle.fontSize}px`;
    span.style.lineHeight = `${textStyle.lineHeight}px`;
    span.style.fontFamily = textStyle.fontFamily;
    span.style.fontWeight = textStyle.fontWeight;
    span.style.color = textStyle.color;

    return span;
  }

  function getAvailableSegmentsForLine(lineCenterY, obstacleRect, leftEdge, rightEdge) {
    const lineHitsObstacle =
      lineCenterY >= obstacleRect.top && lineCenterY <= obstacleRect.bottom;

    if (!lineHitsObstacle) {
      return [[leftEdge, rightEdge]];
    }

    const segments = [];

    if (obstacleRect.left > leftEdge) {
      segments.push([leftEdge, Math.min(obstacleRect.left - 20, rightEdge)]);
    }

    if (obstacleRect.right < rightEdge) {
      segments.push([Math.max(obstacleRect.right + 20, leftEdge), rightEdge]);
    }

    return segments.filter(([start, end]) => end - start > 60);
  }

  function renderParagraphAsWords(paragraph, startY, leftEdge, rightEdge, obstacleRect, textStyle) {
    const words = paragraph.textContent.trim().replace(/\s+/g, " ").split(" ");

    let wordIndex = 0;
    let y = startY;

    while (wordIndex < words.length) {
      const lineCenterY = y + textStyle.lineHeight / 2;

      const segments = getAvailableSegmentsForLine(
        lineCenterY,
        obstacleRect,
        leftEdge,
        rightEdge
      );

      for (const [segmentStart, segmentEnd] of segments) {
        let x = segmentStart;

        while (wordIndex < words.length) {
          const word = words[wordIndex];
          const wordWidth = measureWord(word, textStyle);

          if (x + wordWidth > segmentEnd) {
            break;
          }

          partialReflowLayer.appendChild(
            createWordElement(word, x, y, textStyle)
          );

          x += wordWidth + 6;
          wordIndex += 1;
        }
      }

      y += textStyle.lineHeight;
    }

    return y + textStyle.paragraphGap;
  }

  function renderPartialReflow(activeFigure) {
    ensurePartialReflowLayer();
    clearPartialReflow();

    const obstacleRect = getShellRelativeRect(activeFigure);
    const affectedParagraphs = getAffectedParagraphs(obstacleRect);


    if (affectedParagraphs.length === 0) {
      console.warn("[Pretext debug] No affected paragraphs found.");
      return;
    }

    const textStyle = getNativeTextStyle(affectedParagraphs[0]);

    const paragraphRects = affectedParagraphs.map((paragraph) =>
      getShellRelativeRect(paragraph)
    );

    const topEdge = Math.min(...paragraphRects.map((rect) => rect.top));

    const leftEdge = 0;
    const rightEdge = snapshotShell.clientWidth;

    partialReflowLayer.style.width = `${snapshotShell.clientWidth}px`;
    partialReflowLayer.style.height = `${Math.max(
      snapshotShell.scrollHeight,
      obstacleRect.bottom + 400
    )}px`;

    affectedParagraphs.forEach((paragraph) => {
      paragraph.classList.add("pretext-reflow-hidden");
    });

    let y = topEdge;

    affectedParagraphs.forEach((paragraph) => {
      y = renderParagraphAsWords(
        paragraph,
        y,
        leftEdge,
        rightEdge,
        obstacleRect,
        textStyle
      );
    });
  }

  function makeFigureAbsoluteForDrag(figure) {
    if (figure.__pretextIsAbsolute) return;

    const rect = getShellRelativeRect(figure);
    const computed = window.getComputedStyle(figure);

    const placeholder = document.createElement("div");
    placeholder.className = "pretext-drag-placeholder";

    placeholder.style.width = `${rect.width}px`;
    placeholder.style.height = `${rect.height}px`;
    placeholder.style.float = computed.float;
    placeholder.style.clear = computed.clear;
    placeholder.style.margin = computed.margin;
    placeholder.style.padding = computed.padding;
    placeholder.style.border = computed.border;
    placeholder.style.boxSizing = computed.boxSizing;

    figure.parentNode.insertBefore(placeholder, figure);

    figure.__pretextPlaceholder = placeholder;
    figure.__pretextIsAbsolute = true;
    figure.__pretextTranslateX = rect.left;
    figure.__pretextTranslateY = rect.top;

    figure.style.width = `${rect.width}px`;
    figure.style.height = `${rect.height}px`;
    figure.style.left = `${rect.left}px`;
    figure.style.top = `${rect.top}px`;
    figure.style.transform = "none";

    figure.classList.add("pretext-absolute-dragging");

    snapshotShell.appendChild(figure);
  }

  function applyFigureTransform(figure) {
    const translateX = figure.__pretextTranslateX || 0;
    const translateY = figure.__pretextTranslateY || 0;

    if (figure.__pretextIsAbsolute) {
      figure.style.left = `${translateX}px`;
      figure.style.top = `${translateY}px`;
      figure.style.transform = "none";
      return;
    }

    figure.style.transform = `translate(${translateX}px, ${translateY}px)`;
  }

  function setupDraggableFigures() {
    const draggableFigures = Array.from(
      snapshotShell.querySelectorAll(draggableSelector)
    );

    draggableFigures.forEach((figure) => {
      figure.classList.add("pretext-active-draggable");

      figure.__pretextTranslateX = 0;
      figure.__pretextTranslateY = 0;

      function handlePointerDown(event) {
        if (!pretextMode) return;

        makeFigureAbsoluteForDrag(figure);

        activeDrag = {
          figure,
          startClientX: event.clientX,
          startClientY: event.clientY,
          startTranslateX: figure.__pretextTranslateX || 0,
          startTranslateY: figure.__pretextTranslateY || 0
        };

        figure.classList.add("is-dragging");
        figure.setPointerCapture(event.pointerId);

        renderPartialReflow(figure);

        event.preventDefault();
      }

      function handlePointerMove(event) {
        if (!activeDrag || activeDrag.figure !== figure) return;

        figure.__pretextTranslateX =
          activeDrag.startTranslateX + event.clientX - activeDrag.startClientX;

        figure.__pretextTranslateY =
          activeDrag.startTranslateY + event.clientY - activeDrag.startClientY;

        applyFigureTransform(figure);
        renderPartialReflow(figure);
      }

      function handlePointerUp() {
        if (!activeDrag || activeDrag.figure !== figure) return;

        figure.classList.remove("is-dragging");
        activeDrag = null;
      }

      figure.addEventListener("pointerdown", handlePointerDown);
      figure.addEventListener("pointermove", handlePointerMove);
      figure.addEventListener("pointerup", handlePointerUp);
      figure.addEventListener("pointercancel", handlePointerUp);

      cleanupDragHandlers.push(() => {
        figure.removeEventListener("pointerdown", handlePointerDown);
        figure.removeEventListener("pointermove", handlePointerMove);
        figure.removeEventListener("pointerup", handlePointerUp);
        figure.removeEventListener("pointercancel", handlePointerUp);
      });
    });
  }

  function openPretextMode() {
    pretextMode = true;
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    resetSnapshot();

    const { clone, articleRect } = cloneNativeArticle();

    applySnapshotColumn(articleRect);
    snapshotShell.appendChild(clone);
    snapshotShell.appendChild(partialReflowLayer);
    setupDraggableFigures();

    root.classList.add("pretext-mode-on");

    requestAnimationFrame(() => {
      closeButton.focus();
    });
  }

  function closePretextMode() {
    pretextMode = false;
    root.classList.remove("pretext-mode-on");
    document.body.style.overflow = previousBodyOverflow;

    clearPartialReflow();
    resetSnapshot();

    openButton.focus();
  }

  function handleKeyDown(event) {
    if (event.key === "Escape" && pretextMode) {
      closePretextMode();
    }
  }

  openButton.addEventListener("click", openPretextMode);
  closeButton.addEventListener("click", closePretextMode);
  window.addEventListener("keydown", handleKeyDown);

  return () => {
    openButton.removeEventListener("click", openPretextMode);
    closeButton.removeEventListener("click", closePretextMode);
    window.removeEventListener("keydown", handleKeyDown);

    root.classList.remove("pretext-mode-on");
    document.body.style.overflow = previousBodyOverflow;

    clearPartialReflow();
    resetSnapshot();
  };
}

export default { render };