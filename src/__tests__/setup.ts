import "@testing-library/jest-dom";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Assign to global object
Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
});

// Mock window.scrollTo
Object.defineProperty(window, "scrollTo", {
  value: vi.fn(),
  writable: true,
});
