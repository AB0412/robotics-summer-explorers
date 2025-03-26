
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App.tsx';
import './index.css';

// Add error boundary to prevent the entire app from crashing
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // Don't prevent default to allow the error to be logged in the console
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
