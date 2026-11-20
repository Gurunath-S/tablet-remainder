import React from 'react';
import { Sparkles } from 'lucide-react';

export default function HeroLogic({ activeTablet }) {
  const taken = activeTablet?.doseTaken || 180;
  const unit = activeTablet?.unit || 'mg';
  const daily = activeTablet?.dailyNeed || 15;
  const days = activeTablet?.intervalDays || (taken / daily);

  return (
    <section className="reservoir-hero-card">
      <div className="hero-header">
        <div className="hero-chip">
          <Sparkles size={14} />
          <span>Smart Auto-Depletion Logic</span>
        </div>
        <span className="hero-badge">Active Formula</span>
      </div>

      <h2 className="hero-headline">Take once, rest for days.</h2>
      <p className="hero-desc">
        Took a high-strength <strong>Vitamin E ({taken} {unit})</strong>? The daily need is only <strong>{daily} {unit}/day</strong>.
        Your body reservoir lasts <strong>{days.toFixed(0)} full days</strong> before the next dose alarm!
      </p>

      <div className="quick-formula-bar">
        <div className="formula-col">
          <span className="formula-label">Dose Taken</span>
          <span className="formula-val">{taken} {unit}</span>
        </div>
        <span className="formula-operator">÷</span>
        <div className="formula-col">
          <span className="formula-label">Daily Need</span>
          <span className="formula-val">{daily} {unit}/d</span>
        </div>
        <span className="formula-operator">=</span>
        <div className="formula-col highlight">
          <span className="formula-label">Interval</span>
          <span className="formula-val">{days.toFixed(1)} Days</span>
        </div>
      </div>
    </section>
  );
}
