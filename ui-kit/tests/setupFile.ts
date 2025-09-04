import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { mockResizeObserver } from "jsdom-testing-mocks";

mockResizeObserver();

afterEach(() => cleanup());
