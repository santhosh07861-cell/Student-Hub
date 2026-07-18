import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { getProfile, updateProfile } from '../services/profileService';
import { signOut } from '../services/auth';
import { supabase } from '../services/supabase';
import ProfileCard from '../components/ProfileCard';
import AuthProfile from '../components/AuthProfile';
import './Profile.css';

export default function Profile() {
  const { user, authLoading, authError, setAuthError } = useContext(AppContext);
  const navigate = useNavigate();

  // Profile data state
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [bio, setBio] = useState('');

  // Modals state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Auth interface states
  const [authView, setAuthView] = useState('menu'); // 'menu', 'login', 'register', 'forgot'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authResetEmail, setAuthResetEmail] = useState('');
  const [authFormLoading, setAuthFormLoading] = useState(false);
  const [authFormSuccess, setAuthFormSuccess] = useState('');
  const [authFormError, setAuthFormError] = useState('');

  // Handle email signup (Create Account)
  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    if (authPassword !== authConfirmPassword) {
      setAuthFormError("Passwords do not match.");
      return;
    }
    if (authPassword.length < 6) {
      setAuthFormError("Password should be at least 6 characters.");
      return;
    }

    try {
      setAuthFormLoading(true);
      setAuthFormError('');
      setAuthFormSuccess('');

      const { data, error } = await supabase.auth.signUp({
        email: authEmail,
        password: authPassword,
        options: {
          data: {
            full_name: authFullName
          }
        }
      });

      if (error) throw error;

      setAuthFormSuccess("Registration successful! Check your email for verification.");
      setAuthEmail('');
      setAuthPassword('');
      setAuthConfirmPassword('');
      setAuthFullName('');
      setTimeout(() => {
        setAuthView('login');
        setAuthFormSuccess('');
      }, 4000);
    } catch (err) {
      setAuthFormError(err.message || 'Registration failed.');
    } finally {
      setAuthFormLoading(false);
    }
  };

  // Handle email/password login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      setAuthFormLoading(true);
      setAuthFormError('');
      setAuthFormSuccess('');

      const { error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword
      });

      if (error) throw error;

      setAuthFormSuccess("Logged in successfully!");
      setAuthEmail('');
      setAuthPassword('');
    } catch (err) {
      setAuthFormError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setAuthFormLoading(false);
    }
  };

  // Handle forgot password flow (sending reset email)
  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    try {
      setAuthFormLoading(true);
      setAuthFormError('');
      setAuthFormSuccess('');

      const { error } = await supabase.auth.resetPasswordForEmail(authResetEmail, {
        redirectTo: window.location.origin + '/#/profile'
      });

      if (error) throw error;

      setAuthFormSuccess(`Reset link sent successfully to ${authResetEmail}!`);
      setAuthResetEmail('');
    } catch (err) {
      setAuthFormError(err.message || 'Failed to send reset link.');
    } finally {
      setAuthFormLoading(false);
    }
  };

  // Keep Google login action functional
  const handleGoogleLogin = async () => {
    try {
      setAuthFormLoading(true);
      setAuthFormError('');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + window.location.pathname
        }
      });
      if (error) throw error;
    } catch (err) {
      setAuthFormError(err.message || 'Google authentication failed.');
      setAuthFormLoading(false);
    }
  };

  // Load profile data on load
  useEffect(() => {
    if (user) {
      setLoading(true);
      getProfile(user.id)
        .then(data => {
          if (data) {
            setProfile(data);
            setFullName(data.full_name || user.user_metadata?.full_name || user.user_metadata?.name || '');
            setPhone(data.phone || '');
            setCollege(data.college || '');
            setBranch(data.branch || '');
            setYear(data.year || '');
            setBio(data.bio || '');
          } else {
            // Default initialization with Google info
            setFullName(user.user_metadata?.full_name || user.user_metadata?.name || '');
          }
        })
        .catch(err => {
          console.error(err);
          setErrorMsg('Failed to load profile. Using local version.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      setActionLoading(true);
      setErrorMsg('');
      setSuccessMsg('');

      const updated = await updateProfile(user.id, {
        full_name: fullName,
        email: user.email,
        phone,
        college,
        branch,
        year,
        bio,
        profile_photo: user.user_metadata?.avatar_url || user.user_metadata?.picture || ''
      });

      setProfile(updated);
      setIsEditing(false);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save changes.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setCollege(profile.college || '');
      setBranch(profile.branch || '');
      setYear(profile.year || '');
      setBio(profile.bio || '');
    }
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      setActionLoading(true);
      await signOut();
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Logout failed.');
    } finally {
      setActionLoading(false);
    }
  };

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

  const handleForgotPassword = async () => {
    if (!user?.email) return;

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

  if (authLoading || loading) {
    return (
      <div className="profile-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <div className="auth-spinner" style={{ width: '40px', height: '40px', borderWidth: '3px', color: 'var(--primary)' }}></div>
      </div>
    );
  }

  // Render unauthenticated page if user is not logged in
  if (!user) {
    return (
      <div className="profile-page">
        <div className="card unauth-card">
          {authFormSuccess && (
            <div className="alert-banner alert-success" style={{ width: '100%', boxSizing: 'border-box' }}>
              <span>✓ {authFormSuccess}</span>
            </div>
          )}
          {authFormError && (
            <div className="alert-banner alert-error" style={{ width: '100%', boxSizing: 'border-box' }}>
              <span>✗ {authFormError}</span>
            </div>
          )}

          {authView === 'menu' && (
            <>
              <div className="unauth-icon-wrapper">👤</div>
              <h2 className="unauth-title">Welcome to Student Hub</h2>
              <p className="unauth-desc">
                Access your customized roadmap, resume builder, AI career coach, scholarships, and internship postings.
              </p>
              
              <div className="auth-options-list">
                <button className="google-btn" onClick={handleGoogleLogin} disabled={authFormLoading} style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button className="btn btn-secondary" onClick={() => setAuthView('login')} disabled={authFormLoading}>
                  ✉️ Continue with Email
                </button>

                <div className="auth-separator">or</div>

                <button className="btn btn-primary" onClick={() => setAuthView('register')} disabled={authFormLoading}>
                  Create Account
                </button>
              </div>

              <div className="auth-footer-links">
                <button className="auth-footer-link" onClick={() => setAuthView('forgot')}>Forgot Password?</button>
                <a href="#" className="auth-footer-link" onClick={(e) => { e.preventDefault(); alert("Help Center is currently offline. Support email: support@studenthub.com"); }}>
                  Help Center
                </a>
              </div>
            </>
          )}

          {authView === 'login' && (
            <>
              <button className="auth-back-btn" onClick={() => { setAuthView('menu'); setAuthFormError(''); }}>
                ← Back
              </button>
              <h2 className="unauth-title" style={{ textAlign: 'left', marginBottom: '20px' }}>Login to Account</h2>
              <form className="auth-form" onSubmit={handleEmailLogin}>
                <div className="form-group">
                  <label className="form-label" htmlFor="auth-login-email">Email Address</label>
                  <input
                    id="auth-login-email"
                    type="email"
                    className="form-input"
                    placeholder="name@college.edu"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    required
                    disabled={authFormLoading}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="auth-login-password">Password</label>
                  <input
                    id="auth-login-password"
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    required
                    disabled={authFormLoading}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={authFormLoading}>
                  {authFormLoading ? <div className="auth-spinner"></div> : 'Login'}
                </button>
              </form>
              <div className="auth-form-footer">
                Don't have an account? 
                <button className="auth-form-footer-link" onClick={() => { setAuthView('register'); setAuthFormError(''); }}>
                  Create Account
                </button>
              </div>
            </>
          )}

          {authView === 'register' && (
            <>
              <button className="auth-back-btn" onClick={() => { setAuthView('menu'); setAuthFormError(''); }}>
                ← Back
              </button>
              <h2 className="unauth-title" style={{ textAlign: 'left', marginBottom: '20px' }}>Create Student Profile</h2>
              <form className="auth-form" onSubmit={handleEmailSignUp}>
                <div className="form-group">
                  <label className="form-label" htmlFor="auth-register-name">Full Name</label>
                  <input
                    id="auth-register-name"
                    type="text"
                    className="form-input"
                    placeholder="Alex Johnson"
                    value={authFullName}
                    onChange={(e) => setAuthFullName(e.target.value)}
                    required
                    disabled={authFormLoading}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="auth-register-email">Email Address</label>
                  <input
                    id="auth-register-email"
                    type="email"
                    className="form-input"
                    placeholder="alex@college.edu"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    required
                    disabled={authFormLoading}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="auth-register-password">Password (min. 6 characters)</label>
                  <input
                    id="auth-register-password"
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    required
                    disabled={authFormLoading}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="auth-register-confpassword">Confirm Password</label>
                  <input
                    id="auth-register-confpassword"
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={authConfirmPassword}
                    onChange={(e) => setAuthConfirmPassword(e.target.value)}
                    required
                    disabled={authFormLoading}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={authFormLoading}>
                  {authFormLoading ? <div className="auth-spinner"></div> : 'Create Account'}
                </button>
              </form>
              <div className="auth-form-footer">
                Already have an account? 
                <button className="auth-form-footer-link" onClick={() => { setAuthView('login'); setAuthFormError(''); }}>
                  Login
                </button>
              </div>
            </>
          )}

          {authView === 'forgot' && (
            <>
              <button className="auth-back-btn" onClick={() => { setAuthView('menu'); setAuthFormError(''); }}>
                ← Back
              </button>
              <h2 className="unauth-title" style={{ textAlign: 'left', marginBottom: '20px' }}>Reset Password</h2>
              <form className="auth-form" onSubmit={handleSendResetEmail}>
                <div className="form-group">
                  <label className="form-label" htmlFor="auth-forgot-email">Account Email Address</label>
                  <input
                    id="auth-forgot-email"
                    type="email"
                    className="form-input"
                    placeholder="alex@college.edu"
                    value={authResetEmail}
                    onChange={(e) => setAuthResetEmail(e.target.value)}
                    required
                    disabled={authFormLoading}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={authFormLoading}>
                  {authFormLoading ? <div className="auth-spinner"></div> : 'Send Reset Link'}
                </button>
              </form>
              <div className="auth-form-footer">
                Remember your password? 
                <button className="auth-form-footer-link" onClick={() => { setAuthView('login'); setAuthFormError(''); }}>
                  Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="section-header">
        <h1 className="section-title">My Profile</h1>
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

      <div className="profile-grid">
        {/* Left Column: ProfileCard */}
        <div className="profile-sidebar-col">
          <ProfileCard user={user} profile={profile || { full_name: fullName, college, branch, year, phone, bio }} />
        </div>

        {/* Right Column: Editable form fields & actions */}
        <div className="card profile-form-card">
          <div className="profile-form-header">
            <h2 className="profile-form-title">Profile Details</h2>
            {!isEditing && (
              <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSaveChanges}>
            <div className="profile-form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="profile-fullname">Full Name</label>
                <input
                  id="profile-fullname"
                  type="text"
                  className="form-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-email">Email Address (Read-only)</label>
                <input
                  id="profile-email"
                  type="email"
                  className="form-input"
                  value={user.email}
                  disabled
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-phone">Phone Number</label>
                <input
                  id="profile-phone"
                  type="tel"
                  className="form-input"
                  placeholder="e.g. +1 123 456 7890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-college">College Name</label>
                <input
                  id="profile-college"
                  type="text"
                  className="form-input"
                  placeholder="Enter your college"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-branch">Branch</label>
                <input
                  id="profile-branch"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Computer Science"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-year">Year of Study</label>
                <select
                  id="profile-year"
                  className="form-input"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  disabled={!isEditing}
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>

              <div className="form-group profile-form-grid-full">
                <label className="form-label" htmlFor="profile-bio">About Me</label>
                <textarea
                  id="profile-bio"
                  className="form-input"
                  placeholder="Tell us about yourself..."
                  rows="4"
                  style={{ resize: 'vertical', fontFamily: 'inherit' }}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {isEditing ? (
              <div className="modal-actions" style={{ marginBottom: '24px' }}>
                <button type="button" className="btn btn-glass" onClick={handleCancelEdit} disabled={actionLoading}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                  {actionLoading ? <div className="auth-spinner"></div> : 'Save Changes'}
                </button>
              </div>
            ) : null}
          </form>

          {/* Account Actions Section */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <h3 className="profile-form-title" style={{ marginBottom: '16px', fontSize: '1.05rem' }}>Security & Account</h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn btn-glass btn-sm" onClick={() => setShowPasswordModal(true)}>
                🔑 Change Password
              </button>
              <button className="btn btn-glass btn-sm" onClick={() => setShowForgotModal(true)}>
                ✉️ Forgot Password?
              </button>
              <button className="btn btn-secondary btn-sm" style={{ color: 'var(--danger)', borderColor: 'var(--danger-light)', background: 'var(--danger-light)' }} onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
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
                  <label className="form-label" htmlFor="modal-newpass">New Password</label>
                  <input
                    id="modal-newpass"
                    type="password"
                    className="form-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="modal-confpass">Confirm New Password</label>
                  <input
                    id="modal-confpass"
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
                Are you sure you want to send a password reset email to <strong>{user.email}</strong>?
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
