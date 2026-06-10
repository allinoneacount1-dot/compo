import React from 'react';

const LiveAlerts: React.FC = () => {
  const alerts = [
    {
      id: 1,
      arrow: '↗',
      token: '$BONK',
      event: 'Whale Buy',
      amount: '42.5 SOL',
      time: '2m ago',
      isBuy: true,
    },
    {
      id: 2,
      arrow: '↘',
      token: '$WIF',
      event: 'LP Pulled',
      amount: '847 SOL',
      time: '8m ago',
      isBuy: false,
    },
    {
      id: 3,
      arrow: '↘',
      token: '$POPCAT',
      event: 'Whale Sell',
      amount: '120 SOL',
      time: '14m ago',
      isBuy: false,
    },
    {
      id: 4,
      arrow: '↗',
      token: '$PYTH',
      event: 'New Listing',
      amount: 'Raydium',
      time: '22m ago',
      isBuy: true,
      isListing: true,
    },
    {
      id: 5,
      arrow: '🔴',
      token: '$MOODENG',
      event: 'Honeypot Alert',
      amount: ' -- ',
      time: '31m ago',
      isHoneypot: true,
    },
  ];

  return (
    <div className="live-alerts-section">
      <div className="alert-header">
        <div className="live-dot" aria-label="Live"></div>
        <span className="header-text">ACTIVE ALERTS</span>
        <span className="hot-badge">3 HOT</span>
      </div>
      <div className="alert-list">
        {alerts.map((alert) => (
          <div key={alert.id} className="alert-item">
            <span className="alert-arrow">{alert.arrow}</span>
            <span className="alert-token">{alert.token}</span>
            <span className="alert-event">{alert.event}</span>
            <span className="alert-amount">{alert.amount}</span>
            <span className="alert-time">{alert.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveAlerts;