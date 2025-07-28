// frontend/src/main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Global CSS file
import App from './App.jsx';

// React application ko DOM mein render karein
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
