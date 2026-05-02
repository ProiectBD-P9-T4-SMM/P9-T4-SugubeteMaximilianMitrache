import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.jsx';
import SystemDiagramsPage from './SystemDiagramsPage.jsx';
import SuguDiagramsPage from './SuguDiagramsPage.jsx';
import GlobalErrorBoundary from './components/ErrorBoundary.jsx';
import './index.css';

import { HashRouter, Routes, Route } from 'react-router-dom';

function MainRouter() {
  return (
    <Routes>
      <Route path="/system-diagrams" element={<SystemDiagramsPage />} />
      <Route path="/sugu-diagrams" element={<SuguDiagramsPage />} />
      <Route path="/*" element={<App />} />
    </Routes>
  );
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
