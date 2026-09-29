import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Apply the saved UI mode before React paints to avoid a dark flash on startup.
document.documentElement.classList.toggle(
  'bb-light',
  localStorage.getItem('button-builder-ui-color-mode') === 'light',
);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
