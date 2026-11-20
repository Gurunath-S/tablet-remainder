import React, { useState, useEffect } from 'react';
import { ROUTINES } from '../constants/presets';

export default function TabletModal({
  isOpen,
  onClose,
  onSave,
  initialData
}) {
  const [name, setName] = useState('');
  const [doseTaken, setDoseTaken] = useState(180);
  const [dailyNeed, setDailyNeed] = useState(15);
  const [unit, setUnit] = useState('mg');
  const [routine, setRoutine] = useState('before_bed');
  const [customTime, setCustomTime] = useState('22:00');
  const [notes, setNotes] = useState('');
  const [startDateStr, setStartDateStr] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDoseTaken(initialData.doseTaken || 180);
      setDailyNeed(initialData.dailyNeed || 15);
      setUnit(initialData.unit || 'mg');
      setRoutine(initialData.routine || 'before_bed');
      setCustomTime(initialData.routineTime || '22:00');
      setNotes(initialData.notes || '');
      
      const d = initialData.lastTakenAt ? new Date(initialData.lastTakenAt) : new Date();
      const pad = n => String(n).padStart(2, '0');
      setStartDateStr(`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`);
    } else {
      setName('');
      setDoseTaken(180);
      setDailyNeed(15);
      setUnit('mg');
      setRoutine('before_bed');
      setCustomTime('22:00');
      setNotes('');

      const now = new Date();
      const pad = n => String(n).padStart(2, '0');
      setStartDateStr(`${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const days = dailyNeed > 0 && doseTaken > 0 ? doseTaken / dailyNeed : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || doseTaken <= 0 || dailyNeed <= 0) {
      alert('Please fill out tablet name and valid dosage numbers.');
      return;
    }

    onSave({
      id: initialData?.id,
      name: name.trim(),
      doseTaken: Number(doseTaken),
      dailyNeed: Number(dailyNeed),
      unit,
      routine,
      routineTime: customTime,
      intervalDays: days,
      notes: notes.trim(),
      startDate: startDateStr ? new Date(startDateStr) : new Date()
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{initialData ? 'Edit Supplement Settings' : 'Add Supplement or Tablet'}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="modalTabletName">Tablet Name</label>
            <input
              id="modalTabletName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vitamin E (Evion), Vitamin D3"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="modalDoseTaken">Dose Taken in One Pill</label>
              <div className="input-with-unit">
                <input
                  id="modalDoseTaken"
                  type="number"
                  value={doseTaken}
                  min="0.01"
                  step="any"
                  onChange={(e) => setDoseTaken(e.target.value)}
                  required
                />
                <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                  <option value="mg">mg</option>
                  <option value="IU">IU</option>
                  <option value="mcg">mcg</option>
                  <option value="g">grams</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="modalDailyNeed">Daily Recommended (RDA)</label>
              <div className="input-with-unit">
                <input
                  id="modalDailyNeed"
                  type="number"
                  value={dailyNeed}
                  min="0.01"
                  step="any"
                  onChange={(e) => setDailyNeed(e.target.value)}
                  required
                />
                <span className="static-unit">{unit}/day</span>
              </div>
            </div>
          </div>

          {/* Live Interval Preview Box */}
          <div className="form-preview-alert">
            <div>
              <span style={{ fontSize: '0.78rem' }}>Auto-Calculated Interval: </span>
              <strong>{days >= 1 ? days.toFixed(1) : days.toFixed(2)} Days</strong>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                1 dose covers body requirements for {days.toFixed(1)} days ({Math.round(days * 24)} hours).
              </div>
            </div>
          </div>

          {/* Routine Options */}
          <div className="form-group">
            <label className="block-label">Reminder Timing Preference</label>
            <div className="routine-select-grid">
              {Object.values(ROUTINES).map((r) => (
                <label
                  key={r.id}
                  className={`routine-card ${routine === r.id ? 'selected' : ''}`}
                  onClick={() => {
                    setRoutine(r.id);
                    setCustomTime(r.time);
                  }}
                >
                  <div className="routine-content">
                    <span className="r-icon">{r.icon}</span>
                    <span className="r-title">{r.label}</span>
                    <span className="r-time">{r.timeLabel}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="modalAlarmTime">Exact Alarm Time</label>
              <input
                id="modalAlarmTime"
                type="time"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="modalStartDate">First Dose Taken Date & Time</label>
              <input
                id="modalStartDate"
                type="datetime-local"
                value={startDateStr}
                onChange={(e) => setStartDateStr(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="modalNotes">Notes or Instructions (Optional)</label>
            <input
              id="modalNotes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Take with water after high-fat dinner"
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save & Start Alarm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
