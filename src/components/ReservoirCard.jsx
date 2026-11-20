import React from 'react';
import { Check, Edit3, Trash2 } from 'lucide-react';
import { ROUTINES } from '../constants/presets';
import { formatCountdown, formatDateShort } from '../utils/time';

export default function ReservoirCard({
  tablet,
  now,
  onTakeDose,
  onEdit,
  onDelete
}) {
  const dueTime = new Date(tablet.nextDueAt).getTime();
  const totalDuration = tablet.totalDurationMs || (tablet.intervalDays * 24 * 60 * 60 * 1000);
  const msRemaining = Math.max(0, dueTime - now);

  let pctRemaining = (msRemaining / totalDuration) * 100;
  pctRemaining = Math.max(0, Math.min(100, pctRemaining));

  const isDepleted = msRemaining <= 0;
  const isWarning = pctRemaining <= 20 && !isDepleted;

  let statusClass = 'status-active';
  let statusText = 'Active Reservoir';
  let fillClass = '';
  let countdownClass = '';

  if (isDepleted) {
    statusClass = 'status-depleted';
    statusText = 'DUE NOW';
    fillClass = 'depleted';
    countdownClass = 'depleted';
  } else if (isWarning) {
    statusClass = 'status-warning';
    statusText = 'Low Reserve';
    fillClass = 'warning';
    countdownClass = 'warning';
  }

  const routineObj = ROUTINES[tablet.routine] || {
    icon: '⏰',
    label: 'Custom Alarm',
    timeLabel: tablet.routineTime
  };

  return (
    <div className="tablet-card">
      <div className="card-header-row">
        <div className="tablet-info">
          <div className="tablet-icon-box">{tablet.icon || '💊'}</div>
          <div>
            <h4 className="tablet-name">{tablet.name}</h4>
            <div className="tablet-dosage-badge">
              {tablet.doseTaken} {tablet.unit} taken &bull; {tablet.dailyNeed} {tablet.unit}/day RDA
            </div>
          </div>
        </div>
        <span className={`tablet-status-tag ${statusClass}`}>{statusText}</span>
      </div>

      {/* Reservoir Meter */}
      <div className="reservoir-meter-wrapper">
        <div className="meter-meta">
          <span className="meter-label">Body Reservoir Balance</span>
          <span className="meter-pct">{pctRemaining.toFixed(0)}% remaining</span>
        </div>
        <div className="meter-track">
          <div
            className={`meter-fill ${fillClass}`}
            style={{ width: `${pctRemaining.toFixed(1)}%` }}
          />
        </div>
      </div>

      {/* Routine & Live Countdown */}
      <div className="card-schedule-box">
        <div className="schedule-routine">
          <div className="routine-icon-circle">{routineObj.icon}</div>
          <div className="routine-info">
            <span className="routine-title">
              {routineObj.label} ({tablet.routineTime})
            </span>
            <span className="routine-due-date">
              Due: {formatDateShort(tablet.nextDueAt)}
            </span>
          </div>
        </div>

        <div className="countdown-box">
          <span className={`countdown-digits ${countdownClass}`}>
            {formatCountdown(msRemaining)}
          </span>
          <span className="countdown-sub">
            {isDepleted ? 'OVERDUE' : 'UNTIL NEXT DOSE'}
          </span>
        </div>
      </div>

      {/* Card Actions */}
      <div className="card-actions-bar">
        <button
          className="btn-card-take"
          onClick={() => onTakeDose(tablet.id)}
          title="Log intake now and reset interval timer"
        >
          <Check size={14} />
          <span>Take Dose & Refill</span>
        </button>

        <button
          className="btn-card-icon"
          onClick={() => onEdit(tablet)}
          title="Edit tablet"
        >
          <Edit3 size={14} />
        </button>

        <button
          className="btn-card-icon delete"
          onClick={() => onDelete(tablet.id)}
          title="Delete tablet"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
