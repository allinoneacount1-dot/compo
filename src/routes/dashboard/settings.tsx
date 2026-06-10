"use client";

import { useState, useCallback } from "react";
import {
  Settings,
  Palette,
  Bell,
  Wallet,
  Shield,
  Code,
  Database,
  ToggleLeft,
  ToggleRight,
  Save,
  Trash2,
  Download,
  AlertTriangle,
  Check,
  X,
  Plus,
  ExternalLink,
  RefreshCw,
  Clock,
  Eye,
  EyeOff,
  Zap,
  Server,
  FileText,
  HardDrive,
} from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { cn } from "../../lib/utils/cn";

// ─── Types ───

type SettingsTab =
  | "general"
  | "wallet"
  | "notifications"
  | "api"
  | "appearance"
  | "security"
  | "advanced";

interface GeneralSettings {
  language: string;
  theme: string;
  timezone: string;
  dateFormat: string;
  defaultCurrency: string;
  autoRefreshInterval: number;
  densityMode: "standard" | "compact";
}

interface WalletSettings {
  connectedWallets: { name: string; address: string; type: string }[];
  autoConnect: boolean;
  defaultWallet: string;
  slippageTolerance: number;
  priorityFee: string;
}

interface NotificationSettings {
  priceAlertThreshold: number;
  whaleAlertMin: number;
  telegramBotToken: string;
  discordWebhookUrl: string;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

interface ApiSettings {
  heliusApiKey: string;
  quicknodeEndpoint: string;
  rateLimit: number;
  connectionStatus: "connected" | "disconnected" | "testing";
}

interface AppearanceSettings {
  accentColor: string;
  fontSize: number;
  animations: boolean;
  soundEffects: boolean;
  customCss: string;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: string;
}

interface AdvancedSettings {
  debugMode: boolean;
  logLevel: string;
  dbStatus: string;
  dbSize: string;
  dbLastBackup: string;
}

// ─── Constants ───

const TABS: { key: SettingsTab; label: string; icon: typeof Settings }[] = [
  { key: "general", label: "General", icon: Settings },
  { key: "wallet", label: "Wallet", icon: Wallet },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "api", label: "API", icon: Code },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "security", label: "Security", icon: Shield },
  { key: "advanced", label: "Advanced", icon: Database },
];

const ACCENT_COLORS = [
  { name: "green", hex: "#00ff41", label: "Terminal Green" },
  { name: "blue", hex: "#3b82f6", label: "Electric Blue" },
  { name: "purple", hex: "#a855f7", label: "Neon Purple" },
  { name: "pink", hex: "#ec4899", label: "Hot Pink" },
  { name: "gold", hex: "#f59e0b", label: "Signal Gold" },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "id", label: "Bahasa Indonesia" },
  { value: "zh", label: "中文" },
];

const THEMES = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
];

const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "SOL", label: "SOL (◎)" },
  { value: "ETH", label: "ETH (Ξ)" },
];

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Moscow",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Jakarta",
  "Australia/Sydney",
];

const DATE_FORMATS = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];

const SESSION_TIMEOUTS = [
  { value: "15m", label: "15 minutes" },
  { value: "30m", label: "30 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "2h", label: "2 hours" },
  { value: "4h", label: "4 hours" },
  { value: "8h", label: "8 hours" },
  { value: "24h", label: "24 hours" },
  { value: "never", label: "Never" },
];

const LOG_LEVELS = ["error", "warn", "info", "debug", "trace"];

const PRIORITY_FEES = [
  { value: "low", label: "Low (0.0001 SOL)" },
  { value: "medium", label: "Medium (0.001 SOL)" },
  { value: "high", label: "High (0.005 SOL)" },
  { value: "custom", label: "Custom" },
];

const WALLET_TYPES = [
  { value: "phantom", label: "Phantom", icon: "👻" },
  { value: "metamask", label: "MetaMask", icon: "🦊" },
  { value: "walletconnect", label: "WalletConnect", icon: "🔗" },
];

// ─── Toggle Component ───

function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
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

// ─── Section Header ───

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-4">
      <h3 className="font-mono text-sm font-bold text-[#e4e4e7] tracking-wide">
        {title}
      </h3>
      {description && (
        <p className="font-mono text-[10px] text-[#525252] mt-0.5">
          {description}
        </p>
      )}
    </div>
  );
}

// ─── Form Row ───

function FormRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[rgba(255,255,255,0.03)] last:border-b-0">
      <span className="font-mono text-xs text-[#a1a1aa]">{label}</span>
      {children}
    </div>
  );
}

// ─── Confirmation Modal ───

