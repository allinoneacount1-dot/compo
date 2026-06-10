"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Bell,
  TrendingUp,
  TrendingDown,
  Fish,
  BarChart3,
  Flame,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  Download,
  Send,
  MessageSquare,
  Mail,
  Smartphone,
  ToggleLeft,
  ToggleRight,
  Clock,
  Search,
  AlertTriangle,
  Settings2,
  History,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { cn } from "../../lib/utils/cn";

// ─── Types ───

type AlertType = "price_above" | "price_below" | "whale_move" | "volume_spike" | "trending";
type AlertStatus = "active" | "triggered" | "disabled";
type FilterTab = "all" | "active" | "triggered" | "disabled";

interface Alert {
  id: string;
  type: AlertType;
  token: string;
  symbol: string;
  condition: "above" | "below";
  currentPrice: number;
  targetPrice: number;
  status: AlertStatus;
  createdAt: Date;
  channels: string[];
}

interface AlertHistoryEntry {
  id: string;
  triggeredAt: Date;
  token: string;
  symbol: string;
  condition: string;
  priceAtTrigger: number;
}

interface NotificationSettings {
  telegram: boolean;
  discord: boolean;
  email: boolean;
  push: boolean;
}

// ─── Constants ───

const ALERT_TYPE_CONFIG: Record<AlertType, { label: string; icon: typeof TrendingUp; color: string; bg: string }> = {
  price_above: { label: "Price Above", icon: TrendingUp, color: "text-[#10b981]", bg: "rgba(16,185,129,0.12)" },
  price_below: { label: "Price Below", icon: TrendingDown, color: "text-[#ef4444]", bg: "rgba(239,68,68,0.12)" },
  whale_move: { label: "Whale Move", icon: Fish, color: "text-[#3b82f6]", bg: "rgba(59,130,246,0.12)" },
  volume_spike: { label: "Volume Spike", icon: BarChart3, color: "text-[#f59e0b]", bg: "rgba(245,158,11,0.12)" },
  trending: { label: "Trending", icon: Flame, color: "text-[#f97316]", bg: "rgba(249,115,22,0.12)" },
};

const STATUS_STYLES: Record<AlertStatus, { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" }> = {
  active: { label: "Active", variant: "success" },
  triggered: { label: "Triggered", variant: "warning" },
  disabled: { label: "Disabled", variant: "neutral" },
};

const TOKEN_OPTIONS = [
  "BONK", "WIF", "POPCAT", "JUP", "PYTH", "MYRO", "MOODENG", "WEN", "BOME", "SLERF",
  "MEW", "NEIRO", "TREMP", "BODEN", "PONKE", "COK", "HARAMBE", "DUKO", "GME", "AMC",
];

// ─── Mock Data ───

const MOCK_ALERTS: Alert[] = [
  {
    id: "a1",
    type: "price_above",
    token: "BONK Inu",
    symbol: "BONK",
    condition: "above",
    currentPrice: 0.00001892,
    targetPrice: 0.000025,
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    channels: ["telegram", "discord"],
  },
  {
    id: "a2",
    type: "price_below",
    token: "dogwifhat",
    symbol: "WIF",
    condition: "below",
    currentPrice: 2.84,
    targetPrice: 2.5,
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    channels: ["telegram", "email"],
  },
  {
    id: "a3",
    type: "whale_move",
    token: "Popcat",
    symbol: "POPCAT",
    condition: "above",
    currentPrice: 0.412,
    targetPrice: 100,
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    channels: ["telegram", "discord", "email"],
  },
  {
    id: "a4",
    type: "volume_spike",
    token: "Jupiter",
    symbol: "JUP",
    condition: "above",
    currentPrice: 0.921,
    targetPrice: 2.5,
    status: "triggered",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    channels: ["telegram"],
  },
  {
    id: "a5",
    type: "trending",
    token: "Myro",
    symbol: "MYRO",
    condition: "above",
    currentPrice: 0.135,
    targetPrice: 0.2,
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
    channels: ["discord", "push"],
  },
  {
    id: "a6",
    type: "price_above",
    token: "Pyth Network",
    symbol: "PYTH",
    condition: "above",
    currentPrice: 0.384,
    targetPrice: 0.5,
    status: "disabled",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    channels: ["email"],
  },
  {
    id: "a7",
    type: "whale_move",
    token: "Moo Deng",
    symbol: "MOODENG",
    condition: "above",
    currentPrice: 0.0000452,
    targetPrice: 500,
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    channels: ["telegram", "discord", "email", "push"],
  },
  {
    id: "a8",
    type: "price_below",
    token: "Book of Meme",
    symbol: "BOME",
    condition: "below",
    currentPrice: 0.0085,
    targetPrice: 0.005,
    status: "triggered",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
    channels: ["telegram", "push"],
  },
];

