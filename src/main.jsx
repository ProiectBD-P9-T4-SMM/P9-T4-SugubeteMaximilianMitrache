import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.jsx';
import SystemDiagramsPage from './SystemDiagramsPage.jsx';
import GlobalErrorBoundary from './components/ErrorBoundary.jsx';
import './index.css';

import { HashRouter, Routes, Route } from 'react-router-dom';

function MainRouter() {
  return (
    <Routes>
      <Route path="/system-diagrams" element={<SystemDiagramsPage />} />
      <Route path="/*" element={<App />} />
    </Routes>
  );
}

async function start() {
  const boot = document.getElementById('boot');
  try {
    if (import.meta.env.MODE === 'demo') {
      if (boot) boot.style.display = 'flex';
      const { initDemo } = await import('./demo/init.js');
      await initDemo();
    }
  } catch (error) {
    if (boot) {
      boot.style.display = 'flex';
      boot.textContent = 'The in-browser demo database failed to start: ' + error.message;
    }
    throw error;
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      {/* GlobalErrorBoundary must sit OUTSIDE HashRouter so router crashes are also caught */}
      <GlobalErrorBoundary>
        <HashRouter>
          <MainRouter />
        </HashRouter>
      </GlobalErrorBoundary>
    </React.StrictMode>
  );

  if (boot) boot.remove();
}

start();
