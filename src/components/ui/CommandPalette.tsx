"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, ArrowRight, Zap, Eye, BarChart3, Bell, Trophy, Settings, Activity, Terminal } from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: typeof Search;
  action: () => void;
  category: string;
}

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { isOpen, setIsOpen };
}

export function CommandPalette({ isOpen, onClose, onNavigate }: { isOpen: boolean; onClose: () => void; onNavigate: (route: string) => void }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    { id: "overview", label: "Overview", description: "Dashboard home", icon: Activity, action: () => onNavigate("#/dashboard"), category: "Navigation" },
    { id: "scanner", label: "Scanner", description: "Token security scanner", icon: Search, action: () => onNavigate("#/scanner"), category: "Navigation" },
    { id: "whales", label: "Whale Radar", description: "Live whale tracking", icon: Eye, action: () => onNavigate("#/whales"), category: "Navigation" },
    { id: "sniper", label: "Sniper", description: "Quick snipe execution", icon: Zap, action: () => onNavigate("#/sniper"), category: "Navigation" },
    { id: "portfolio", label: "Portfolio", description: "Holdings & P&L", icon: BarChart3, action: () => onNavigate("#/portfolio"), category: "Navigation" },
    { id: "alerts", label: "Alerts", description: "Price & volume alerts", icon: Bell, action: () => onNavigate("#/alerts"), category: "Navigation" },
    { id: "leaderboard", label: "Leaderboard", description: "Top traders ranking", icon: Trophy, action: () => onNavigate("#/leaderboard"), category: "Navigation" },
    { id: "onchain", label: "On-Chain Intel", description: "Network & smart money", icon: Activity, action: () => onNavigate("#/onchain"), category: "Navigation" },
    { id: "settings", label: "Settings", description: "App preferences", icon: Settings, action: () => onNavigate("#/settings"), category: "Navigation" },
    { id: "terminal", label: "Enter Terminal", description: "Go to dashboard", icon: Terminal, action: () => onNavigate("#/dashboard"), category: "Actions" },
  ];

  const filtered = query
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()) || c.description?.toLowerCase().includes(query.toLowerCase()))
    : commands;

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      filtered[selectedIndex].action();
      onClose();
    }
  }, [filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[560px] bg-[#161616] border border-[#222] rounded-xl shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#222]">
          <Search className="w-5 h-5 text-[#52525b] shrink-0" />
          <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown} placeholder="Search commands, pages, tokens..." className="flex-1 bg-transparent text-sm text-white placeholder:text-[#52525b] focus:outline-none font-mono" />
          <kbd className="px-1.5 py-0.5 rounded bg-[#222] text-[#52525b] text-[10px] font-mono">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[320px] overflow-y-auto py-2">
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center font-mono text-xs text-[#52525b]">No results found</div>
          )}
          {filtered.map((cmd, i) => {
            const Icon = cmd.icon;
            return (
              <button key={cmd.id} onClick={() => { cmd.action(); onClose(); }} className={["w-full flex items-center gap-3 px-4 py-2.5 transition-colors", i === selectedIndex ? "bg-[#00ff9f]/10" : "hover:bg-[#1a1a1a]"].join(" ")}>
                <Icon className="w-4 h-4 text-[#52525b] shrink-0" />
                <div className="flex-1 text-left">
                  <div className="font-mono text-sm text-white">{cmd.label}</div>
                  {cmd.description && <div className="font-mono text-[10px] text-[#52525b]">{cmd.description}</div>}
                </div>
                {i === selectedIndex && <ArrowRight className="w-3 h-3 text-[#00ff9f]" />}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-[#222]">
          <span className="font-mono text-[9px] text-[#52525b]">↑↓ Navigate</span>
          <span className="font-mono text-[9px] text-[#52525b]">↵ Select</span>
          <span className="font-mono text-[9px] text-[#52525b]">ESC Close</span>
        </div>
      </div>
    </div>
  );
}
