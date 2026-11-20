import React, { useState } from 'react';
import { BookmarkPlus } from 'lucide-react';
import { PRESETS, ROUTINES } from '../constants/presets';
import { formatDateTime } from '../utils/time';

export default function QuickCalculator({ onAddTabletFromCalc }) {
  const [selectedPresetId, setSelectedPresetId] = useState('vitamin-e');
  const [name, setName] = useState('Vitamin E (Alpha-Tocopherol)');
  const [doseTaken, setDoseTaken] = useState(180);
  const [dailyNeed, setDailyNeed] = useState(15);
  const [unit, setUnit] = useState('mg');
  const [routine, setRoutine] = useState('before_bed');
  const [customTime, setCustomTime] = useState('22:00');

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setName(preset.name);
    setDoseTaken(preset.doseTaken);
    setDailyNeed(preset.dailyNeed);
    setUnit(preset.unit);
    setRoutine(preset.routine);
    setCustomTime(preset.routineTime);
  };

  const days = dailyNeed > 0 && doseTaken > 0 ? doseTaken / dailyNeed : 0;
  const hours = Math.round(days * 24);

  // Compute preview next date
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const [h, m] = customTime.split(':').map(Number);
  futureDate.setHours(h, m, 0, 0);

  const routineObj = ROUTINES[routine] || { label: 'Custom Alarm' };

  const handleStartTracking = () => {
    if (!name || doseTaken <= 0 || dailyNeed <= 0) {
      alert('Please enter valid tablet dosage numbers.');
      return;
    }
    onAddTabletFromCalc({
      name,
      doseTaken: Number(doseTaken),
      dailyNeed: Number(dailyNeed),
      unit,
      routine,
      routineTime: customTime,
      intervalDays: days,
      notes: `Configured via Quick Calculator: ${doseTaken}${unit} / ${dailyNeed}${unit} per day`
    });
  };

  return (
    <div className="calc-card">
      <h3 className="section-title">Instant Dosage Interval Calculator</h3>
      <p className="section-sub">
        Type your tablet strength and daily requirement to see exactly how many days the reservoir lasts.
      </p>

      {/* Preset Pills Bar */}
      <div className="preset-pills-bar">
        <span className="preset-label">Quick Presets:</span>
        <div className="preset-chips">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              className={`preset-chip ${selectedPresetId === p.id ? 'active' : ''}`}
              onClick={() => handleSelectPreset(p)}
            >
              {p.name.split(' (')[0]} ({p.doseTaken}{p.unit} / {p.dailyNeed}{p.unit})
            </button>
          ))}
        </div>
      </div>

      <div className="calc-grid">
        <div className="input-group">
          <label htmlFor="reactCalcName">Tablet / Supplement Name</label>
          <input
            id="reactCalcName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Vitamin E, Vitamin D3"
          />
        </div>

        <div className="input-row">
          <div className="input-group">
            <label htmlFor="reactCalcDose">Dose Taken in One Pill</label>
            <div className="input-with-unit">
              <input
                id="reactCalcDose"
                type="number"
                value={doseTaken}
                min="0.01"
                step="any"
                onChange={(e) => setDoseTaken(e.target.value)}
              />
              <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option value="mg">mg</option>
                <option value="IU">IU</option>
                <option value="mcg">mcg</option>
                <option value="g">grams</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="reactCalcDaily">Daily Requirement (RDA)</label>
            <div className="input-with-unit">
              <input
                id="reactCalcDaily"
                type="number"
                value={dailyNeed}
                min="0.01"
                step="any"
                onChange={(e) => setDailyNeed(e.target.value)}
              />
              <span className="static-unit">{unit}/day</span>
            </div>
          </div>
        </div>

        {/* Routine Timing Preference */}
        <div className="timing-selector-box">
          <label className="block-label">When do you prefer taking this tablet?</label>
          <div className="timing-options-grid">
            {Object.values(ROUTINES).map((r) => (
              <label
                key={r.id}
                className={`timing-option ${routine === r.id ? 'selected' : ''}`}
                onClick={() => {
                  setRoutine(r.id);
                  setCustomTime(r.time);
                }}
              >
                <input
                  type="radio"
                  name="calcRoutineSelect"
                  value={r.id}
                  checked={routine === r.id}
                  readOnly
                />
                <div className="option-card">
                  <span className="option-icon">{r.icon}</span>
                  <div className="option-meta">
                    <span className="option-name">{r.label}</span>
                    <span className="option-time">{r.timeLabel}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="custom-time-row">
            <label htmlFor="reactCustomAlarm">Or specify custom alarm time:</label>
            <input
              id="reactCustomAlarm"
              type="time"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
            />
          </div>
        </div>

        {/* Live Result Box */}
        <div className="calculation-result-box">
          <div className="result-highlight">
            <span className="result-number">
              {days >= 10 ? days.toFixed(1) : days.toFixed(2)}
            </span>
            <span className="result-unit">Days Reservoir</span>
          </div>
          <div className="result-details">
            <p>
              Taking <strong>{doseTaken} {unit}</strong> satisfies your <strong>{dailyNeed} {unit}/day</strong> requirement for <strong>{days.toFixed(1)} days</strong> ({hours} hours).
            </p>
            <p className="next-alarm-preview">
              🔔 Next reminder alarm scheduled for: <strong>{formatDateTime(futureDate)} ({routineObj.label})</strong>
            </p>
          </div>
        </div>

        <button className="btn-primary full-width" onClick={handleStartTracking}>
          <BookmarkPlus size={18} />
          <span>Start Tracking This Tablet Now</span>
        </button>
      </div>
    </div>
  );
}