function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  danger,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-[#111113] border border-[rgba(255,255,255,0.08)] rounded-lg p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              danger
                ? "bg-[rgba(239,68,68,0.12)]"
                : "bg-[rgba(59,130,246,0.12)]"
            )}
          >
            <AlertTriangle
              className={cn(
                "w-5 h-5",
                danger ? "text-[#ef4444]" : "text-[#3b82f6]"
              )}
            />
          </div>
          <h3 className="font-mono text-base font-bold text-[#e4e4e7]">
            {title}
          </h3>
        </div>
        <p className="font-mono text-xs text-[#71717a] mb-6 leading-relaxed">
          {message}
        </p>
        <div className="flex items-center justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant={danger ? "danger" : "primary"}
            size="sm"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Wallet Modal ───

function AddWalletModal({
  open,
  onAdd,
  onCancel,
}: {
  open: boolean;
  onAdd: (type: string, name: string) => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-[#111113] border border-[rgba(255,255,255,0.08)] rounded-lg p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-mono text-sm font-bold text-[#e4e4e7]">
            Add Wallet
          </h3>
          <button
            onClick={onCancel}
            className="text-[#525252] hover:text-[#e4e4e7] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2">
          {WALLET_TYPES.map((w) => (
            <button
              key={w.value}
              onClick={() => onAdd(w.value, w.label)}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-[rgba(255,255,255,0.06)] hover:border-[rgba(0,255,65,0.3)] hover:bg-[rgba(0,255,65,0.03)] transition-all duration-150"
            >
              <span className="text-xl">{w.icon}</span>
              <span className="font-mono text-xs text-[#e4e4e7]">
                {w.label}
              </span>
              <Plus className="w-4 h-4 text-[#525252] ml-auto" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    danger: boolean;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    message: "",
    confirmLabel: "",
    danger: false,
    onConfirm: () => {},
  });
  const [addWalletModalOpen, setAddWalletModalOpen] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // General state
  const [general, setGeneral] = useState<GeneralSettings>({
    language: "en",
    theme: "dark",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    defaultCurrency: "USD",
    autoRefreshInterval: 30,
    densityMode: "standard" as const,
  });

  // Wallet state
  const [wallet, setWallet] = useState<WalletSettings>({
    connectedWallets: [
      { name: "Phantom #1", address: "0x7a3F...3f2e", type: "phantom" },
      { name: "Phantom #2", address: "0x9eD1...c7F3", type: "phantom" },
    ],
    autoConnect: true,
    defaultWallet: "0",
    slippageTolerance: 0.5,
    priorityFee: "medium",
  });

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationSettings>({
    priceAlertThreshold: 10,
    whaleAlertMin: 10000,
    telegramBotToken: "",
    discordWebhookUrl: "",
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
  });

  // API state
  const [api, setApi] = useState<ApiSettings>({
    heliusApiKey: "",
    quicknodeEndpoint: "https://your-endpoint.solana-mainnet.quiknode.pro/",
    rateLimit: 100,
    connectionStatus: "disconnected",
  });

  // Appearance state
  const [appearance, setAppearance] = useState<AppearanceSettings>({
    accentColor: "green",
    fontSize: 14,
    animations: true,
    soundEffects: false,
    customCss: "",
  });

  // Security state
  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    sessionTimeout: "1h",
  });

  // Advanced state
  const [advanced, setAdvanced] = useState<AdvancedSettings>({
    debugMode: false,
    logLevel: "info",
    dbStatus: "healthy",
    dbSize: "2.4 MB",
    dbLastBackup: "2026-06-10 03:00 UTC",
  });

  // ─── Save handler ───

  const handleSave = useCallback(() => {
    setSaveStatus("saving");
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(null), 2000);
    }, 600);
  }, []);

  // ─── Confirm modal helpers ───

  const openConfirmModal = useCallback(
    (opts: {
      title: string;
      message: string;
      confirmLabel: string;
      danger: boolean;
      onConfirm: () => void;
    }) => {
      setConfirmModal({ open: true, ...opts });
    },
    []
  );

  const closeConfirmModal = useCallback(() => {
    setConfirmModal((prev) => ({ ...prev, open: false }));
  }, []);

  // ─── Wallet handlers ───

  const handleAddWallet = useCallback((type: string, name: string) => {
    const newWallet = {
      name: `${name} #${wallet.connectedWallets.length + 1}`,
      address: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
      type,
    };
    setWallet((prev) => ({
      ...prev,
      connectedWallets: [...prev.connectedWallets, newWallet],
    }));
    setAddWalletModalOpen(false);
  }, [wallet.connectedWallets.length]);

  const handleRemoveWallet = useCallback((index: number) => {
    setWallet((prev) => ({
      ...prev,
      connectedWallets: prev.connectedWallets.filter((_, i) => i !== index),
    }));
  }, []);

  // ─── API test handler ───

  const handleTestConnection = useCallback(() => {
    setApi((prev) => ({ ...prev, connectionStatus: "testing" }));
    setTimeout(() => {
      setApi((prev) => ({
        ...prev,
        connectionStatus:
          prev.heliusApiKey.length > 0 ? "connected" : "disconnected",
      }));
    }, 1500);
  }, []);

  // ─── Test notification handlers ───

  const handleTestTelegram = useCallback(() => {
    alert("Test notification sent to Telegram!");
  }, []);

  const handleTestDiscord = useCallback(() => {
    alert("Test notification sent to Discord!");
  }, []);

  // ─── Danger actions ───

  const handleResetAll = useCallback(() => {
    openConfirmModal({
      title: "Reset All Settings",
      message:
        "This will reset ALL settings to their default values. This action cannot be undone. Are you sure?",
      confirmLabel: "Reset Everything",
      danger: true,
      onConfirm: () => {
        setGeneral({
          language: "en",
          theme: "dark",
          timezone: "UTC",
          dateFormat: "MM/DD/YYYY",
          defaultCurrency: "USD",
          autoRefreshInterval: 30,
          densityMode: "standard",
        });
        setWallet({
          connectedWallets: [],
          autoConnect: false,
          defaultWallet: "0",
          slippageTolerance: 0.5,
          priorityFee: "medium",
        });
        setNotifications({
          priceAlertThreshold: 10,
          whaleAlertMin: 10000,
          telegramBotToken: "",
          discordWebhookUrl: "",
          quietHoursEnabled: false,
          quietHoursStart: "22:00",
          quietHoursEnd: "08:00",
        });
        setApi({
          heliusApiKey: "",
          quicknodeEndpoint: "",
          rateLimit: 100,
          connectionStatus: "disconnected",
        });
        setAppearance({
          accentColor: "green",
          fontSize: 14,
          animations: true,
          soundEffects: false,
          customCss: "",
        });
        setSecurity({
          twoFactorEnabled: false,
          sessionTimeout: "1h",
        });
        setAdvanced({
          debugMode: false,
          logLevel: "info",
          dbStatus: "healthy",
          dbSize: "2.4 MB",
          dbLastBackup: "2026-06-10 03:00 UTC",
        });
        closeConfirmModal();
      },
    });
  }, [openConfirmModal, closeConfirmModal]);

  const handleClearCache = useCallback(() => {
    openConfirmModal({
      title: "Clear Cache",
      message:
        "This will clear all cached data. You may need to re-enter some settings.",
      confirmLabel: "Clear Cache",
      danger: false,
      onConfirm: () => {
        closeConfirmModal();
        handleSave();
      },
    });
  }, [openConfirmModal, closeConfirmModal, handleSave]);

  const handleClearAllData = useCallback(() => {
    openConfirmModal({
      title: "Clear All Data",
      message:
        "This will permanently delete all local data including alerts, watchlists, and scan history. This action cannot be undone.",
      confirmLabel: "Delete All Data",
      danger: true,
      onConfirm: () => {
        closeConfirmModal();
        handleSave();
      },
    });
  }, [openConfirmModal, closeConfirmModal, handleSave]);

  // ─── Render Save Button ───

  const renderSaveButton = () => (
    <div className="flex items-center justify-between pt-4 mt-4 border-t border-[rgba(255,255,255,0.06)]">
      <div className="h-8 flex items-center">
        {saveStatus === "saving" && (
          <span className="font-mono text-[10px] text-[#f59e0b] flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Saving...
          </span>
        )}
        {saveStatus === "saved" && (
          <span className="font-mono text-[10px] text-[#00ff41] flex items-center gap-1.5">
            <Check className="w-3 h-3" />
            Settings saved successfully
          </span>
        )}
      </div>
      <Button
        variant="primary"
        size="sm"
        icon={<Save className="w-3.5 h-3.5" />}
        onClick={handleSave}
      >
        Save Changes
      </Button>
    </div>
  );

  // ─── Panel Renderers ───

  const renderGeneralPanel = () => (
    <div className="space-y-6">
      <SectionHeader
        title="General Settings"
        description="Configure your terminal preferences"
      />

      <Card>
        <FormRow label="Language">
          <select
            value={general.language}
            onChange={(e) =>
              setGeneral((prev) => ({ ...prev, language: e.target.value }))
            }
            className="h-9 px-3 rounded bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)] text-[#e4e4e7] font-mono text-xs focus:outline-none focus:border-[#3b82f6] transition-colors duration-150 min-w-[180px]"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </FormRow>

        <FormRow label="Theme">
          <select
            value={general.theme}
            onChange={(e) =>
              setGeneral((prev) => ({ ...prev, theme: e.target.value }))
            }
            className="h-9 px-3 rounded bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)] text-[#e4e4e7] font-mono text-xs focus:outline-none focus:border-[#3b82f6] transition-colors duration-150 min-w-[180px]"
          >
            {THEMES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </FormRow>

        <FormRow label="Timezone">
          <select
            value={general.timezone}
            onChange={(e) =>
              setGeneral((prev) => ({ ...prev, timezone: e.target.value }))
            }
            className="h-9 px-3 rounded bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)] text-[#e4e4e7] font-mono text-xs focus:outline-none focus:border-[#3b82f6] transition-colors duration-150 min-w-[180px]"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </FormRow>

        <FormRow label="Date Format">
          <select
            value={general.dateFormat}
            onChange={(e) =>
              setGeneral((prev) => ({ ...prev, dateFormat: e.target.value }))
            }
            className="h-9 px-3 rounded bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)] text-[#e4e4e7] font-mono text-xs focus:outline-none focus:border-[#3b82f6] transition-colors duration-150 min-w-[180px]"
          >
            {DATE_FORMATS.map((df) => (
              <option key={df.value} value={df.value}>
                {df.label}
              </option>
            ))}
          </select>
        </FormRow>

        <FormRow label="Default Currency">
          <select
            value={general.defaultCurrency}
            onChange={(e) =>
              setGeneral((prev) => ({
                ...prev,
                defaultCurrency: e.target.value,
              }))
            }
            className="h-9 px-3 rounded bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)] text-[#e4e4e7] font-mono text-xs focus:outline-none focus:border-[#3b82f6] transition-colors duration-150 min-w-[180px]"
          >
            {CURRENCIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </FormRow>
      </Card>

      <Card>
        <FormRow label="Auto-Refresh Interval">
          <div className="flex items-center gap-3 min-w-[220px]">
            <input
              type="range"
              min={5}
              max={120}
              step={5}
              value={general.autoRefreshInterval}
              onChange={(e) =>
                setGeneral((prev) => ({
                  ...prev,
                  autoRefreshInterval: parseInt(e.target.value),
                }))
              }
              className="flex-1 h-1.5 rounded-full appearance-none bg-[rgba(255,255,255,0.08)] accent-[#00ff41] cursor-pointer"
            />
            <span className="font-mono text-xs text-[#00ff41] w-16 text-right">
              {general.autoRefreshInterval}s
            </span>
          </div>
        </FormRow>

        <FormRow label="Compact Mode">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#525252]">
              {general.densityMode === "compact" ? "Enabled" : "Disabled"}
            </span>
            <Toggle
              enabled={general.densityMode === "compact"}
              onToggle={() =>
                setGeneral((prev) => ({
                  ...prev,
                  densityMode: prev.densityMode === "compact" ? "standard" : "compact",
                }))
              }
            />
          </div>
        </FormRow>
      </Card>

      {renderSaveButton()}
    </div>
  );

  const renderWalletPanel = () => (
    <div className="space-y-6">
      <SectionHeader
        title="Wallet Settings"
        description="Manage connected wallets and transaction preferences"
      />

      <Card>
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs text-[#a1a1aa]">
            Connected Wallets ({wallet.connectedWallets.length})
          </span>
          <Button
            variant="secondary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setAddWalletModalOpen(true)}
          >
            Add Wallet
          </Button>
        </div>
        <div className="space-y-2">
          {wallet.connectedWallets.length === 0 ? (
            <div className="text-center py-6">
              <Wallet className="w-8 h-8 text-[#525252] mx-auto mb-2" />
              <p className="font-mono text-xs text-[#525252]">
                No wallets connected
              </p>
            </div>
          ) : (
            wallet.connectedWallets.map((w, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg border border-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.08)] transition-colors duration-150"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[rgba(0,255,65,0.08)] flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-[#00ff41]" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-[#e4e4e7] font-bold">
                      {w.name}
                    </p>
                    <p className="font-mono text-[10px] text-[#525252]">
                      {w.address}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveWallet(i)}
                  className="text-[#525252] hover:text-[#ef4444] transition-colors duration-150 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card>
        <FormRow label="Auto-Connect">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#525252]">
              {wallet.autoConnect ? "Enabled" : "Disabled"}
            </span>
            <Toggle
              enabled={wallet.autoConnect}
              onToggle={() =>
                setWallet((prev) => ({
                  ...prev,
                  autoConnect: !prev.autoConnect,
                }))
              }
            />
          </div>
        </FormRow>

        <FormRow label="Default Wallet">
          <select
            value={wallet.defaultWallet}
            onChange={(e) =>
              setWallet((prev) => ({
                ...prev,
                defaultWallet: e.target.value,
              }))
            }
            className="h-9 px-3 rounded bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)] text-[#e4e4e7] font-mono text-xs focus:outline-none focus:border-[#3b82f6] transition-colors duration-150 min-w-[180px]"
          >
            {wallet.connectedWallets.map((w, i) => (
              <option key={i} value={String(i)}>
                {w.name} ({w.address})
              </option>
            ))}
            {wallet.connectedWallets.length === 0 && (
              <option value="0">No wallets</option>
            )}
          </select>
        </FormRow>

        <FormRow label="Slippage Tolerance">
          <div className="flex items-center gap-3 min-w-[220px]">
            <input
              type="range"
              min={0.1}
              max={5}
              step={0.1}
              value={wallet.slippageTolerance}
              onChange={(e) =>
                setWallet((prev) => ({
                  ...prev,
                  slippageTolerance: parseFloat(e.target.value),
                }))
              }
              className="flex-1 h-1.5 rounded-full appearance-none bg-[rgba(255,255,255,0.08)] accent-[#00ff41] cursor-pointer"
            />
            <span className="font-mono text-xs text-[#00ff41] w-12 text-right">
              {wallet.slippageTolerance}%
            </span>
          </div>
        </FormRow>

        <FormRow label="Priority Fee">
          <select
            value={wallet.priorityFee}
            onChange={(e) =>
              setWallet((prev) => ({
                ...prev,
                priorityFee: e.target.value,
              }))
            }
            className="h-9 px-3 rounded bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)] text-[#e4e4e7] font-mono text-xs focus:outline-none focus:border-[#3b82f6] transition-colors duration-150 min-w-[180px]"
          >
            {PRIORITY_FEES.map((pf) => (
              <option key={pf.value} value={pf.value}>
                {pf.label}
              </option>
            ))}
          </select>
        </FormRow>
      </Card>

      {renderSaveButton()}
    </div>
  );

  const renderNotificationsPanel = () => (
    <div className="space-y-6">
      <SectionHeader
        title="Notification Settings"
        description="Configure alerts and notification channels"
      />

      <Card>
        <SectionHeader
          title="Alert Thresholds"
          description="Set when you want to be notified"
        />

        <FormRow label="Price Alert Threshold (%)">
          <div className="flex items-center gap-3 min-w-[220px]">
            <input
              type="range"
              min={1}
              max={50}
              step={1}
              value={notifications.priceAlertThreshold}
              onChange={(e) =>
                setNotifications((prev) => ({
                  ...prev,
                  priceAlertThreshold: parseInt(e.target.value),
                }))
              }
              className="flex-1 h-1.5 rounded-full appearance-none bg-[rgba(255,255,255,0.08)] accent-[#00ff41] cursor-pointer"
            />
            <span className="font-mono text-xs text-[#00ff41] w-12 text-right">
              {notifications.priceAlertThreshold}%
            </span>
          </div>
        </FormRow>

        <FormRow label="Whale Alert Minimum ($)">
          <div className="flex items-center gap-2 min-w-[220px]">
            <span className="font-mono text-xs text-[#525252]">$</span>
            <input
              type="number"
              value={notifications.whaleAlertMin}
              onChange={(e) =>
                setNotifications((prev) => ({
                  ...prev,
                  whaleAlertMin: parseInt(e.target.value) || 0,
                }))
              }
              className="flex-1 h-9 px-3 rounded bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)] text-[#e4e4e7] font-mono text-xs focus:outline-none focus:border-[#3b82f6] transition-colors duration-150"
              placeholder="10000"
            />
          </div>
        </FormRow>
      </Card>

      <Card>
        <SectionHeader
          title="Notification Channels"
          description="Connect your notification services"
        />

        <FormRow label="Telegram Bot Token">
          <div className="flex items-center gap-2 min-w-[280px]">
            <Input
              type="password"
              value={notifications.telegramBotToken}
              onChange={(e) =>
                setNotifications((prev) => ({
                  ...prev,
                  telegramBotToken: e.target.value,
                }))
              }
              placeholder="Enter bot token..."
              mono
              className="flex-1"
            />
            <Button
              variant="secondary"
              size="sm"
              icon={<ExternalLink className="w-3.5 h-3.5" />}
              onClick={handleTestTelegram}
            >
              Test
            </Button>
          </div>
        </FormRow>

        <FormRow label="Discord Webhook URL">
          <div className="flex items-center gap-2 min-w-[280px]">
            <Input
              value={notifications.discordWebhookUrl}
              onChange={(e) =>
                setNotifications((prev) => ({
                  ...prev,
                  discordWebhookUrl: e.target.value,
                }))
              }
              placeholder="https://discord.com/api/webhooks/..."
              mono
              className="flex-1"
            />
            <Button
              variant="secondary"
              size="sm"
              icon={<ExternalLink className="w-3.5 h-3.5" />}
              onClick={handleTestDiscord}
            >
              Test
            </Button>
          </div>
        </FormRow>
      </Card>

      <Card>
        <SectionHeader
          title="Quiet Hours"
          description="Pause notifications during specified hours"
        />

        <FormRow label="Enable Quiet Hours">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#525252]">
              {notifications.quietHoursEnabled ? "Enabled" : "Disabled"}
            </span>
            <Toggle
              enabled={notifications.quietHoursEnabled}
              onToggle={() =>
                setNotifications((prev) => ({
                  ...prev,
                  quietHoursEnabled: !prev.quietHoursEnabled,
                }))
              }
            />
          </div>
        </FormRow>

        {notifications.quietHoursEnabled && (
          <>
            <FormRow label="Start Time">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#525252]" />
                <input
                  type="time"
                  value={notifications.quietHoursStart}
                  onChange={(e) =>
                    setNotifications((prev) => ({
                      ...prev,
                      quietHoursStart: e.target.value,
                    }))
                  }
                  className="h-9 px-3 rounded bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)] text-[#e4e4e7] font-mono text-xs focus:outline-none focus:border-[#3b82f6] transition-colors duration-150"
                />
              </div>
            </FormRow>

            <FormRow label="End Time">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#525252]" />
                <input
                  type="time"
                  value={notifications.quietHoursEnd}
                  onChange={(e) =>
                    setNotifications((prev) => ({
                      ...prev,
                      quietHoursEnd: e.target.value,
                    }))
                  }
                  className="h-9 px-3 rounded bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)] text-[#e4e4e7] font-mono text-xs focus:outline-none focus:border-[#3b82f6] transition-colors duration-150"
                />
              </div>
            </FormRow>
          </>
        )}
      </Card>

      {renderSaveButton()}
    </div>
  );

  const renderApiPanel = () => (
    <div className="space-y-6">
      <SectionHeader
        title="API Configuration"
        description="Manage your RPC and API connections"
      />

      <Card>
        <FormRow label="Helius API Key">
          <div className="flex items-center gap-2 min-w-[300px]">
            <div className="relative flex-1">
              <Input
                type={showApiKey ? "text" : "password"}
                value={api.heliusApiKey}
                onChange={(e) =>
                  setApi((prev) => ({
                    ...prev,
                    heliusApiKey: e.target.value,
                  }))
                }
                placeholder="Enter Helius API key..."
                mono
                className="w-full pr-10"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#525252] hover:text-[#e4e4e7] transition-colors"
              >
                {showApiKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </FormRow>

        <FormRow label="QuickNode Endpoint">
          <Input
            value={api.quicknodeEndpoint}
            onChange={(e) =>
              setApi((prev) => ({
                ...prev,
                quicknodeEndpoint: e.target.value,
              }))
            }
            placeholder="https://your-endpoint.solana-mainnet.quiknode.pro/"
            mono
            className="min-w-[300px]"
          />
        </FormRow>
      </Card>

      <Card>
        <SectionHeader
          title="Connection Status"
          description="Monitor your API connections"
        />

        <FormRow label="Status">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                api.connectionStatus === "connected"
                  ? "bg-[#00ff41]"
                  : api.connectionStatus === "testing"
                    ? "bg-[#f59e0b] animate-pulse"
                    : "bg-[#ef4444]"
              )}
            />
            <span
              className={cn(
                "font-mono text-xs capitalize",
                api.connectionStatus === "connected"
                  ? "text-[#00ff41]"
                  : api.connectionStatus === "testing"
                    ? "text-[#f59e0b]"
                    : "text-[#ef4444]"
              )}
            >
              {api.connectionStatus}
            </span>
          </div>
        </FormRow>

        <FormRow label="Rate Limit">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span className="font-mono text-xs text-[#e4e4e7]">
              {api.rateLimit} req/min
            </span>
          </div>
        </FormRow>

        <div className="pt-3">
          <Button
            variant="secondary"
            size="sm"
            icon={
              api.connectionStatus === "testing" ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Server className="w-3.5 h-3.5" />
              )
            }
            onClick={handleTestConnection}
            disabled={api.connectionStatus === "testing"}
          >
            {api.connectionStatus === "testing"
              ? "Testing..."
              : "Test Connection"}
          </Button>
        </div>
      </Card>

      {renderSaveButton()}
    </div>
  );

  const renderAppearancePanel = () => (
    <div className="space-y-6">
      <SectionHeader
        title="Appearance"
        description="Customize the look and feel of your terminal"
      />

      <Card>
        <SectionHeader
          title="Accent Color"
          description="Choose your terminal accent color"
        />
        <div className="flex items-center gap-3 pt-2">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() =>
                setAppearance((prev) => ({
                  ...prev,
                  accentColor: color.name,
                }))
              }
              className={cn(
                "w-10 h-10 rounded-lg border-2 transition-all duration-150",
                appearance.accentColor === color.name
                  ? "border-white scale-110"
                  : "border-transparent hover:border-[rgba(255,255,255,0.2)]"
              )}
              style={{ backgroundColor: color.hex }}
              title={color.label}
            />
          ))}
          <span className="font-mono text-[10px] text-[#525252] ml-2">
            {
              ACCENT_COLORS.find((c) => c.name === appearance.accentColor)
                ?.label
            }
          </span>
        </div>
      </Card>

      <Card>
        <FormRow label="Font Size">
          <div className="flex items-center gap-3 min-w-[220px]">
            <span className="font-mono text-[10px] text-[#525252]">10px</span>
            <input
              type="range"
              min={10}
              max={20}
              step={1}
              value={appearance.fontSize}
              onChange={(e) =>
                setAppearance((prev) => ({
                  ...prev,
                  fontSize: parseInt(e.target.value),
                }))
              }
              className="flex-1 h-1.5 rounded-full appearance-none bg-[rgba(255,255,255,0.08)] accent-[#00ff41] cursor-pointer"
            />
            <span className="font-mono text-[10px] text-[#525252]">20px</span>
            <span className="font-mono text-xs text-[#00ff41] w-10 text-right">
              {appearance.fontSize}px
            </span>
          </div>
        </FormRow>

        <FormRow label="Animations">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#525252]">
              {appearance.animations ? "Enabled" : "Disabled"}
            </span>
            <Toggle
              enabled={appearance.animations}
              onToggle={() =>
                setAppearance((prev) => ({
                  ...prev,
                  animations: !prev.animations,
                }))
              }
            />
          </div>
        </FormRow>

        <FormRow label="Sound Effects">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#525252]">
              {appearance.soundEffects ? "Enabled" : "Disabled"}
            </span>
            <Toggle
              enabled={appearance.soundEffects}
              onToggle={() =>
                setAppearance((prev) => ({
                  ...prev,
                  soundEffects: !prev.soundEffects,
                }))
              }
            />
          </div>
        </FormRow>
      </Card>

      <Card>
        <SectionHeader
          title="Custom CSS"
          description="Add your own custom styles (advanced)"
        />
        <textarea
          value={appearance.customCss}
          onChange={(e) =>
            setAppearance((prev) => ({
              ...prev,
              customCss: e.target.value,
            }))
          }
          placeholder="/* Add your custom CSS here */&#10;.my-custom-class {&#10;  color: #00ff41;&#10;}"
          rows={6}
          className="w-full rounded-lg bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)] text-[#e4e4e7] font-mono text-xs p-3 focus:outline-none focus:border-[#3b82f6] transition-colors duration-150 resize-none placeholder:text-[#525252]"
        />
      </Card>

      {renderSaveButton()}
    </div>
  );

  const renderSecurityPanel = () => (
    <div className="space-y-6">
      <SectionHeader
        title="Security"
        description="Manage your account security and data"
      />

      <Card>
        <FormRow label="Two-Factor Authentication">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#525252]">
              {security.twoFactorEnabled ? "Enabled" : "Disabled"}
            </span>
            <Toggle
              enabled={security.twoFactorEnabled}
              onToggle={() =>
                setSecurity((prev) => ({
                  ...prev,
                  twoFactorEnabled: !prev.twoFactorEnabled,
                }))
              }
            />
          </div>
        </FormRow>

        <FormRow label="Session Timeout">
          <select
            value={security.sessionTimeout}
            onChange={(e) =>
              setSecurity((prev) => ({
                ...prev,
                sessionTimeout: e.target.value,
              }))
            }
            className="h-9 px-3 rounded bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)] text-[#e4e4e7] font-mono text-xs focus:outline-none focus:border-[#3b82f6] transition-colors duration-150 min-w-[180px]"
          >
            {SESSION_TIMEOUTS.map((st) => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </select>
        </FormRow>
      </Card>

      <Card>
        <SectionHeader
          title="Data Management"
          description="Export or clear your data"
        />

        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-xs text-[#e4e4e7]">Export Data</p>
              <p className="font-mono text-[10px] text-[#525252]">
                Download all your settings and data as JSON
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={handleSave}
            >
              Export
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-xs text-[#e4e4e7]">Clear Cache</p>
              <p className="font-mono text-[10px] text-[#525252]">
                Remove cached data and temporary files
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={handleClearCache}
            >
              Clear Cache
            </Button>
          </div>
        </div>
      </Card>

      <Card className="border-[rgba(239,68,68,0.2)]">
        <SectionHeader
          title="Danger Zone"
          description="Irreversible actions — proceed with caution"
        />

        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="font-mono text-xs text-[#ef4444] font-bold">
              Reset All Settings
            </p>
            <p className="font-mono text-[10px] text-[#525252]">
              Restore all settings to their default values
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            icon={<AlertTriangle className="w-3.5 h-3.5" />}
            onClick={handleResetAll}
          >
            Reset All
          </Button>
        </div>
      </Card>

      {renderSaveButton()}
    </div>
  );

  const renderAdvancedPanel = () => (
    <div className="space-y-6">
      <SectionHeader
        title="Advanced"
        description="Developer options and system information"
      />

      <Card>
        <FormRow label="Debug Mode">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#525252]">
              {advanced.debugMode ? "Enabled" : "Disabled"}
            </span>
            <Toggle
              enabled={advanced.debugMode}
              onToggle={() =>
                setAdvanced((prev) => ({
                  ...prev,
                  debugMode: !prev.debugMode,
                }))
              }
            />
          </div>
        </FormRow>

        <FormRow label="Log Level">
          <select
            value={advanced.logLevel}
            onChange={(e) =>
              setAdvanced((prev) => ({
                ...prev,
                logLevel: e.target.value,
              }))
            }
            className="h-9 px-3 rounded bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)] text-[#e4e4e7] font-mono text-xs focus:outline-none focus:border-[#3b82f6] transition-colors duration-150 min-w-[180px]"
          >
            {LOG_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level.toUpperCase()}
              </option>
            ))}
          </select>
        </FormRow>

        <div className="pt-3">
          <Button
            variant="secondary"
            size="sm"
            icon={<FileText className="w-3.5 h-3.5" />}
            onClick={handleSave}
          >
            Export Logs
          </Button>
        </div>
      </Card>

      <Card>
        <SectionHeader
          title="Database Status"
          description="Local database information"
        />

        <FormRow label="Status">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00ff41]" />
            <span className="font-mono text-xs text-[#00ff41]">
              {advanced.dbStatus}
            </span>
          </div>
        </FormRow>

        <FormRow label="Size">
          <div className="flex items-center gap-2">
            <HardDrive className="w-3.5 h-3.5 text-[#525252]" />
            <span className="font-mono text-xs text-[#e4e4e7]">
              {advanced.dbSize}
            </span>
          </div>
        </FormRow>

        <FormRow label="Last Backup">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#525252]" />
            <span className="font-mono text-xs text-[#e4e4e7]">
              {advanced.dbLastBackup}
            </span>
          </div>
        </FormRow>
      </Card>

      <Card className="border-[rgba(239,68,68,0.15)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-xs text-[#ef4444] font-bold">
              Clear All Data
            </p>
            <p className="font-mono text-[10px] text-[#525252]">
              Delete all local data including alerts, watchlists, and history
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={handleClearAllData}
          >
            Clear All Data
          </Button>
        </div>
      </Card>

      {renderSaveButton()}
    </div>
  );

  // ─── Panel Router ───

  const renderPanel = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralPanel();
      case "wallet":
        return renderWalletPanel();
      case "notifications":
        return renderNotificationsPanel();
      case "api":
        return renderApiPanel();
      case "appearance":
        return renderAppearancePanel();
      case "security":
        return renderSecurityPanel();
      case "advanced":
        return renderAdvancedPanel();
      default:
        return renderGeneralPanel();
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 max-w-[1280px]">
        {/* ── Page Header ── */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded bg-[rgba(0,255,65,0.1)] flex items-center justify-center">
            <Settings className="w-5 h-5 text-[#00ff41]" />
          </div>
          <div>
            <h1 className="font-mono text-lg font-bold text-[#e4e4e7] tracking-wide">
              Settings
            </h1>
            <p className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
              COMPO Configuration &bull; Terminal Preferences
            </p>
          </div>
        </div>

        {/* ── Main Layout: Sidebar + Content ── */}
        <div className="flex gap-4">
          {/* Left Sidebar Navigation */}
          <div className="w-[200px] flex-shrink-0">
            <Card className="p-2 sticky top-4">
              <nav className="space-y-0.5">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-150",
                        isActive
                          ? "bg-[rgba(0,255,65,0.08)] text-[#00ff41]"
                          : "text-[#71717a] hover:text-[#e4e4e7] hover:bg-[rgba(255,255,255,0.03)]"
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="font-mono text-xs font-medium">
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Right Content Panel */}
          <div className="flex-1 min-w-0">{renderPanel()}</div>
        </div>
      </div>

      {/* ── Confirmation Modal ── */}
      <ConfirmModal
        open={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        danger={confirmModal.danger}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirmModal}
      />

      {/* ── Add Wallet Modal ── */}
      <AddWalletModal
        open={addWalletModalOpen}
        onAdd={handleAddWallet}
        onCancel={() => setAddWalletModalOpen(false)}
      />
    </DashboardLayout>
  );
}
