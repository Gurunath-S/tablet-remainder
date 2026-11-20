import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Plus } from 'lucide-react';
import Header from './components/Header';
import PhoneFrame from './components/PhoneFrame';
import HeroLogic from './components/HeroLogic';
import ReservoirCard from './components/ReservoirCard';
import QuickCalculator from './components/QuickCalculator';
import HistoryList from './components/HistoryList';
import TabletModal from './components/TabletModal';
import AlarmModal from './components/AlarmModal';
import { playChimeAlarm, playSuccessChime } from './utils/audio';

const STORAGE_KEY = 'dosespan_react_tablets_v1';
const HISTORY_KEY = 'dosespan_react_history_v1';

export default function App() {
  const [isWideMode, setIsWideMode] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [now, setNow] = useState(Date.now());
  const [notifStatus, setNotifStatus] = useState(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  const [tablets, setTablets] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default seeded state matching user's exact Vitamin E scenario
    const startDate = new Date();
    const intervalDays = 180 / 15; // 12 days
    const nextDue = new Date(startDate.getTime() + intervalDays * 24 * 60 * 60 * 1000);
    nextDue.setHours(22, 0, 0, 0); // Before bed (22:00)

    return [
      {
        id: 'tab_vite_default',
        name: 'Vitamin E (Alpha-Tocopherol)',
        doseTaken: 180,
        dailyNeed: 15,
        unit: 'mg',
        intervalDays: 12,
        routine: 'before_bed',
        routineTime: '22:00',
        lastTakenAt: startDate.toISOString(),
        nextDueAt: nextDue.toISOString(),
        totalDurationMs: intervalDays * 24 * 60 * 60 * 1000,
        icon: '💊',
        notes: 'User Scenario: 180 mg pill ÷ 15 mg daily RDA = 12 days reservoir'
      }
    ];
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'hist_initial',
        timestamp: new Date().toISOString(),
        tabletName: 'Vitamin E (Alpha-Tocopherol)',
        dose: '180 mg',
        message: 'Initial 180 mg dose logged. Next alarm set for 12 days later (Before Bed).'
      }
    ];
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTablet, setEditingTablet] = useState(null);
  const [ringingTablet, setRingingTablet] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tablets));
  }, [tablets]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  // Real-time second tick for live countdown and alarm detection
  useEffect(() => {
    const interval = setInterval(() => {
      const current = Date.now();
      setNow(current);

      // Check if any tablet is due and modal isn't already ringing
      if (!ringingTablet) {
        const dueTablet = tablets.find((t) => new Date(t.nextDueAt).getTime() <= current);
        if (dueTablet) {
          setRingingTablet(dueTablet);
          playChimeAlarm();
          if ('Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification(`Tablet Due: ${dueTablet.name}`, {
                body: `Your ${dueTablet.intervalDays.toFixed(1)}-day reservoir has depleted. Time to take your dose!`,
                icon: '💊'
              });
            } catch (e) {}
          }
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [tablets, ringingTablet]);

  const addHistory = (tabletName, dose, message) => {
    const item = {
      id: 'hist_' + Date.now(),
      timestamp: new Date().toISOString(),
      tabletName,
      dose,
      message
    };
    setHistory((prev) => [item, ...prev].slice(0, 50));
  };

  const handleTakeDose = (tabletId) => {
    const tablet = tablets.find((t) => t.id === tabletId);
    if (!tablet) return;

    const startDate = new Date();
    const durationMs = tablet.totalDurationMs || (tablet.intervalDays * 24 * 60 * 60 * 1000);
    const nextDue = new Date(startDate.getTime() + durationMs);
    const [h, m] = (tablet.routineTime || '22:00').split(':').map(Number);
    nextDue.setHours(h, m, 0, 0);

    setTablets((prev) =>
      prev.map((t) =>
        t.id === tabletId
          ? {
              ...t,
              lastTakenAt: startDate.toISOString(),
              nextDueAt: nextDue.toISOString()
            }
          : t
      )
    );

    addHistory(
      tablet.name,
      `${tablet.doseTaken} ${tablet.unit}`,
      `Dose taken. Reservoir replenished for ${tablet.intervalDays.toFixed(1)} days.`
    );

    playSuccessChime();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });

    if (ringingTablet?.id === tabletId) {
      setRingingTablet(null);
    }
  };

  const handleSnooze = (tabletId, minutes) => {
    const tablet = tablets.find((t) => t.id === tabletId);
    if (!tablet) return;

    const newDue = new Date(Date.now() + minutes * 60 * 1000);
    setTablets((prev) =>
      prev.map((t) => (t.id === tabletId ? { ...t, nextDueAt: newDue.toISOString() } : t))
    );

    addHistory(
      tablet.name,
      'Snoozed',
      `Alarm snoozed for ${minutes >= 60 ? minutes / 60 + ' hour(s)' : minutes + ' minutes'}.`
    );

    setRingingTablet(null);
  };

  const handleDeleteTablet = (tabletId) => {
    const tablet = tablets.find((t) => t.id === tabletId);
    if (confirm(`Remove ${tablet?.name} from your reservoirs?`)) {
      setTablets((prev) => prev.filter((t) => t.id !== tabletId));
      if (ringingTablet?.id === tabletId) {
        setRingingTablet(null);
      }
    }
  };

  const handleSaveTablet = (formData) => {
    const durationMs = formData.intervalDays * 24 * 60 * 60 * 1000;
    const nextDue = new Date(formData.startDate.getTime() + durationMs);
    const [h, m] = (formData.routineTime || '22:00').split(':').map(Number);
    nextDue.setHours(h, m, 0, 0);

    if (formData.id) {
      // Edit
      setTablets((prev) =>
        prev.map((t) =>
          t.id === formData.id
            ? {
                ...t,
                name: formData.name,
                doseTaken: formData.doseTaken,
                dailyNeed: formData.dailyNeed,
                unit: formData.unit,
                routine: formData.routine,
                routineTime: formData.routineTime,
                intervalDays: formData.intervalDays,
                notes: formData.notes,
                nextDueAt: nextDue.toISOString(),
                totalDurationMs: durationMs
              }
            : t
        )
      );
      addHistory(formData.name, `${formData.doseTaken} ${formData.unit}`, 'Updated tablet configuration.');
    } else {
      // Create new
      const newTab = {
        id: 'tab_' + Date.now(),
        name: formData.name,
        doseTaken: formData.doseTaken,
        dailyNeed: formData.dailyNeed,
        unit: formData.unit,
        routine: formData.routine,
        routineTime: formData.routineTime,
        intervalDays: formData.intervalDays,
        notes: formData.notes,
        lastTakenAt: formData.startDate.toISOString(),
        nextDueAt: nextDue.toISOString(),
        totalDurationMs: durationMs,
        icon: '💊'
      };
      setTablets((prev) => [newTab, ...prev]);
      addHistory(
        formData.name,
        `${formData.doseTaken} ${formData.unit}`,
        `Started tracking ${formData.intervalDays.toFixed(1)}-day reservoir.`
      );
    }

    setModalOpen(false);
    setEditingTablet(null);
    setActiveTab('active');
  };

  const handleAddFromCalc = (calcData) => {
    const startDate = new Date();
    const durationMs = calcData.intervalDays * 24 * 60 * 60 * 1000;
    const nextDue = new Date(startDate.getTime() + durationMs);
    const [h, m] = (calcData.routineTime || '22:00').split(':').map(Number);
    nextDue.setHours(h, m, 0, 0);

    const newTab = {
      id: 'tab_' + Date.now(),
      name: calcData.name,
      doseTaken: calcData.doseTaken,
      dailyNeed: calcData.dailyNeed,
      unit: calcData.unit,
      routine: calcData.routine,
      routineTime: calcData.routineTime,
      intervalDays: calcData.intervalDays,
      notes: calcData.notes,
      lastTakenAt: startDate.toISOString(),
      nextDueAt: nextDue.toISOString(),
      totalDurationMs: durationMs,
      icon: '💊'
    };

    setTablets((prev) => [newTab, ...prev]);
    addHistory(
      calcData.name,
      `${calcData.doseTaken} ${calcData.unit}`,
      `Created via calculator for ${calcData.intervalDays.toFixed(1)} days.`
    );
    setActiveTab('active');
  };

  const requestNotification = () => {
    if (!('Notification' in window)) {
      alert('Desktop notifications are not supported on this browser; audio chimes are ready!');
      return;
    }
    Notification.requestPermission().then((perm) => {
      setNotifStatus(perm);
      if (perm === 'granted') {
        playSuccessChime();
        new Notification('DoseSpan Connected', {
          body: 'Notifications are enabled. You will receive alarms when reservoirs deplete.'
        });
      }
    });
  };

  return (
    <div className="app-container">
      <Header
        isWideMode={isWideMode}
        setIsWideMode={setIsWideMode}
        notifStatus={notifStatus}
        onRequestNotification={requestNotification}
        onOpenAddModal={() => {
          setEditingTablet(null);
          setModalOpen(true);
        }}
      />

      <main className="main-viewport">
        <PhoneFrame
          isWideMode={isWideMode}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeTabletCount={tablets.length}
        >
          {/* Top Formula Banner */}
          <HeroLogic activeTablet={tablets[0]} />

          {/* Desktop/Inner Tab Navigation */}
          <nav className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              <span>Active Reservoirs</span>
              <span className="badge-count">{tablets.length}</span>
            </button>
            <button
              className={`nav-tab ${activeTab === 'calc' ? 'active' : ''}`}
              onClick={() => setActiveTab('calc')}
            >
              <span>Quick Calculator</span>
            </button>
            <button
              className={`nav-tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <span>Log History</span>
            </button>
          </nav>

          {/* TAB 1: ACTIVE RESERVOIRS */}
          {activeTab === 'active' && (
            <section className="tab-pane active">
              <div className="section-top-bar">
                <div>
                  <h3 className="section-title">Your Supplement Reservoirs</h3>
                  <p className="section-sub">Live burn-down countdown & upcoming alarms</p>
                </div>
                <button
                  className="btn-subtle-add"
                  onClick={() => {
                    setEditingTablet(null);
                    setModalOpen(true);
                  }}
                >
                  + Add Tablet
                </button>
              </div>

              {tablets.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">💊</div>
                  <h4>No Tablets Active</h4>
                  <p>Add a supplement or tablet to calculate your dosage reservoir & interval alarm.</p>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setEditingTablet(null);
                      setModalOpen(true);
                    }}
                  >
                    Add Your First Tablet
                  </button>
                </div>
              ) : (
                <div className="tablets-grid">
                  {tablets.map((tablet) => (
                    <ReservoirCard
                      key={tablet.id}
                      tablet={tablet}
                      now={now}
                      onTakeDose={handleTakeDose}
                      onEdit={(tab) => {
                        setEditingTablet(tab);
                        setModalOpen(true);
                      }}
                      onDelete={handleDeleteTablet}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* TAB 2: CALCULATOR */}
          {activeTab === 'calc' && (
            <section className="tab-pane active">
              <QuickCalculator onAddTabletFromCalc={handleAddFromCalc} />
            </section>
          )}

          {/* TAB 3: HISTORY */}
          {activeTab === 'history' && (
            <section className="tab-pane active">
              <HistoryList
                history={history}
                onClearHistory={() => {
                  if (confirm('Clear all intake logs?')) {
                    setHistory([]);
                  }
                }}
              />
            </section>
          )}
        </PhoneFrame>
      </main>

      {/* MODAL: ADD / EDIT TABLET */}
      <TabletModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTablet(null);
        }}
        onSave={handleSaveTablet}
        initialData={editingTablet}
      />

      {/* ALARM MODAL */}
      <AlarmModal
        tablet={ringingTablet}
        onTakeNow={handleTakeDose}
        onSnooze={handleSnooze}
      />

      {/* Floating Audio Sound Test */}
      <div className="floating-controls">
        <button
          className="btn-fab-sound"
          onClick={() => {
            playChimeAlarm();
            confetti({ particleCount: 25, spread: 45, origin: { y: 0.9 } });
          }}
          title="Test polyphonic chime alert"
        >
          <Volume2 size={16} />
          <span>Test Alarm Sound</span>
        </button>
      </div>
    </div>
  );
}
