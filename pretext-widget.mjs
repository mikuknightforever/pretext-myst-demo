function render({ model, el }) {
  const draggableSelector =
    model.get("draggableSelector") || ".pretext-draggable";

  const articleSelector =
    model.get("articleSelector") || "article, main";

  const fontFamily =
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

  const style = document.createElement("style");
  style.textContent = `
    .pretext-root {
      font-family: ${fontFamily};
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
      cursor: grab !important;
      touch-action: none;
      user-select: none;
      will-change: transform;
      outline: 2px solid rgba(37, 99, 235, 0.35);
      outline-offset: 4px;
      transition: outline-color 120ms ease, box-shadow 120ms ease;
    }

    .pretext-active-draggable:hover {
      outline-color: rgba(37, 99, 235, 0.7);
      box-shadow: 0 18px 42px rgba(37, 99, 235, 0.18);
    }

    .pretext-active-draggable.is-dragging {
      cursor: grabbing !important;
      z-index: 20;
      outline-color: rgba(37, 99, 235, 0.95);
      box-shadow: 0 24px 60px rgba(37, 99, 235, 0.28);
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
    "Open Pretext Mode to clone the native MyST article layout. The marked figure remains visually in place and becomes draggable. Dynamic text reflow will be added in the next stage.";

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
  overlayTitle.textContent = "Pretext Mode: Native Layout Snapshot";

  const overlaySubtitle = document.createElement("div");
  overlaySubtitle.className = "pretext-overlay-subtitle";
  overlaySubtitle.textContent =
    "This mode clones the rendered MyST article and makes marked figures draggable without changing the initial layout.";

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

  snapshotScroll.appendChild(snapshotShell);

  const footerHint = document.createElement("div");
  footerHint.className = "pretext-footer-hint";
  footerHint.textContent =
    "A-stage prototype: native layout snapshot + draggable figure. Press Esc to exit.";

  overlay.appendChild(overlayBar);
  overlay.appendChild(snapshotScroll);
  overlay.appendChild(footerHint);

  root.appendChild(controller);
  root.appendChild(overlay);

  el.innerHTML = "";
  el.appendChild(style);
  el.appendChild(root);

  let pretextMode = false;
  let previousBodyOverflow = "";
  let cleanupDragHandlers = [];

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
    const articleRect = articleRoot.getBoundingClientRect();

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
    snapshotShell.innerHTML = "";
  }

  function setupDraggableFigures() {
    const draggableFigures = Array.from(
      snapshotShell.querySelectorAll(draggableSelector)
    );

    draggableFigures.forEach((figure) => {
      figure.classList.add("pretext-active-draggable");

      let isDragging = false;
      let startClientX = 0;
      let startClientY = 0;
      let startTranslateX = 0;
      let startTranslateY = 0;
      let translateX = 0;
      let translateY = 0;

      function applyTransform() {
        figure.style.transform = `translate(${translateX}px, ${translateY}px)`;
      }

      function handlePointerDown(event) {
        isDragging = true;
        startClientX = event.clientX;
        startClientY = event.clientY;
        startTranslateX = translateX;
        startTranslateY = translateY;

        figure.classList.add("is-dragging");
        figure.setPointerCapture(event.pointerId);

        event.preventDefault();
      }

      function handlePointerMove(event) {
        if (!isDragging) return;

        translateX = startTranslateX + event.clientX - startClientX;
        translateY = startTranslateY + event.clientY - startClientY;

        applyTransform();
      }

      function handlePointerUp() {
        isDragging = false;
        figure.classList.remove("is-dragging");
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
    resetSnapshot();
  };
}

export default { render };