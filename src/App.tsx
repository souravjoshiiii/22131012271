import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Navigation from './components/Navigation';
import UrlShortener from './pages/UrlShortener';
import Statistics from './pages/Statistics';
import RedirectHandler from './components/RedirectHandler';
import { logger } from './utils/logger';

const App: React.FC = () => {
  // Initialize logger
  React.useEffect(() => {
    logger.info('URL Shortener App initialized');
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <div className="app">
          <Navigation />
          
          <main>
            <Routes>
              <Route path="/" element={<UrlShortener />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/:shortCode" element={<RedirectHandler />} />
            </Routes>
          </main>
          
          <footer className="text-center p-4" style={{ 
            backgroundColor: '#f5f5f5', 
            borderTop: '1px solid #e0e0e0',
            marginTop: 'auto'
          }}>
            <p className="body2 text-secondary">
              © 2024 URL Shortener. Built with React and TypeScript.
            </p>
          </footer>
    </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
