import React from 'react';
import { Bell, Check } from 'lucide-react';
import { ROUTINES } from '../constants/presets';

export default function AlarmModal({
  tablet,
  onTakeNow,
  onSnooze
}) {
  if (!tablet) return null;

  const routineObj = ROUTINES[tablet.routine] || { label: 'scheduled routine' };

  return (
    <div className="alarm-alert-overlay">
      <div className="alarm-card">
        <div className="alarm-bell-animation">
          <Bell size={36} />
        </div>
        <span className="alarm-pill-badge">Tablet Reservoir Depleted</span>
        <h2 className="alarm-title">Time for your {tablet.name}!</h2>
        <p className="alarm-instruction">
          Your <strong>{tablet.intervalDays.toFixed(1)}-day</strong> reservoir has depleted.
          Time to take your <strong>{tablet.doseTaken} {tablet.unit}</strong> tablet <strong>{routineObj.label}</strong>!
        </p>

        <div className="alarm-actions">
          <button className="btn-alarm-take" onClick={() => onTakeNow(tablet.id)}>
            <Check size={18} />
            <span>Take Tablet & Reset Reservoir</span>
          </button>

          <div className="alarm-snooze-row">
            <button className="btn-snooze" onClick={() => onSnooze(tablet.id, 10)}>
              Snooze 10m
            </button>
            <button className="btn-snooze" onClick={() => onSnooze(tablet.id, 60)}>
              Snooze 1h
            </button>
            <button className="btn-snooze" onClick={() => onSnooze(tablet.id, 1440)}>
              Remind Tomorrow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
