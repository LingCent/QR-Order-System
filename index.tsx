import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Suppress benign ResizeObserver loop errors
// These are common with virtualization libraries like @tanstack/react-virtual.
const resizeObserverLoopErrRe = /ResizeObserver loop limit exceeded|ResizeObserver loop completed with undelivered notifications/;

// Patch console.error to prevent logging to console
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  if (
    args[0] && 
    typeof args[0] === 'string' && 
    resizeObserverLoopErrRe.test(args[0])
  ) {
    return;
  }
  originalConsoleError.call(console, ...args);
};

// Patch window.onerror to prevent error overlays and uncaught exceptions
window.addEventListener('error', (e) => {
  const msg = e.message || '';
  if (resizeObserverLoopErrRe.test(msg)) {
    e.stopImmediatePropagation();
    e.preventDefault(); // Crucial to stop the error from bubbling up as an uncaught exception
  }
});

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);