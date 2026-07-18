import React from 'react';
import './SettingsPanel.css';

export function SettingsPanel({ title, icon, children }) {
  return (
    <div className="card settings-section-card">
      <h3 className="settings-section-title">
        {icon && <span style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)' }}>{icon}</span>}
        <span>{title}</span>
      </h3>
      <div className="settings-rows-container">
        {children}
      </div>
    </div>
  );
}

export function SettingsRow({ label, description, children }) {
  return (
    <div className="settings-row">
      <div className="settings-row-info">
        <span className="settings-row-label">{label}</span>
        {description && <span className="settings-row-desc">{description}</span>}
      </div>
      <div className="settings-row-action">
        {children}
      </div>
    </div>
  );
}
