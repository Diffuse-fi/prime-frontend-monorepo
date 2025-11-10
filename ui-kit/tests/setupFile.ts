import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { mockResizeObserver } from "jsdom-testing-mocks";

mockResizeObserver();

afterEach(() => cleanup());

class MockPointerEvent extends MouseEvent {
  pointerId: number;
  constructor(type: string, init?: MouseEventInit & { pointerId?: number }) {
    super(type, init);
    this.pointerId = init?.pointerId ?? 1;
  }
}

Object.defineProperty(window, "PointerEvent", {
  configurable: true,
  writable: true,
  value: MockPointerEvent,
});

function polyfillElementPointerAndScroll() {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {};
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {};
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
}

polyfillElementPointerAndScroll();
