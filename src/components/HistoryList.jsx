import React from 'react';
import { formatDateTime } from '../utils/time';

export default function HistoryList({ history, onClearHistory }) {
  return (
    <div className="history-card">
      <div className="section-top-bar">
        <div>
          <h3 className="section-title">Intake & Alarm History</h3>
          <p className="section-sub">Chronological audit log of tablets taken & interval refills</p>
        </div>
        <button className="btn-outline-small" onClick={onClearHistory}>
          Clear Log
        </button>
      </div>

      <div className="history-list">
        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
            No intake records logged yet.
          </div>
        ) : (
          history.map((item) => (
            <div key={item.id} className="history-item">
              <div className="history-meta">
                <span className="history-tablet">{item.tabletName}</span>
                <span className="history-time">
                  {formatDateTime(item.timestamp)} &bull; {item.message}
                </span>
              </div>
              <span className="history-badge">{item.dose || 'Logged'}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
