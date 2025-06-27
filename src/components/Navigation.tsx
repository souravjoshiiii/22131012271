import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-container">
          <Link to="/" className="nav-brand">
            URL Shortener
          </Link>
          
          <ul className="nav-links">
            <li>
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
              >
                Shorten URL
              </Link>
            </li>
            <li>
              <Link 
                to="/statistics" 
                className={`nav-link ${isActive('/statistics') ? 'active' : ''}`}
              >
                Statistics
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 