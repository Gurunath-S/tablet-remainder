import React from 'react';
import { Pill, Smartphone, Monitor, Bell, Plus } from 'lucide-react';

export default function Header({
  isWideMode,
  setIsWideMode,
  notifStatus,
  onRequestNotification,
  onOpenAddModal
}) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-icon-wrapper">
          <Pill className="brand-icon" />
          <span className="pulse-indicator"></span>
        </div>
        <div>
          <h1 className="brand-title">DoseSpan</h1>
          <p className="brand-tagline">Dosage Reservoir & Smart Interval Alarms</p>
        </div>
      </div>

      <div className="header-actions">
        {/* Toggle Phone / Wide Shell */}
        <button
          className="btn-icon"
          onClick={() => setIsWideMode(!isWideMode)}
          title="Toggle phone shell view"
        >
          {isWideMode ? <Smartphone size={16} /> : <Monitor size={16} />}
          <span>{isWideMode ? 'Phone View' : 'Wide View'}</span>
        </button>

        {/* Notification Status */}
        <button
          className="btn-icon"
          onClick={onRequestNotification}
          title="Notification permission"
        >
          <Bell size={16} />
          <span className={`status-badge ${notifStatus === 'granted' ? 'active' : 'prompt'}`}>
            {notifStatus === 'granted' ? 'Alerts Active' : 'Sound Ready'}
          </span>
        </button>

        {/* Add New Tablet */}
        <button className="btn-primary" onClick={onOpenAddModal}>
          <Plus size={18} />
          <span>New Tablet</span>
        </button>
      </div>
    </header>
  );
}
