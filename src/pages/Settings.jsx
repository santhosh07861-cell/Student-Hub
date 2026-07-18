import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { SettingsPanel, SettingsRow } from '../components/SettingsPanel';
import { supabase } from '../services/supabase';
import './Settings.css';

export default function Settings() {
  const { theme, setTheme, user } = useContext(AppContext);

  // Appearance State
  const [themeSetting, setThemeSetting] = useState(() => {
    return localStorage.getItem('student_hub_theme_setting') || 'system';
  });

  // Notification States
  const [notifScholarships, setNotifScholarships] = useState(() => {
    const saved = localStorage.getItem('notif_scholarships');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [notifInternships, setNotifInternships] = useState(() => {
    const saved = localStorage.getItem('notif_internships');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [notifCourses, setNotifCourses] = useState(() => {
    const saved = localStorage.getItem('notif_courses');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [notifAI, setNotifAI] = useState(() => {
    const saved = localStorage.getItem('notif_ai');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [notifEmail, setNotifEmail] = useState(() => {
    const saved = localStorage.getItem('notif_email');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Privacy States
  const [profileVisibility, setProfileVisibility] = useState(() => {
    const saved = localStorage.getItem('privacy_profile_visibility');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [emailVisibility, setEmailVisibility] = useState(() => {
    const saved = localStorage.getItem('privacy_email_visibility');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Language State
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('app_language') || 'en';
  });

  // Loading/Banner States
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modals state (Security)
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Persist settings changes
  useEffect(() => {
    localStorage.setItem('notif_scholarships', JSON.stringify(notifScholarships));
  }, [notifScholarships]);

  useEffect(() => {
    localStorage.setItem('notif_internships', JSON.stringify(notifInternships));
  }, [notifInternships]);

  useEffect(() => {
    localStorage.setItem('notif_courses', JSON.stringify(notifCourses));
  }, [notifCourses]);

  useEffect(() => {
    localStorage.setItem('notif_ai', JSON.stringify(notifAI));
  }, [notifAI]);

  useEffect(() => {
    localStorage.setItem('notif_email', JSON.stringify(notifEmail));
  }, [notifEmail]);

  useEffect(() => {
    localStorage.setItem('privacy_profile_visibility', JSON.stringify(profileVisibility));
  }, [profileVisibility]);

  useEffect(() => {
    localStorage.setItem('privacy_email_visibility', JSON.stringify(emailVisibility));
  }, [emailVisibility]);

  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  // Sync theme setting
  const handleThemeChange = (e) => {
    const mode = e.target.value;
    setThemeSetting(mode);
    localStorage.setItem('student_hub_theme_setting', mode);

    if (mode === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemDark ? 'dark' : 'light');
    } else {
      setTheme(mode);
    }
  };

  // Sync with System theme preferences
  useEffect(() => {
    if (themeSetting !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    // Apply initially
    setTheme(mediaQuery.matches ? 'dark' : 'light');

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [themeSetting, setTheme]);

  // Change Password Handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }

    try {
      setActionLoading(true);
      setErrorMsg('');
      setSuccessMsg('');
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setShowPasswordModal(false);
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMsg('Password changed successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to change password.');
    } finally {
      setActionLoading(false);
    }
  };

  // Forgot Password Handler
  const handleForgotPassword = async () => {
    if (!user?.email) {
      setErrorMsg('You must be signed in to request a password reset.');
      return;
    }

    try {
      setActionLoading(true);
      setErrorMsg('');
      setSuccessMsg('');
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: window.location.origin + '/#/profile'
      });
      if (error) throw error;

      setShowForgotModal(false);
      setSuccessMsg(`Password reset email sent to ${user.email}.`);
      setTimeout(() => setSuccessMsg(''), 6000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send reset email.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="section-header">
        <h1 className="section-title">Settings</h1>
      </div>

      {successMsg && (
        <div className="alert-banner alert-success">
          <span>✓ {successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="alert-banner alert-error">
          <span>✗ {errorMsg}</span>
        </div>
      )}

      <div className="settings-grid">
        {/* Category: Appearance */}
        <SettingsPanel
          title="Appearance"
          icon={
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          }
        >
          <SettingsRow label="App Theme" description="Choose between Light mode, Dark mode, or your default System preferences.">
            <select className="settings-select" value={themeSetting} onChange={handleThemeChange}>
              <option value="light">☀️ Light Theme</option>
              <option value="dark">🌙 Dark Theme</option>
              <option value="system">⚙️ System Theme</option>
            </select>
          </SettingsRow>
        </SettingsPanel>

        {/* Category: Notifications */}
        <SettingsPanel
          title="Notifications"
          icon={
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          }
        >
          <SettingsRow label="Scholarship Notifications" description="Receive alerts when new matching scholarships are published.">
            <label className="switch">
              <input type="checkbox" checked={notifScholarships} onChange={(e) => setNotifScholarships(e.target.checked)} />
              <span className="slider"></span>
            </label>
          </SettingsRow>

          <SettingsRow label="Internship Alerts" description="Get notified about fresh internship postings and application deadlines.">
            <label className="switch">
              <input type="checkbox" checked={notifInternships} onChange={(e) => setNotifInternships(e.target.checked)} />
              <span className="slider"></span>
            </label>
          </SettingsRow>

          <SettingsRow label="Course Recommendations" description="Weekly suggestions for free, high-yield professional development courses.">
            <label className="switch">
              <input type="checkbox" checked={notifCourses} onChange={(e) => setNotifCourses(e.target.checked)} />
              <span className="slider"></span>
            </label>
          </SettingsRow>

          <SettingsRow label="AI Assistant Notifications" description="Updates, messages, and insights from the AI Career Assistant.">
            <label className="switch">
              <input type="checkbox" checked={notifAI} onChange={(e) => setNotifAI(e.target.checked)} />
              <span className="slider"></span>
            </label>
          </SettingsRow>

          <SettingsRow label="Email Summaries" description="Receive monthly newsletters and consolidated updates in your inbox.">
            <label className="switch">
              <input type="checkbox" checked={notifEmail} onChange={(e) => setNotifEmail(e.target.checked)} />
              <span className="slider"></span>
            </label>
          </SettingsRow>
        </SettingsPanel>

        {/* Category: Privacy */}
        <SettingsPanel
          title="Privacy"
          icon={
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          }
        >
          <SettingsRow label="Public Profile Visibility" description="Let other Student Hub users view your achievements, college name, and bio.">
            <label className="switch">
              <input type="checkbox" checked={profileVisibility} onChange={(e) => setProfileVisibility(e.target.checked)} />
              <span className="slider"></span>
            </label>
          </SettingsRow>

          <SettingsRow label="Show Email on Profile" description="Expose your registered email address to potential peer collaborators.">
            <label className="switch">
              <input type="checkbox" checked={emailVisibility} onChange={(e) => setEmailVisibility(e.target.checked)} />
              <span className="slider"></span>
            </label>
          </SettingsRow>
        </SettingsPanel>

        {/* Category: Language */}
        <SettingsPanel
          title="Language"
          icon={
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          }
        >
          <SettingsRow label="Preferred Language" description="Select the display language for headers, pages, and menus.">
            <select className="settings-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="en">English (US)</option>
              <option value="te">తెలుగు (Telugu - Placeholder)</option>
              <option value="hi">हिन्दी (Hindi - Placeholder)</option>
            </select>
          </SettingsRow>
        </SettingsPanel>

        {/* Category: Security */}
        <SettingsPanel
          title="Security"
          icon={
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          }
        >
          {user ? (
            <>
              <SettingsRow label="Modify Password" description="Update your security password linked to this session.">
                <button className="settings-link-btn" onClick={() => setShowPasswordModal(true)}>
                  Change Password
                </button>
              </SettingsRow>
              <SettingsRow label="Request Password Reset" description="Sends a secure link to your email to perform a password reset.">
                <button className="settings-link-btn" onClick={() => setShowForgotModal(true)}>
                  Forgot Password
                </button>
              </SettingsRow>
            </>
          ) : (
            <SettingsRow label="Authentication Required" description="Sign in using Google/Supabase in the Profile page to access security options.">
              <span className="settings-info-text" style={{ color: 'var(--text-muted)' }}>Locked</span>
            </SettingsRow>
          )}
        </SettingsPanel>

        {/* Category: Support */}
        <SettingsPanel
          title="Support"
          icon={
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
          }
        >
          <div className="settings-support-list">
            <a href="#" className="settings-support-item" onClick={(e) => { e.preventDefault(); alert("Help Center is currently offline. Please check back later."); }}>
              <div className="settings-support-label">
                <span className="settings-support-icon">📖</span>
                <span>Help Center & Knowledge Base</span>
              </div>
              <span className="settings-arrow">→</span>
            </a>

            <a href="mailto:support@studenthub.com" className="settings-support-item">
              <div className="settings-support-label">
                <span className="settings-support-icon">💬</span>
                <span>Contact Student Hub Support</span>
              </div>
              <span className="settings-arrow">→</span>
            </a>

            <a href="#" className="settings-support-item" onClick={(e) => { e.preventDefault(); alert("Bug reporting feature submitted. Thank you!"); }}>
              <div className="settings-support-label">
                <span className="settings-support-icon">🐛</span>
                <span>Report a Bug</span>
              </div>
              <span className="settings-arrow">→</span>
            </a>
          </div>
        </SettingsPanel>

        {/* Category: Information */}
        <SettingsPanel
          title="Information"
          icon={
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          }
        >
          <div className="settings-info-grid" style={{ width: '100%' }}>
            <div className="settings-info-card">
              <span className="settings-info-label">Application</span>
              <span className="settings-info-value">Student Hub</span>
            </div>

            <div className="settings-info-card">
              <span className="settings-info-label">Version</span>
              <span className="settings-info-value">v1.1.0</span>
            </div>

            <a href="#" className="settings-info-card" style={{ textDecoration: 'none', display: 'block' }} onClick={(e) => { e.preventDefault(); alert("Privacy Policy details placeholder."); }}>
              <span className="settings-info-label" style={{ color: 'var(--primary)' }}>Legal</span>
              <span className="settings-info-value" style={{ fontSize: '0.9rem' }}>Privacy Policy</span>
            </a>

            <a href="#" className="settings-info-card" style={{ textDecoration: 'none', display: 'block' }} onClick={(e) => { e.preventDefault(); alert("Terms and Conditions details placeholder."); }}>
              <span className="settings-info-label" style={{ color: 'var(--primary)' }}>Agreement</span>
              <span className="settings-info-value" style={{ fontSize: '0.9rem' }}>Terms & Conditions</span>
            </a>
          </div>
        </SettingsPanel>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Change Password</h3>
              <button className="modal-close-btn" onClick={() => setShowPasswordModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleChangePassword}>
              <div className="modal-body">
                <p style={{ marginBottom: '16px' }}>Provide a new secure password for your Student Hub account.</p>
                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label" htmlFor="settings-newpass">New Password</label>
                  <input
                    id="settings-newpass"
                    type="password"
                    className="form-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="settings-confpass">Confirm New Password</label>
                  <input
                    id="settings-confpass"
                    type="password"
                    className="form-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-glass" onClick={() => setShowPasswordModal(false)} disabled={actionLoading}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                  {actionLoading ? <div className="auth-spinner"></div> : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Confirmation Modal */}
      {showForgotModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Forgot Password</h3>
              <button className="modal-close-btn" onClick={() => setShowForgotModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to send a password reset email to <strong>{user?.email}</strong>?
              </p>
              <p style={{ fontSize: '0.825rem', marginTop: '10px', color: 'var(--text-muted)' }}>
                This will trigger an email containing a link to securely change your password.
              </p>
            </div>
            <div className="modal-actions">
              <button className="btn btn-glass" onClick={() => setShowForgotModal(false)} disabled={actionLoading}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleForgotPassword} disabled={actionLoading}>
                {actionLoading ? <div className="auth-spinner"></div> : 'Send Reset Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
