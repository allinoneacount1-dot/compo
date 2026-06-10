"use client";

import { useState, useCallback } from "react";
import {
  Settings, Palette, Bell, Wallet, Shield, Code, Database,
  ToggleLeft, ToggleRight, Save, Trash2, Download, AlertTriangle,
  Check, X, Plus, ExternalLink, RefreshCw, Eye, EyeOff, Zap, HardDrive,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

type SettingsTab = "general" | "wallet" | "notifications" | "api" | "appearance" | "security" | "advanced";

const TABS: { key: SettingsTab; label: string; icon: typeof Settings }[] = [
  { key: "general", label: "General", icon: Settings },
  { key: "wallet", label: "Wallet", icon: Wallet },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "api", label: "API", icon: Code },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "security", label: "Security", icon: Shield },
  { key: "advanced", label: "Advanced", icon: Database },
];

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={["transition-colors duration-150", enabled ? "text-[#00ff9f]" : "text-[#52525b]"].join(" ")}>
      {enabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
    </button>
  );
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-4">
      <h3 className="font-mono text-sm font-bold text-white tracking-wide">{title}</h3>
      {description && <p className="font-mono text-[10px] text-[#52525b] mt-0.5">{description}</p>}
    </div>
  );
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#222] last:border-b-0">
      <span className="font-mono text-xs text-[#a1a1aa]">{label}</span>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // General
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("dark");
  const [timezone, setTimezone] = useState("UTC");
  const [currency, setCurrency] = useState("USD");
  const [autoRefresh, setAutoRefresh] = useState(30);

  // Wallet
  const [autoConnect, setAutoConnect] = useState(true);
  const [slippage, setSlippage] = useState(0.5);
  const [priorityFee, setPriorityFee] = useState("medium");

  // Notifications
  const [priceThreshold, setPriceThreshold] = useState(10);
  const [whaleMin, setWhaleMin] = useState(10000);
  const [quietHours, setQuietHours] = useState(false);

  // API
  const [heliusKey, setHeliusKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [rateLimit, setRateLimit] = useState(100);

  // Appearance
  const [accentColor, setAccentColor] = useState("#00ff9f");
  const [animations, setAnimations] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);

  // Security
  const [twoFA, setTwoFA] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("1h");

  // Advanced
  const [debugMode, setDebugMode] = useState(false);
  const [logLevel, setLogLevel] = useState("info");

  const handleSave = useCallback(() => {
    setSaveStatus("saving");
    setTimeout(() => { setSaveStatus("saved"); setTimeout(() => setSaveStatus(null), 2000); }, 600);
  }, []);

  const accentColors = [
    { name: "green", hex: "#00ff9f" },
    { name: "blue", hex: "#3b82f6" },
    { name: "purple", hex: "#a855f7" },
    { name: "pink", hex: "#ec4899" },
    { name: "gold", hex: "#f59e0b" },
  ];

  return (
    <div className="p-4 max-w-[1000px]">
      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={["flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-[11px] whitespace-nowrap transition-colors", activeTab === tab.key ? "bg-[#00ff9f]/10 text-[#00ff9f] border border-[#00ff9f]/20" : "text-[#52525b] hover:text-white hover:bg-[#1a1a1a]"].join(" ")}>
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-[#161616] border border-[#222] rounded-xl p-4">
        {activeTab === "general" && (
          <div>
            <SectionHeader title="General Settings" description="Basic application preferences" />
            <FormRow label="Language">
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="h-9 bg-[#111] border border-[#222] rounded-lg px-3 text-sm text-white focus:outline-none focus:border-[#00ff9f]/40 font-mono">
                <option value="en">English</option>
                <option value="id">Bahasa Indonesia</option>
              </select>
            </FormRow>
            <FormRow label="Theme">
              <select value={theme} onChange={(e) => setTheme(e.target.value)} className="h-9 bg-[#111] border border-[#222] rounded-lg px-3 text-sm text-white focus:outline-none focus:border-[#00ff9f]/40 font-mono">
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </FormRow>
            <FormRow label="Timezone">
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="h-9 bg-[#111] border border-[#222] rounded-lg px-3 text-sm text-white focus:outline-none focus:border-[#00ff9f]/40 font-mono">
                <option value="UTC">UTC</option>
                <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </FormRow>
            <FormRow label="Default Currency">
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="h-9 bg-[#111] border border-[#222] rounded-lg px-3 text-sm text-white focus:outline-none focus:border-[#00ff9f]/40 font-mono">
                <option value="USD">USD ($)</option>
                <option value="SOL">SOL (◎)</option>
                <option value="ETH">ETH (Ξ)</option>
              </select>
            </FormRow>
            <FormRow label="Auto-refresh Interval">
              <div className="flex items-center gap-2">
                <input type="range" min="10" max="120" step="10" value={autoRefresh} onChange={(e) => setAutoRefresh(Number(e.target.value))} className="w-32 accent-[#00ff9f]" />
                <span className="font-mono text-xs text-[#a1a1aa] w-12">{autoRefresh}s</span>
              </div>
            </FormRow>
          </div>
        )}

        {activeTab === "wallet" && (
          <div>
            <SectionHeader title="Wallet Settings" description="Manage connected wallets and transaction preferences" />
            <FormRow label="Auto-connect">
              <Toggle enabled={autoConnect} onToggle={() => setAutoConnect(!autoConnect)} />
            </FormRow>
            <FormRow label="Slippage Tolerance">
              <select value={slippage} onChange={(e) => setSlippage(Number(e.target.value))} className="h-9 bg-[#111] border border-[#222] rounded-lg px-3 text-sm text-white focus:outline-none focus:border-[#00ff9f]/40 font-mono">
                <option value="0.5">0.5%</option>
                <option value="1">1%</option>
                <option value="2">2%</option>
                <option value="5">5%</option>
              </select>
            </FormRow>
            <FormRow label="Priority Fee">
              <select value={priorityFee} onChange={(e) => setPriorityFee(e.target.value)} className="h-9 bg-[#111] border border-[#222] rounded-lg px-3 text-sm text-white focus:outline-none focus:border-[#00ff9f]/40 font-mono">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="turbo">Turbo</option>
              </select>
            </FormRow>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-[#52525b]">Connected Wallets</span>
                <button className="flex items-center gap-1 text-[10px] text-[#00ff9f] hover:text-white transition-colors"><Plus className="w-3 h-3" /> Add</button>
              </div>
              <div className="space-y-2">
                {["Phantom #1 — 0x7a3F...3f2e", "Phantom #2 — 0x9eD1...c7F3"].map((w, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#111] rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">👻</span>
                      <span className="font-mono text-xs text-white">{w}</span>
                    </div>
                    <button className="text-[#52525b] hover:text-[#ff3b5c] transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div>
            <SectionHeader title="Notification Settings" description="Configure alerts and notifications" />
            <FormRow label="Price Alert Threshold">
              <div className="flex items-center gap-2">
                <input type="number" value={priceThreshold} onChange={(e) => setPriceThreshold(Number(e.target.value))} className="h-9 w-20 bg-[#111] border border-[#222] rounded-lg px-3 text-sm text-white focus:outline-none focus:border-[#00ff9f]/40 font-mono" />
                <span className="font-mono text-[10px] text-[#52525b]">%</span>
              </div>
            </FormRow>
            <FormRow label="Whale Alert Minimum">
              <div className="flex items-center gap-2">
                <input type="number" value={whaleMin} onChange={(e) => setWhaleMin(Number(e.target.value))} className="h-9 w-24 bg-[#111] border border-[#222] rounded-lg px-3 text-sm text-white focus:outline-none focus:border-[#00ff9f]/40 font-mono" />
                <span className="font-mono text-[10px] text-[#52525b]">USD</span>
              </div>
            </FormRow>
            <FormRow label="Quiet Hours">
              <Toggle enabled={quietHours} onToggle={() => setQuietHours(!quietHours)} />
            </FormRow>
          </div>
        )}

        {activeTab === "api" && (
          <div>
            <SectionHeader title="API Configuration" description="Manage API keys and endpoints" />
            <FormRow label="Helius API Key">
              <div className="flex items-center gap-2">
                <input type={showKey ? "text" : "password"} value={heliusKey} onChange={(e) => setHeliusKey(e.target.value)} placeholder="Enter API key..." className="h-9 w-64 bg-[#111] border border-[#222] rounded-lg px-3 text-sm text-white placeholder:text-[#52525b] focus:outline-none focus:border-[#00ff9f]/40 font-mono" />
                <button onClick={() => setShowKey(!showKey)} className="text-[#52525b] hover:text-white transition-colors">
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </FormRow>
            <FormRow label="Rate Limit">
              <div className="flex items-center gap-2">
                <input type="number" value={rateLimit} onChange={(e) => setRateLimit(Number(e.target.value))} className="h-9 w-20 bg-[#111] border border-[#222] rounded-lg px-3 text-sm text-white focus:outline-none focus:border-[#00ff9f]/40 font-mono" />
                <span className="font-mono text-[10px] text-[#52525b]">req/min</span>
              </div>
            </FormRow>
            <FormRow label="Connection Status">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00ff9f] animate-pulse" />
                <span className="font-mono text-xs text-[#00ff9f]">Connected</span>
              </div>
            </FormRow>
          </div>
        )}

        {activeTab === "appearance" && (
          <div>
            <SectionHeader title="Appearance" description="Customize the look and feel" />
            <FormRow label="Accent Color">
              <div className="flex items-center gap-2">
                {accentColors.map((c) => (
                  <button key={c.name} onClick={() => setAccentColor(c.hex)} className={["w-6 h-6 rounded-full border-2 transition-all", accentColor === c.hex ? "border-white scale-110" : "border-transparent hover:border-[#333]"].join(" ")} style={{ background: c.hex }} />
                ))}
              </div>
            </FormRow>
            <FormRow label="Animations">
              <Toggle enabled={animations} onToggle={() => setAnimations(!animations)} />
            </FormRow>
            <FormRow label="Sound Effects">
              <Toggle enabled={soundEffects} onToggle={() => setSoundEffects(!soundEffects)} />
            </FormRow>
          </div>
        )}

        {activeTab === "security" && (
          <div>
            <SectionHeader title="Security" description="Account security settings" />
            <FormRow label="Two-Factor Auth">
              <Toggle enabled={twoFA} onToggle={() => setTwoFA(!twoFA)} />
            </FormRow>
            <FormRow label="Session Timeout">
              <select value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)} className="h-9 bg-[#111] border border-[#222] rounded-lg px-3 text-sm text-white focus:outline-none focus:border-[#00ff9f]/40 font-mono">
                <option value="15m">15 minutes</option>
                <option value="30m">30 minutes</option>
                <option value="1h">1 hour</option>
                <option value="4h">4 hours</option>
                <option value="24h">24 hours</option>
                <option value="never">Never</option>
              </select>
            </FormRow>
          </div>
        )}

        {activeTab === "advanced" && (
          <div>
            <SectionHeader title="Advanced" description="Debug and system settings" />
            <FormRow label="Debug Mode">
              <Toggle enabled={debugMode} onToggle={() => setDebugMode(!debugMode)} />
            </FormRow>
            <FormRow label="Log Level">
              <select value={logLevel} onChange={(e) => setLogLevel(e.target.value)} className="h-9 bg-[#111] border border-[#222] rounded-lg px-3 text-sm text-white focus:outline-none focus:border-[#00ff9f]/40 font-mono">
                {["error", "warn", "info", "debug", "trace"].map((l) => (
                  <option key={l} value={l}>{l.toUpperCase()}</option>
                ))}
              </select>
            </FormRow>
            <FormRow label="Database Status">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00ff9f]" />
                <span className="font-mono text-xs text-[#00ff9f]">Healthy — 2.4 MB</span>
              </div>
            </FormRow>
          </div>
        )}

        {/* Save button */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#222]">
          {saveStatus === "saved" && <span className="font-mono text-xs text-[#00ff9f] flex items-center gap-1"><Check className="w-3 h-3" /> Saved!</span>}
          {saveStatus === "saving" && <span className="font-mono text-xs text-[#52525b]">Saving...</span>}
          <Button variant="primary" size="sm" onClick={handleSave} icon={<Save className="w-3.5 h-3.5" />}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
