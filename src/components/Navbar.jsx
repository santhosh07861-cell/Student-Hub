import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { SvgIcon } from './SvgIcon';
import AuthProfile from './AuthProfile';
import './Navbar.css';


export default function Navbar({ showSearch = true }) {
  const {
    theme,
    toggleTheme,
    sidebarExpanded,
    setSidebarExpanded,
    sidebarMobileActive,
    setSidebarMobileActive
  } = useContext(AppContext);

  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleToggle = () => {
    const width = window.innerWidth;
    if (width < 768) {
      setSidebarMobileActive(prev => !prev);
      setSidebarExpanded(false);
    } else {
      setSidebarExpanded(prev => !prev);
      setSidebarMobileActive(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const trimmed = query.trim();
      if (trimmed) {
        navigate(`/?search=${encodeURIComponent(trimmed)}`);
      }
    }
  };

  const navClass = sidebarExpanded ? 'sidebar-expanded' : '';

  return (
    <nav id="navbar" className={navClass}>
      <div className="navbar-inner">
        <button className="sidebar-toggle-btn" onClick={handleToggle}>
          <SvgIcon name="menu" />
        </button>

        <div className="search-container-nav" style={{ display: showSearch ? 'flex' : 'none' }}>
          <SvgIcon name="search" />
          <input
            type="text"
            id="global-search-input"
            className="search-input-nav"
            placeholder="Search scholarships, internships, roadmaps..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        <div className="navbar-actions">
          <button className="nav-icon-btn" onClick={toggleTheme} title="Toggle Theme">
            <SvgIcon name={theme === 'dark' ? 'sun' : 'moon'} />
          </button>
          <AuthProfile />
        </div>
      </div>
    </nav>
  );
}
