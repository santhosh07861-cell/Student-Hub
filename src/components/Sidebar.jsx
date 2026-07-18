import React, { useContext, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { SvgIcon } from './SvgIcon';
import './Sidebar.css';


const menuItems = [
  { id: 'home', label: 'Home', icon: 'home', link: '/' },
  { id: 'scholarships', label: 'Scholarships', icon: 'scholarship', link: '/scholarships' },
  { id: 'internships', label: 'Internships', icon: 'internship', link: '/internships' },
  { id: 'courses', label: 'Free Courses', icon: 'courses', link: '/courses' },
  { id: 'roadmaps', label: 'Career Roadmaps', icon: 'roadmap', link: '/roadmaps' },
  { id: 'resume', label: 'Resume Builder', icon: 'resume', link: '/resume' },
  { id: 'assistant', label: 'AI Career Assistant', icon: 'assistant', link: '/assistant' },
  { id: 'profile', label: 'Profile', icon: 'profile', link: '/profile' },
  { id: 'settings', label: 'Settings', icon: 'settings', link: '/settings' }
];

export default function Sidebar() {
  const {
    sidebarExpanded,
    setSidebarExpanded,
    sidebarMobileActive,
    setSidebarMobileActive
  } = useContext(AppContext);

  const sidebarRef = useRef(null);

  // Close sidebar on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const width = window.innerWidth;
      if (width < 768) {
        if (
          sidebarRef.current &&
          !sidebarRef.current.contains(e.target) &&
          !e.target.closest('.sidebar-toggle-btn') &&
          sidebarMobileActive
        ) {
          setSidebarMobileActive(false);
        }
      } else if (width <= 1199) {
        if (
          sidebarRef.current &&
          !sidebarRef.current.contains(e.target) &&
          !e.target.closest('.sidebar-toggle-btn') &&
          sidebarExpanded
        ) {
          setSidebarExpanded(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [sidebarExpanded, sidebarMobileActive, setSidebarExpanded, setSidebarMobileActive]);

  const activeSidebarClass = sidebarMobileActive
    ? 'mobile-active'
    : sidebarExpanded
    ? 'expanded'
    : 'collapsed';

  return (
    <>
      {sidebarMobileActive && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarMobileActive(false)}
        />
      )}
      <aside id="sidebar" ref={sidebarRef} className={activeSidebarClass}>
        <div className="logo-container">
          <div className="logo-icon">S</div>
          <span className="logo-text">StudentHub</span>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <NavLink
              key={item.id}
              to={item.link}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarMobileActive(false)}
            >
              <SvgIcon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
