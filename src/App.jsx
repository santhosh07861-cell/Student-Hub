import React, { useContext } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, AppContext } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Scholarships from './pages/Scholarships';
import Internships from './pages/Internships';
import Courses from './pages/Courses';
import Roadmaps from './pages/Roadmaps';
import ResumeBuilder from './pages/ResumeBuilder';
import AIAssistant from './pages/AIAssistant';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function MainLayout() {
  const { sidebarExpanded } = useContext(AppContext);
  const mainContentClass = sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed';

  return (
    <div id="app-layout">
      <Sidebar />
      <Navbar />
      <main id="main-content" className={`${mainContentClass} fade-in`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/internships" element={<Internships />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/roadmaps" element={<Roadmaps />} />
          <Route path="/resume" element={<ResumeBuilder />} />
          <Route path="/assistant" element={<AIAssistant />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <MainLayout />
      </Router>
    </AppProvider>
  );
}
