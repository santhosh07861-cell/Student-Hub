import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('student_hub_theme');
      return saved ? JSON.parse(saved) : 'dark';
    } catch {
      return 'dark';
    }
  });

  // Sidebar state
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [sidebarMobileActive, setSidebarMobileActive] = useState(false);

  // Bookmarks state
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('student_hub_bookmarks');
      return saved ? JSON.parse(saved) : { scholarships: [], internships: [], courses: [] };
    } catch {
      return { scholarships: [], internships: [], courses: [] };
    }
  });

  // Sync theme to root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('student_hub_theme', JSON.stringify(theme));
    } catch (e) {
      console.warn("Storage write failed", e);
    }
  }, [theme]);

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('student_hub_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.warn("Storage write failed", e);
    }
  }, [bookmarks]);

  // Toggle theme helper
  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Toggle bookmark helper
  const toggleBookmark = (type, id) => {
    setBookmarks(prev => {
      const currentList = prev[type] || [];
      const updatedList = currentList.includes(id)
        ? currentList.filter(item => item !== id)
        : [...currentList, id];
      return {
        ...prev,
        [type]: updatedList
      };
    });
  };

  // Supabase Auth State
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let active = true;

    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (!active) return;
      if (error) {
        setAuthError(error.message);
        setAuthLoading(false);
        return;
      }
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setAuthLoading(false);
    });

    // Listen to authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!active) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setAuthLoading(false);
    });

    // Handle hash router clean-up if we are returning from Supabase redirect
    const hash = window.location.hash;
    if (hash && (hash.includes('access_token=') || hash.includes('error='))) {
      const timer = setTimeout(() => {
        window.location.hash = '/';
      }, 500);
      return () => {
        active = false;
        subscription.unsubscribe();
        clearTimeout(timer);
      };
    }

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        sidebarExpanded,
        setSidebarExpanded,
        sidebarMobileActive,
        setSidebarMobileActive,
        bookmarks,
        toggleBookmark,
        user,
        session,
        authLoading,
        authError,
        setAuthError
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
