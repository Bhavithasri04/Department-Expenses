import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = createRoot(document.getElementById('root')); // Use createRoot here
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);