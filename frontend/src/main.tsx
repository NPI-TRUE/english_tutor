import React from 'react';
import ReactDOM from 'react-dom/client';
import AuthWrapper from './AuthWrapper.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthWrapper />
  </React.StrictMode>,
);