const MOCK_HISTORY: AlertHistoryEntry[] = [
  { id: "h1", triggeredAt: new Date(Date.now() - 1000 * 60 * 3), token: "Jupiter", symbol: "JUP", condition: "Volume > 2.5x avg", priceAtTrigger: 0.945 },
  { id: "h2", triggeredAt: new Date(Date.now() - 1000 * 60 * 18), token: "Book of Meme", symbol: "BOME", condition: "Price < $0.005", priceAtTrigger: 0.0048 },
  { id: "h3", triggeredAt: new Date(Date.now() - 1000 * 60 * 45), token: "BONK Inu", symbol: "BONK", condition: "Whale buy > 500 SOL", priceAtTrigger: 0.0000192 },
  { id: "h4", triggeredAt: new Date(Date.now() - 1000 * 60 * 120), token: "dogwifhat", symbol: "WIF", condition: "Price > $3.00", priceAtTrigger: 3.02 },
  { id: "h5", triggeredAt: new Date(Date.now() - 1000 * 60 * 240), token: "Popcat", symbol: "POPCAT", condition: "Trending #1", priceAtTrigger: 0.425 },
  { id: "h6", triggeredAt: new Date(Date.now() - 1000 * 60 * 360), token: "Myro", symbol: "MYRO", condition: "Volume > 1.8x avg", priceAtTrigger: 0.138 },
  { id: "h7", triggeredAt: new Date(Date.now() - 1000 * 60 * 520), token: "Pyth Network", symbol: "PYTH", condition: "Price > $0.40", priceAtTrigger: 0.405 },
  { id: "h8", triggeredAt: new Date(Date.now() - 1000 * 60 * 720), token: "Moo Deng", symbol: "MOODENG", condition: "Whale buy > 200 SOL", priceAtTrigger: 0.0000461 },
  { id: "h9", triggeredAt: new Date(Date.now() - 1000 * 60 * 960), token: "BONK Inu", symbol: "BONK", condition: "Price > $0.000020", priceAtTrigger: 0.0000205 },
  { id: "h10", triggeredAt: new Date(Date.now() - 1000 * 60 * 1440), token: "dogwifhat", symbol: "WIF", condition: "Price < $2.60", priceAtTrigger: 2.58 },
];

// ─── Helpers ───

function formatPrice(price: number): string {
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  if (price >= 0.0001) return `$${price.toFixed(6)}`;
  return `$${price.toFixed(8)}`;
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function formatTimestamp(date: Date): string {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Toggle Component ───

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "transition-colors duration-150",
        enabled ? "text-[#00ff41]" : "text-[#525252]"
      )}
    >
      {enabled ? (
        <ToggleRight className="w-8 h-8" />
      ) : (
        <ToggleLeft className="w-8 h-8" />
      )}
    </button>
  );
}

// ─── Main Component ───

