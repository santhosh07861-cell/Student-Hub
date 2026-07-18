import React from 'react';
import './ProfileCard.css';

export default function ProfileCard({ user, profile }) {
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || profile?.profile_photo || '';
  const fullName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || 'Student';
  const email = user?.email || profile?.email || '';

  return (
    <div className="card">
      <div className="profile-card-container">
        <div className="profile-card-photo-wrapper">
          {avatarUrl ? (
            <img src={avatarUrl} alt={fullName} className="profile-card-photo" />
          ) : (
            <div className="profile-card-photo" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--primary)',
              color: '#fff',
              fontSize: '3rem',
              fontWeight: '600'
            }}>
              {fullName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <h3 className="profile-card-name">{fullName}</h3>
        <p className="profile-card-email">{email}</p>

        <div className="profile-card-details">
          {profile?.college && (
            <div className="profile-card-detail-item">
              <span className="profile-card-detail-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
                </svg>
              </span>
              <div className="profile-card-detail-content">
                <span className="profile-card-detail-label">College</span>
                <span className="profile-card-detail-value">{profile.college}</span>
              </div>
            </div>
          )}

          {profile?.branch && (
            <div className="profile-card-detail-item">
              <span className="profile-card-detail-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                  <polyline points="2 17 12 22 22 17"></polyline>
                  <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
              </span>
              <div className="profile-card-detail-content">
                <span className="profile-card-detail-label">Branch</span>
                <span className="profile-card-detail-value">{profile.branch}</span>
              </div>
            </div>
          )}

          {profile?.year && (
            <div className="profile-card-detail-item">
              <span className="profile-card-detail-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </span>
              <div className="profile-card-detail-content">
                <span className="profile-card-detail-label">Year of Study</span>
                <span className="profile-card-detail-value">{profile.year}</span>
              </div>
            </div>
          )}

          {profile?.phone && (
            <div className="profile-card-detail-item">
              <span className="profile-card-detail-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </span>
              <div className="profile-card-detail-content">
                <span className="profile-card-detail-label">Phone</span>
                <span className="profile-card-detail-value">{profile.phone}</span>
              </div>
            </div>
          )}
        </div>

        {profile?.bio && (
          <div className="profile-card-bio-section">
            <h4 className="profile-card-bio-title">About Me</h4>
            <p className="profile-card-bio-text">"{profile.bio}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
