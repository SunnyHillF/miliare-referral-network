import '@testing-library/jest-dom';

// Mock canvas context for Chart.js in testing environment
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => ({}),
});
