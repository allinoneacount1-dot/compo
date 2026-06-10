import React, { useEffect, useState } from 'react';
import './sections.css';

// Mock data for live simulation
interface Alert {
  id: number;
  arrow: string;
  token: string;
  event: string;
  amount: string;
  time: string;
  isBuy?: boolean;
  isHoneypot?: boolean;
}

interface Module {
  id: string;
  eyebrow: string;
  title: string;
  desc: string;
  tags: string[];
}

// ===== LIVE ALERTS COMPONENT =====
const LiveAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 1, arrow: '↗', token: '$BONK', event: 'Whale Buy', amount: '42.5 SOL', time: '2m ago', isBuy: true },
    { id: 2, arrow: '↘', token: '$WIF', event: 'LP Pulled', amount: '847 SOL', time: '8m ago', isBuy: false },
    { id: 3, arrow: '↘', token: '$POPCAT', event: 'Whale Sell', amount: '120 SOL', time: '14m ago', isBuy: false },
    { id: 4, arrow: '↗', token: '$PYTH', event: 'New Listing', amount: 'Raydium', time: '22m ago', isBuy: true },
    { id: 5, arrow: '🔴', token: '$MOODENG', event: 'Honeypot Alert', amount: ' -- ', time: '31m ago', isHoneypot: true },
  ]);

  // Live simulation: prepend new alerts every 8s
  useEffect(() => {
    const interval = setInterval(() => {
      const newAlert: Alert = {
        id: Date.now(),
        arrow: Math.random() > 0.5 ? '↗' : '↘',
        token: ['$SOL', '$RAY', '$ORCA', '$JUP'][Math.floor(Math.random() * 4)],
        event: ['Whale Buy', 'Whale Sell', 'New Pair', 'Volume Spike'][Math.floor(Math.random() * 4)],
        amount: `${(Math.random() * 1000).toFixed(1)} SOL`,
        time: `${Math.floor(Math.random() * 3) + 1}m ago`,
        isBuy: Math.random() > 0.3,
      };
      setAlerts((prev) => [newAlert, ...prev.slice(0, 7)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-alerts">
      <div className="section-header">
        <div className="live-dot"></div>
        <span>ACTIVE ALERTS</span>
        <span className="badge-hot">3 HOT</span>
      </div>
      <div className="alert-list">
        {alerts.map((alert) => (
          <div key={alert.id} className="alert-item">
            <span className={`alert-arrow ${alert.isBuy ? 'buy' : ''} ${alert.isHoneypot ? 'honeypot' : ''}`}>
              {alert.arrow}
            </span>
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

// ===== 6 MODULES COMPONENT =====
const Modules: React.FC = () => {
  const modules: Module[] = [
    { id: '1', eyebrow: 'TOKEN_SCANNER', title: 'Scanner', desc: '12-point contract analysis. Honeypot detection. Liquidity verification.', tags: ['RISK SCORE', 'HONEYPOT', 'LP AUDIT'] },
    { id: '2', eyebrow: 'WHALE_RADAR', title: 'Whale Radar', desc: 'Real-time whale transaction tracking. Smart Money flow detection.', tags: ['REAL-TIME', 'WALLET LABELS', 'ALERTS'] },
    { id: '3', eyebrow: 'SNIPER_ENGINE', title: 'Sniper', desc: 'Fast DEX execution. MEV-resistant. One-click buy/sell.', tags: ['QUICK SNIPING', 'RAYDIUM', 'JUPITER'] },
    { id: '4', eyebrow: 'PORTFOLIO_INTEL', title: 'Portfolio', desc: 'Wallet tracking. P&L calculation. Risk exposure monitoring.', tags: ['P&L', 'RISK SCORE', 'ALERTS'] },
    { id: '5', eyebrow: 'ALERT_SYSTEM', title: 'Alerts', desc: 'Price triggers. Volume spikes. Contract warnings.', tags: ['PRICE', 'VOLUME', 'CONTRACT'] },
    { id: '6', eyebrow: 'LEADERBOARD', title: 'Leaderboard', desc: 'Ranked traders. Performance tracking. Alpha attribution.', tags: ['TRADERS', 'P&L', 'VERIFIED'] },
  ];

  return (
    <div className="modules-section">
      <div className="section-header">
        <span>TERMINAL MODULES</span>
      </div>
      <div className="modules-grid">
        {modules.map((m) => (
          <div key={m.id} className="module-card">
            <div className="module-eyebrow">{m.eyebrow}</div>
            <div className="module-title">{m.title}</div>
            <div className="module-desc">{m.desc}</div>
            <div className="module-tags">
              {m.tags.map((t) => (
                <span key={t} className="module-tag">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ===== HERO SECTION =====
const Hero: React.FC = () => (
  <section className="hero-section">
    <div className="hero-bento">
      <div className="hero-headline">
        <div className="eyebrow-badge">
          V1.0.0 -- MARKET WARFARE TERMINAL
        </div>
        <h1 className="hero-h1">
          SEE EVERYTHING
          <br />
          BEFORE
          <br />
          <span className="green">EVERYONE.</span>
        </h1>
        <div className="hero-subtitle">THE OPERATING SYSTEM FOR SOLANA MARKETS</div>
        <div className="hero-body">Track whales. Detect rugs. Execute faster.</div>
        <div className="hero-social" style={{ marginTop: '20px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#4b5563' }}>
          2847 traders | $742M tracked | 12,491 wallets
        </div>
      </div>
      <div className="bento-cards">
        <div className="bento-card">
          <div className="bento-label">AVG USER PERFORMANCE</div>
          <div className="bento-value">$+847</div>
          <div className="bento-sub green">+6.8% this week</div>
        </div>
        <div className="bento-card">
          <div className="bento-label">24H ALPHA GENERATED</div>
          <div className="bento-value">+$12.4M</div>
          <div className="bento-sub green">+2.46% vs yesterday</div>
        </div>
        <div className="bento-card">
          <div className="bento-label">TOKENS SCANNED TODAY</div>
          <div className="bento-value">14,847</div>
          <div className="bento-sub">across 3 chains</div>
        </div>
        <div className="bento-card">
          <div className="bento-label">RUGS DETECTED</div>
          <div className="bento-value" style={{ color: 'var(--red)' }}>3</div>
          <div className="bento-sub">today . 0 missed</div>
        </div>
      </div>
    </div>
  </section>
);

// ===== FOOTER =====
const Footer: React.FC = () => (
  <footer className="landing-footer">
    <div className="footer-content">
      <div>
        <div className="footer-logo">&gt;_ COMPO_</div>
        <div className="footer-subtitle">Solana Intelligence Terminal</div>
      </div>
      <div className="footer-col">
        <h4>PRODUCT</h4>
        <a href="#/scanner">Scanner</a>
        <a href="#/whales">Whale Radar</a>
        <a href="#/sniper">Sniper</a>
        <a href="#/dashboard">Portfolio</a>
        <a href="#/alerts">Alerts</a>
      </div>
      <div className="footer-col">
        <h4>RESOURCES</h4>
        <a href="#/docs">Docs</a>
        <a href="#/api">API</a>
        <a href="#/changelog">Changelog</a>
      </div>
      <div className="footer-col">
        <h4>COMMUNITY</h4>
        <a href="https://t.me/DexMultichain" target="_blank">Telegram</a>
        <a href="https://x.com/vaultmarco" target="_blank">Twitter</a>
        <a href="https://discord.gg" target="_blank">Discord</a>
      </div>
    </div>
  </footer>
);

// ===== RECENT SCANS TABLE =====
const RecentScans: React.FC = () => {
  const scans = [
    { addr: "0x6Ec...bA12", score: 87, verdict: "SAFE" },
    { addr: "0x2Df...e9F4", score: 94, verdict: "SAFE" },
    { addr: "0x8Ab...c3D7", score: 34, verdict: "DANGER" },
    { addr: "0x4Gh...f1A8", score: 56, verdict: "CAUTION" },
    { addr: "0x9Bc...d2E5", score: 72, verdict: "SAFE" },
  ];

  const verdictColor = (v: string) => {
    if (v === "SAFE") return { bg: "rgba(0,255,65,0.12)", text: "#00FF41" };
    if (v === "DANGER") return { bg: "rgba(239,68,68,0.12)", text: "#ef4444" };
    return { bg: "rgba(245,158,11,0.12)", text: "#f59e0b" };
  };

  return (
    <section className="recent-scans">
      <div className="section-header">
        <div className="live-dot"></div>
        <span>RECENT SCANS</span>
        <a href="#/scanner" className="view-all-link">View All ↗</a>
      </div>
      <div className="scans-table">
        <div className="scans-header">
          <span>ADDRESS</span>
          <span>RISK SCORE</span>
          <span>VERDICT</span>
        </div>
        {scans.map((s, i) => {
          const c = verdictColor(s.verdict);
          return (
            <div key={i} className="scan-row">
              <span className="scan-addr">{s.addr}</span>
              <span className="scan-score">{s.score}/100</span>
              <span className="scan-verdict" style={{ background: c.bg, color: c.text }}>
                {s.verdict}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// ===== WATCHLIST PREVIEW =====
const WatchlistPreview: React.FC = () => {
  const tokens = [
    { symbol: "$BONK", price: "$0.000012", change: "+12.4%", risk: 82, up: true },
    { symbol: "$WIF", price: "$2.840000", change: "-3.2%", risk: 91, up: false },
    { symbol: "$POPCAT", price: "$0.412000", change: "+8.7%", risk: 67, up: true },
    { symbol: "$PYTH", price: "$0.384000", change: "+1.1%", risk: 88, up: true },
    { symbol: "$JUP", price: "$0.921000", change: "-1.8%", risk: 85, up: false },
  ];

  const riskColor = (r: number) => {
    if (r >= 71) return "#00FF41";
    if (r >= 41) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <section className="watchlist-preview">
      <div className="section-header">
        <div className="live-dot"></div>
        <span>WATCHLIST</span>
        <span className="watchlist-count">5 tokens</span>
      </div>
      <div className="watchlist-table">
        <div className="watchlist-header">
          <span>TOKEN</span>
          <span>PRICE</span>
          <span>24H</span>
          <span>RISK</span>
        </div>
        {tokens.map((t, i) => (
          <div key={i} className="watchlist-row">
            <span className="wl-token">{t.symbol}</span>
            <span className="wl-price">{t.price}</span>
            <span className={`wl-change ${t.up ? "positive" : "negative"}`}>{t.change}</span>
            <span className="wl-risk" style={{ color: riskColor(t.risk) }}>{t.risk}/100</span>
          </div>
        ))}
      </div>
    </section>
  );
};

// ===== LEADERBOARD PREVIEW =====
const LeaderboardPreview: React.FC = () => {
  const traders = [
    { rank: 1, user: "@sol_architect", acc: "92%", pl: "+$2,840", verified: true },
    { rank: 2, user: "@whale_watcher", acc: "87%", pl: "+$1,920", verified: true },
    { rank: 3, user: "@mech_degen", acc: "95%", pl: "+$3,102", verified: true },
  ];

  return (
    <section className="leaderboard-preview">
      <div className="section-header">
        <div className="live-dot"></div>
        <span>TOP PERFORMERS -- 24H</span>
      </div>
      <div className="leaderboard-table">
        {traders.map((t) => (
          <div key={t.rank} className="leaderboard-row">
            <span className="lb-rank">#{t.rank}</span>
            <span className="lb-user">{t.user}</span>
            <span className="lb-acc">{t.acc} ACC</span>
            <span className="lb-pl">{t.pl} P&L</span>
            {t.verified && (
              <span className="lb-verified">VERIFIED ✓</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

// ===== MAIN LANDING PAGE =====
export const LandingPage: React.FC = () => {
  return (
    <div className="landing-root">
      <Navbar />
      <TickerBar />
      <GhostSidebar />
      
      <main className="landing-content">
        <Hero />
        <LiveAlerts />
        <RecentScans />
        <WatchlistPreview />
        <Modules />
        <LeaderboardPreview />
      </main>
      
      <Footer />
      <StatusBar />
    </div>
  );
};

// ===== Navbar Component =====
export const Navbar: React.FC = () => (
  <nav className="landing-navbar">
    <div className="navbar-zone">
      <div className="navbar-logo">
        &gt;_ COMPO<span className="cursor-blink">_</span>
      </div>
    </div>
    <div className="navbar-zone navbar-nav">
      <span className="nav-item"><span className="bracket">[</span>SCANNER<span className="bracket">]</span></span>
      <span className="nav-item"><span className="bracket">[</span>WHALES<span className="bracket">]</span></span>
      <span className="nav-item"><span className="bracket">[</span>SNIPER<span className="bracket">]</span></span>
      <span className="nav-item">DOCS</span>
    </div>
    <div className="navbar-zone" style={{ paddingRight: '24px' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <div className="status-dot"></div>
        <span>SOLANA</span>
      </span>
      <span style={{ color: '#2d2d2d' }}>|</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <div className="status-dot"></div>
        <span>LIVE</span>
      </span>
      <span style={{ color: '#2d2d2d' }}>|</span>
      <button style={{
        border: '1px solid var(--green)',
        color: 'var(--green)',
        background: 'transparent',
        padding: '6px 16px',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        borderRadius: '4px',
        cursor: 'pointer',
      }} onClick={() => window.location.hash = '#/dashboard'}>
        ENTER TERMINAL
      </button>
    </div>
  </nav>
);

// ===== TickerBar Component =====
export const TickerBar: React.FC = () => {
  const items = [
    { symbol: 'BTC', price: '$104,891', change: '+0.28%' },
    { symbol: 'ETH', price: '$2,412', change: '-0.84%' },
    { symbol: 'SOL', price: '$184', change: '+1.2%' },
    { symbol: 'BONK', price: '$0.0000142', change: '+12.3%' },
    { symbol: 'WIF', price: '$2.84', change: '-5.67%' },
    { symbol: 'JUP', price: '$0.98', change: '+8.12%' },
    { symbol: 'PYTH', price: '$0.42', change: '+1.04%' },
    { symbol: 'POPCAT', price: '$0.412', change: '+8.7%' },
  ];

  return (
    <div className="landing-ticker">
      <div className="ticker-track">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="ticker-item">
            <span className="ticker-symbol" style={{ color: '#9ca3af' }}>{item.symbol}</span>
            <span className="ticker-price">{item.price}</span>
            <span className={`ticker-change ${item.change.startsWith('+') ? 'positive' : 'negative'}`}>
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ===== StatusBar Component =====
export const StatusBar: React.FC = () => {
  const [slot, setSlot] = React.useState(284192447);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSlot((prev) => prev + 400);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-statusbar">
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <div className="status-dot"></div>
        <span>SOL</span>
      </span>
      <span style={{ color: '#2d2d2d' }}>|</span>
      <span>SLOT {slot.toLocaleString()}</span>
      <span style={{ color: '#2d2d2d' }}>|</span>
      <span>42ms</span>
      <span style={{ color: '#2d2d2d' }}>|</span>
      <span>SCANS 14,847</span>
      <span style={{ color: '#2d2d2d' }}>|</span>
      <span>COMPO v1.0.0</span>
      <span style={{ color: '#2d2d2d' }}>|</span>
      <span>© 2026</span>
      <span style={{ color: '#2d2d2d' }}>|</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <div className="status-dot"></div>
        <span className="status-connected">CONNECTED</span>
      </span>
    </div>
  );
};

// ===== GhostSidebar Component =====
export const GhostSidebar: React.FC = () => (
  <aside className="landing-sidebar">
    <div className="sidebar-item active">
      <span>▣</span> <span>Overview</span>
    </div>
    <div className="sidebar-item"><span>◎</span> Scanner</div>
    <div className="sidebar-item"><span>◉</span> Whale Radar</div>
    <div className="sidebar-item"><span>⚡</span> Sniper</div>
    <div className="sidebar-item"><span>▤</span> Portfolio</div>
    <div className="sidebar-item" style={{ position: 'relative' }}>
      <span>🔔</span> Alerts <span style={{ marginLeft: 'auto', background: 'var(--red-bg)', color: 'var(--red)', fontSize: '10px', padding: '2px 6px', borderRadius: '3px' }}>3</span>
    </div>
    <div className="sidebar-item"><span>🏆</span> Leaderboard</div>
    <div className="sidebar-item"><span>⚙</span> Settings</div>
  </aside>
);