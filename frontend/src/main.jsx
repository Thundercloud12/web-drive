// src/main.jsx
import React, { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store.js';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from "./context/ThemeContext";

// ⏳ Remove global loader after DOM is ready
const removeLoader = () => {
  const loader = document.getElementById('global-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500); // Fade out and remove
  }
};

const RootApp = () => {
  useEffect(() => {
    removeLoader();
  }, []);

  return (
    <StrictMode>
      <ThemeProvider>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </ThemeProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')).render(<RootApp />);