export default function AlertsPage() {
  // State
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTargetPrice, setEditTargetPrice] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Create form state
  const [newAlertType, setNewAlertType] = useState<AlertType>("price_above");
  const [newAlertToken, setNewAlertToken] = useState("");
  const [newAlertCondition, setNewAlertCondition] = useState<"above" | "below">("above");
  const [newAlertTarget, setNewAlertTarget] = useState("");
  const [newAlertChannels, setNewAlertChannels] = useState<string[]>(["telegram"]);
  const [tokenDropdownOpen, setTokenDropdownOpen] = useState(false);

  // Sort state
  type SortField = "created" | "type" | "status" | "token";
  type SortDir = "asc" | "desc";
  const [sortBy, setSortBy] = useState<SortField>("created");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Notification settings
  const [notifSettings, setNotifSettings] = useState<NotificationSettings>({
    telegram: true,
    discord: false,
    email: true,
    push: false,
  });

  // Derived data — filter + sort
  const filteredAlerts = useMemo(() => {
    const base = filterTab === "all" ? alerts : alerts.filter((a) => a.status === filterTab);
    return [...base].sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case "created":
          cmp = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case "type":
          cmp = a.type.localeCompare(b.type);
          break;
        case "status":
          cmp = a.status.localeCompare(b.status);
          break;
        case "token":
          cmp = a.symbol.localeCompare(b.symbol);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [alerts, filterTab, sortBy, sortDir]);

  const activeCount = alerts.filter((a) => a.status === "active").length;
  const triggeredTodayCount = alerts.filter((a) => a.status === "triggered").length;
  const connectedChannelsCount = Object.values(notifSettings).filter(Boolean).length;

  // Handlers
  const handleDelete = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const handleEditStart = useCallback((alert: Alert) => {
    setEditingId(alert.id);
    setEditTargetPrice(alert.targetPrice.toString());
  }, []);

  const handleEditSave = useCallback(
    (id: string) => {
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, targetPrice: parseFloat(editTargetPrice) || a.targetPrice } : a
        )
      );
      setEditingId(null);
      setEditTargetPrice("");
    },
    [editTargetPrice]
  );

  const handleEditCancel = useCallback(() => {
    setEditingId(null);
    setEditTargetPrice("");
  }, []);

  const handleStatusToggle = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const next: Record<AlertStatus, AlertStatus> = {
          active: "disabled",
          disabled: "active",
          triggered: "active",
        };
        return { ...a, status: next[a.status] };
      })
    );
  }, []);

  const handleCreateAlert = useCallback(() => {
    if (!newAlertToken || !newAlertTarget) return;
    const newAlert: Alert = {
      id: `a${Date.now()}`,
      type: newAlertType,
      token: newAlertToken,
      symbol: newAlertToken.toUpperCase(),
      condition: newAlertCondition,
      currentPrice: 0,
      targetPrice: parseFloat(newAlertTarget),
      status: "active",
      createdAt: new Date(),
      channels: newAlertChannels,
    };
    setAlerts((prev) => [newAlert, ...prev]);
    setNewAlertToken("");
    setNewAlertTarget("");
    setNewAlertType("price_above");
    setNewAlertCondition("above");
    setNewAlertChannels(["telegram"]);
    setShowCreateForm(false);
  }, [newAlertType, newAlertToken, newAlertCondition, newAlertTarget, newAlertChannels]);

  const handleChannelToggle = useCallback((channel: string) => {
    setNewAlertChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    );
  }, []);

  const handleExport = useCallback(() => {
    const data = JSON.stringify(alerts, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compo-alerts-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [alerts]);

  const toggleNotifSetting = useCallback((key: keyof NotificationSettings) => {
    setNotifSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Filter tab counts
  const tabCounts = useMemo(
    () => ({
      all: alerts.length,
      active: alerts.filter((a) => a.status === "active").length,
      triggered: alerts.filter((a) => a.status === "triggered").length,
      disabled: alerts.filter((a) => a.status === "disabled").length,
    }),
    [alerts]
  );

  const FILTER_TABS: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "triggered", label: "Triggered" },
    { key: "disabled", label: "Disabled" },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 space-y-5 max-w-[1280px]">
        {/* ═══════════════════════════════════════════════════════════════
            PAGE HEADER
        ═══════════════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[rgba(0,255,65,0.1)] flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#00ff41]" />
            </div>
            <div>
              <h1 className="font-mono text-lg font-bold text-[#e4e4e7] tracking-wide">
                Alerts
              </h1>
              <p className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                Notification Center &bull; Price Alert Manager
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={handleExport}
            >
              Export
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              New Alert
            </Button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            1. ALERT SUMMARY BAR
        ═══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Active Alerts */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                Active Alerts
              </span>
              <div className="w-6 h-6 rounded bg-[rgba(0,255,65,0.1)] flex items-center justify-center">
                <Bell className="w-3.5 h-3.5 text-[#00ff41]" />
              </div>
            </div>
            <p className="text-2xl font-bold font-mono text-[#00ff41]">{activeCount}</p>
            <p className="font-mono text-[10px] text-[#525252] mt-1">
              monitoring
            </p>
          </Card>

          {/* Triggered Today */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                Triggered Today
              </span>
              <div className="w-6 h-6 rounded bg-[rgba(245,158,11,0.1)] flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5 text-[#f59e0b]" />
              </div>
            </div>
            <p className="text-2xl font-bold font-mono text-[#f59e0b]">{triggeredTodayCount}</p>
            <p className="font-mono text-[10px] text-[#525252] mt-1">
              notifications sent
            </p>
          </Card>

          {/* Connected Channels */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                Connected Channels
              </span>
              <div className="w-6 h-6 rounded bg-[rgba(59,130,246,0.1)] flex items-center justify-center">
                <Send className="w-3.5 h-3.5 text-[#3b82f6]" />
              </div>
            </div>
            <p className="text-2xl font-bold font-mono text-[#3b82f6]">{connectedChannelsCount}</p>
            <p className="font-mono text-[10px] text-[#525252] mt-1">
              of 4 enabled
            </p>
          </Card>

          {/* Total Alerts */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                Total Alerts
              </span>
              <div className="w-6 h-6 rounded bg-[rgba(113,113,122,0.15)] flex items-center justify-center">
                <BarChart3 className="w-3.5 h-3.5 text-[#71717a]" />
              </div>
            </div>
            <p className="text-2xl font-bold font-mono text-[#e4e4e7]">{alerts.length}</p>
            <p className="font-mono text-[10px] text-[#525252] mt-1">
              all time
            </p>
          </Card>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            2. CREATE NEW ALERT FORM
        ═══════════════════════════════════════════════════════════════ */}
        {showCreateForm && (
          <Card className="border-[rgba(0,255,65,0.15)]">
            <div className="flex items-center gap-2 mb-4">
              <Plus className="w-4 h-4 text-[#00ff41]" />
              <h2 className="font-mono text-sm font-bold text-[#e4e4e7] uppercase tracking-wider">
                Create New Alert
              </h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="ml-auto text-[#525252] hover:text-[#71717a] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {/* Alert Type */}
              <div>
                <label className="font-mono text-[10px] text-[#525252] uppercase tracking-wider mb-1.5 block">
                  Alert Type
                </label>
                <div className="relative">
                  <select
                    value={newAlertType}
                    onChange={(e) => setNewAlertType(e.target.value as AlertType)}
                    className="w-full h-10 rounded px-3 bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)] text-[#e4e4e7] font-mono text-sm focus:outline-none focus:border-[#00ff41] appearance-none cursor-pointer transition-colors"
                  >
                    {Object.entries(ALERT_TYPE_CONFIG).map(([key, cfg]) => (
                      <option key={key} value={key}>
                        {cfg.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Token Search */}
              <div>
                <label className="font-mono text-[10px] text-[#525252] uppercase tracking-wider mb-1.5 block">
                  Token
                </label>
                <div className="relative">
                  <Input
                    mono
                    placeholder="Search token..."
                    value={newAlertToken}
                    onChange={(e) => {
                      setNewAlertToken(e.target.value);
                      setTokenDropdownOpen(true);
                    }}
                    onFocus={() => setTokenDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setTokenDropdownOpen(false), 200)}
                    icon={<Search className="w-4 h-4" />}
                  />
                  {tokenDropdownOpen && newAlertToken && (
                    <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-[#111113] border border-[rgba(255,255,255,0.08)] rounded max-h-40 overflow-y-auto">
                      {TOKEN_OPTIONS.filter((t) =>
                        t.toLowerCase().includes(newAlertToken.toLowerCase())
                      ).map((t) => (
                        <button
                          key={t}
                          onMouseDown={() => {
                            setNewAlertToken(t);
                            setTokenDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 font-mono text-xs text-[#e4e4e7] hover:bg-[rgba(0,255,65,0.05)] transition-colors"
                        >
                          ${t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="font-mono text-[10px] text-[#525252] uppercase tracking-wider mb-1.5 block">
                  Condition
                </label>
                <div className="flex gap-1.5">
                  {(["above", "below"] as const).map((cond) => (
                    <button
                      key={cond}
                      onClick={() => setNewAlertCondition(cond)}
                      className={cn(
                        "flex-1 h-10 rounded border font-mono text-xs uppercase tracking-wider transition-all duration-150",
                        newAlertCondition === cond
                          ? "border-[rgba(0,255,65,0.3)] text-[#00ff41] bg-[rgba(0,255,65,0.05)]"
                          : "border-[rgba(255,255,255,0.06)] text-[#525252] hover:text-[#71717a]"
                      )}
                    >
                      {cond === "above" ? "Above" : "Below"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Price */}
              <div>
                <label className="font-mono text-[10px] text-[#525252] uppercase tracking-wider mb-1.5 block">
                  Target Price (USD)
                </label>
                <Input
                  mono
                  type="number"
                  step="any"
                  min="0"
                  placeholder="0.00"
                  value={newAlertTarget}
                  onChange={(e) => setNewAlertTarget(e.target.value)}
                />
              </div>
            </div>

            {/* Notification Channels */}
            <div className="mb-4">
              <label className="font-mono text-[10px] text-[#525252] uppercase tracking-wider mb-2 block">
                Notify via
              </label>
              <div className="flex flex-wrap gap-2">
                {([
                  { key: "telegram", label: "Telegram", icon: <Send className="w-3.5 h-3.5" />, color: "text-[#3b82f6]" },
                  { key: "discord", label: "Discord", icon: <MessageSquare className="w-3.5 h-3.5" />, color: "text-[#8b5cf6]" },
                  { key: "email", label: "Email", icon: <Mail className="w-3.5 h-3.5" />, color: "text-[#f59e0b]" },
                  { key: "push", label: "Push", icon: <Smartphone className="w-3.5 h-3.5" />, color: "text-[#10b981]" },
                ] as const).map((ch) => (
                  <button
                    key={ch.key}
                    onClick={() => handleChannelToggle(ch.key)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded border font-mono text-[11px] transition-all duration-150",
                      newAlertChannels.includes(ch.key)
                        ? cn("border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)]", ch.color)
                        : "border-[rgba(255,255,255,0.06)] text-[#525252] hover:text-[#71717a]"
                    )}
                  >
                    {ch.icon}
                    {ch.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="md"
                onClick={handleCreateAlert}
                disabled={!newAlertToken || !newAlertTarget}
                icon={<Plus className="w-4 h-4" />}
              >
                Create Alert
              </Button>
            </div>
          </Card>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            3. ACTIVE ALERTS LIST
        ═══════════════════════════════════════════════════════════════ */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse" />
              <h2 className="font-mono text-sm font-bold text-[#e4e4e7] uppercase tracking-wider">
                Alert Rules
              </h2>
            </div>
            <span className="font-mono text-[10px] text-[#525252]">
              {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Filter Tabs + Sort Dropdown */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-1 flex-1 p-1 bg-[#0a0a0b] rounded border border-[rgba(255,255,255,0.04)]">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilterTab(tab.key)}
                  className={cn(
                    "flex-1 h-8 rounded font-mono text-[11px] uppercase tracking-wider transition-all duration-150",
                    filterTab === tab.key
                      ? "bg-[rgba(0,255,65,0.1)] text-[#00ff41] border border-[rgba(0,255,65,0.2)]"
                      : "text-[#525252] hover:text-[#71717a] border border-transparent"
                  )}
                >
                  {tab.label}{" "}
                  <span className="opacity-60">({tabCounts[tab.key]})</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">Sort</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  const val = e.target.value as SortField;
                  setSortBy(val);
                  setSortDir("desc");
                }}
                className="h-8 px-2 rounded bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)] text-[#e4e4e7] font-mono text-[11px] focus:outline-none focus:border-[#00ff41] appearance-none cursor-pointer"
              >
                <option value="created">Time</option>
                <option value="type">Type</option>
                <option value="status">Status</option>
                <option value="token">Token</option>
              </select>
              <button
                onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                className="h-8 w-8 flex items-center justify-center rounded border border-[rgba(255,255,255,0.08)] text-[#525252] hover:text-[#e4e4e7] transition-colors"
                title={sortDir === "asc" ? "Ascending" : "Descending"}
              >
                {sortDir === "asc" ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Alert Cards */}
          <div className="space-y-2">
            {filteredAlerts.length === 0 && (
              <div className="text-center py-8">
                <Bell className="w-8 h-8 text-[#525252] mx-auto mb-2" />
                <p className="font-mono text-xs text-[#525252]">
                  No alerts match this filter
                </p>
              </div>
            )}
            {filteredAlerts.map((alert) => {
              const typeConfig = ALERT_TYPE_CONFIG[alert.type];
              const TypeIcon = typeConfig.icon;
              const statusStyle = STATUS_STYLES[alert.status];
              const isEditing = editingId === alert.id;

              return (
                <div
                  key={alert.id}
                  className={cn(
                    "rounded border p-3 transition-all duration-150",
                    alert.status === "triggered"
                      ? "border-[rgba(245,158,11,0.2)] bg-[rgba(245,158,11,0.02)]"
                      : alert.status === "disabled"
                        ? "border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.01)] opacity-60"
                        : "border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.01)] hover:border-[rgba(255,255,255,0.1)]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {/* Type Icon */}
                    <div
                      className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0"
                      style={{ background: typeConfig.bg }}
                    >
                      <TypeIcon className={cn("w-4 h-4", typeConfig.color)} />
                    </div>

                    {/* Token + Condition */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-bold text-[#e4e4e7]">
                          ${alert.symbol}
                        </span>
                        <span className="font-mono text-[10px] text-[#525252]">
                          {alert.token}
                        </span>
                        <Badge variant={statusStyle.variant} size="sm">
                          {statusStyle.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="font-mono text-[10px] text-[#525252]">
                          {typeConfig.label}
                        </span>
                        <span className="font-mono text-[10px] text-[#71717a]">
                          {alert.condition === "above" ? ">" : "<"}{" "}
                          {isEditing ? (
                            <input
                              type="number"
                              step="any"
                              value={editTargetPrice}
                              onChange={(e) => setEditTargetPrice(e.target.value)}
                              className="w-24 h-5 px-1.5 rounded bg-[#0a0a0b] border border-[rgba(255,255,255,0.1)] text-[#00ff41] font-mono text-[10px] focus:outline-none focus:border-[#00ff41]"
                              autoFocus
                            />
                          ) : (
                            <span className="text-[#e4e4e7]">
                              {formatPrice(alert.targetPrice)}
                            </span>
                          )}
                        </span>
                        {alert.currentPrice > 0 && (
                          <span className="font-mono text-[10px] text-[#525252]">
                            Current: <span className="text-[#71717a]">{formatPrice(alert.currentPrice)}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Channels */}
                    <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
                      {alert.channels.includes("telegram") && (
                        <div className="w-5 h-5 rounded bg-[rgba(59,130,246,0.1)] flex items-center justify-center" title="Telegram">
                          <Send className="w-3 h-3 text-[#3b82f6]" />
                        </div>
                      )}
                      {alert.channels.includes("discord") && (
                        <div className="w-5 h-5 rounded bg-[rgba(139,92,246,0.1)] flex items-center justify-center" title="Discord">
                          <MessageSquare className="w-3 h-3 text-[#8b5cf6]" />
                        </div>
                      )}
                      {alert.channels.includes("email") && (
                        <div className="w-5 h-5 rounded bg-[rgba(245,158,11,0.1)] flex items-center justify-center" title="Email">
                          <Mail className="w-3 h-3 text-[#f59e0b]" />
                        </div>
                      )}
                      {alert.channels.includes("push") && (
                        <div className="w-5 h-5 rounded bg-[rgba(16,185,129,0.1)] flex items-center justify-center" title="Push">
                          <Smartphone className="w-3 h-3 text-[#10b981]" />
                        </div>
                      )}
                    </div>

                    {/* Time */}
                    <div className="hidden lg:flex items-center gap-1 flex-shrink-0">
                      <Clock className="w-3 h-3 text-[#525252]" />
                      <span className="font-mono text-[10px] text-[#525252]">
                        {formatTimeAgo(alert.createdAt)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleEditSave(alert.id)}
                            className="w-7 h-7 rounded flex items-center justify-center text-[#10b981] hover:bg-[rgba(16,185,129,0.1)] transition-colors"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={handleEditCancel}
                            className="w-7 h-7 rounded flex items-center justify-center text-[#ef4444] hover:bg-[rgba(239,68,68,0.1)] transition-colors"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStatusToggle(alert.id)}
                            className={cn(
                              "w-7 h-7 rounded flex items-center justify-center transition-colors",
                              alert.status === "disabled"
                                ? "text-[#525252] hover:text-[#00ff41] hover:bg-[rgba(0,255,65,0.05)]"
                                : "text-[#525252] hover:text-[#f59e0b] hover:bg-[rgba(245,158,11,0.05)]"
                            )}
                            title={alert.status === "disabled" ? "Enable" : "Disable"}
                          >
                            {alert.status === "disabled" ? (
                              <ToggleLeft className="w-4 h-4" />
                            ) : (
                              <ToggleRight className="w-4 h-4 text-[#00ff41]" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEditStart(alert)}
                            className="w-7 h-7 rounded flex items-center justify-center text-[#525252] hover:text-[#3b82f6] hover:bg-[rgba(59,130,246,0.05)] transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(alert.id)}
                            className="w-7 h-7 rounded flex items-center justify-center text-[#525252] hover:text-[#ef4444] hover:bg-[rgba(239,68,68,0.05)] transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* ═══════════════════════════════════════════════════════════════
            4. ALERT HISTORY + NOTIFICATION SETTINGS (2-col)
        ═══════════════════════════════════════════════════════════════ */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-3">
          {/* Alert History Table */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#3b82f6]" />
                <h2 className="font-mono text-sm font-bold text-[#e4e4e7] uppercase tracking-wider">
                  Alert History
                </h2>
              </div>
              <span className="font-mono text-[10px] text-[#525252]">
                Last 10 triggered
              </span>
            </div>

            <div className="space-y-0">
              {/* Header */}
              <div className="grid grid-cols-[120px_1fr_1fr_120px_100px] gap-2 px-3 py-1.5 border-b border-[rgba(255,255,255,0.06)]">
                {["Timestamp", "Token", "Condition", "Price", "Status"].map((h) => (
                  <span
                    key={h}
                    className="font-mono text-[10px] text-[#525252] uppercase tracking-wider"
                  >
                    {h}
                  </span>
                ))}
              </div>
              {MOCK_HISTORY.map((entry) => (
                <div
                  key={entry.id}
                  className="grid grid-cols-[120px_1fr_1fr_120px_100px] gap-2 px-3 py-2.5 border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                >
                  <span className="font-mono text-[10px] text-[#71717a]">
                    {formatTimestamp(entry.triggeredAt)}
                  </span>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-mono text-xs text-[#00ff41] font-bold">
                      ${entry.symbol}
                    </span>
                    <span className="font-mono text-[10px] text-[#525252] truncate">
                      {entry.token}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#71717a] truncate">
                    {entry.condition}
                  </span>
                  <span className="font-mono text-xs text-[#e4e4e7]">
                    {formatPrice(entry.priceAtTrigger)}
                  </span>
                  <Badge variant="warning" size="sm">
                    Triggered
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Notification Settings */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Settings2 className="w-4 h-4 text-[#00ff41]" />
              <h2 className="font-mono text-sm font-bold text-[#e4e4e7] uppercase tracking-wider">
                Notification Settings
              </h2>
            </div>

            <div className="space-y-0">
              {/* Telegram */}
              <div className="flex items-center justify-between py-3 border-b border-[rgba(255,255,255,0.04)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[rgba(59,130,246,0.1)] flex items-center justify-center">
                    <Send className="w-4 h-4 text-[#3b82f6]" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-[#e4e4e7] font-medium">
                      Telegram Bot
                    </p>
                    <p className="font-mono text-[10px] text-[#525252]">
                      {notifSettings.telegram ? "Connected" : "Not connected"}
                    </p>
                  </div>
                </div>
                <Toggle
                  enabled={notifSettings.telegram}
                  onToggle={() => toggleNotifSetting("telegram")}
                />
              </div>

              {/* Discord */}
              <div className="flex items-center justify-between py-3 border-b border-[rgba(255,255,255,0.04)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[rgba(139,92,246,0.1)] flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-[#8b5cf6]" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-[#e4e4e7] font-medium">
                      Discord Webhook
                    </p>
                    <p className="font-mono text-[10px] text-[#525252]">
                      {notifSettings.discord ? "Webhook active" : "Not configured"}
                    </p>
                  </div>
                </div>
                <Toggle
                  enabled={notifSettings.discord}
                  onToggle={() => toggleNotifSetting("discord")}
                />
              </div>

              {/* Email */}
              <div className="flex items-center justify-between py-3 border-b border-[rgba(255,255,255,0.04)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[rgba(245,158,11,0.1)] flex items-center justify-center">
                    <Mail className="w-4 h-4 text-[#f59e0b]" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-[#e4e4e7] font-medium">
                      Email Notifications
                    </p>
                    <p className="font-mono text-[10px] text-[#525252]">
                      {notifSettings.email ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>
                <Toggle
                  enabled={notifSettings.email}
                  onToggle={() => toggleNotifSetting("email")}
                />
              </div>

              {/* Push */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[rgba(16,185,129,0.1)] flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-[#10b981]" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-[#e4e4e7] font-medium">
                      Push Notifications
                    </p>
                    <p className="font-mono text-[10px] text-[#525252]">
                      {notifSettings.push ? "Browser push on" : "Browser push off"}
                    </p>
                  </div>
                </div>
                <Toggle
                  enabled={notifSettings.push}
                  onToggle={() => toggleNotifSetting("push")}
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 rounded bg-[#0a0a0b] border border-[rgba(255,255,255,0.04)]">
                  <p className="font-mono text-lg font-bold text-[#00ff41]">
                    {alerts.filter((a) => a.status === "triggered").length}
                  </p>
                  <p className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                    Triggered
                  </p>
                </div>
                <div className="text-center p-2 rounded bg-[#0a0a0b] border border-[rgba(255,255,255,0.04)]">
                  <p className="font-mono text-lg font-bold text-[#3b82f6]">
                    {connectedChannelsCount}
                  </p>
                  <p className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                    Channels
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
