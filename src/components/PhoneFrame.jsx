import React, { useState, useEffect } from 'react';
import { Clock, Calculator, History, Wifi, Battery } from 'lucide-react';

export default function PhoneFrame({
  isWideMode,
  activeTab,
  setActiveTab,
  activeTabletCount,
  children
}) {
  const [timeStr, setTimeStr] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      setTimeStr(`${h}:${m}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`phone-frame ${isWideMode ? 'wide-mode' : ''}`}>
      {/* Phone Status Bar (Simulated Mobile Screen) */}
      <div className="phone-status-bar">
        <span className="status-time">{timeStr}</span>
        <div className="status-notch">
          <div className="camera-hole"></div>
          <div className="speaker-grill"></div>
        </div>
        <div className="status-icons">
          <Wifi size={13} />
          <div className="battery-icon">
            <div className="battery-level"></div>
          </div>
        </div>
      </div>

      {/* Internal Scrollable Content */}
      <div className="phone-scroll-content">
        {children}
      </div>

      {/* Phone Bottom Nav Bar */}
      <div className="phone-bottom-nav">
        <button
          className={`bottom-nav-item ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          <Clock size={19} />
          <span>Reservoirs</span>
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'calc' ? 'active' : ''}`}
          onClick={() => setActiveTab('calc')}
        >
          <Calculator size={19} />
          <span>Calculator</span>
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <History size={19} />
          <span>History</span>
        </button>
      </div>
    </div>
  );
}
