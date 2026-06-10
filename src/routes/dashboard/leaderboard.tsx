"use client";

import { useState, useMemo } from "react";
import {
  Trophy,
  Search,
  Download,
  TrendingUp,
  TrendingDown,
  Crown,
  Medal,
  Award,
  BarChart3,
  Target,
  Sparkles,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { cn } from "../../lib/utils/cn";

// ─── Types ───

type LeaderboardTab = "traders" | "snipers" | "yield" | "alltime";
type TimeFilter = "24h" | "7d" | "30d" | "all";

interface Trader {
  id: number;
  rank: number;
  name: string;
  avatar: string;
  winRate: number;
  totalTrades: number;
  pnl24h: number;
  volume: string;
  avgPosition: string;
  favoriteToken: string;
  badges: string[];
  tab: LeaderboardTab[];
}

// ─── Mock Data ───

const traders: Trader[] = [
  {
    id: 1,
    rank: 1,
    name: "SolWhale_Alpha",
    avatar: "SW",
    winRate: 94.2,
    totalTrades: 1847,
    pnl24h: 127.4,
    volume: "$2.4M",
    avgPosition: "$18.2K",
    favoriteToken: "$BONK",
    badges: ["🐋", "📈"],
    tab: ["traders", "alltime"],
  },
  {
    id: 2,
    rank: 2,
    name: "DeFi_Degen_X",
    avatar: "DX",
    winRate: 91.8,
    totalTrades: 2103,
    pnl24h: 98.6,
    volume: "$1.9M",
    avgPosition: "$14.7K",
    favoriteToken: "$WIF",
    badges: ["💎", "📈"],
    tab: ["traders", "alltime"],
  },
  {
    id: 3,
    rank: 3,
    name: "PumpMaster_420",
    avatar: "PM",
    winRate: 89.5,
    totalTrades: 3421,
    pnl24h: 87.3,
    volume: "$3.1M",
    avgPosition: "$9.8K",
    favoriteToken: "$POPCAT",
    badges: ["⚡", "🐋"],
    tab: ["snipers", "alltime"],
  },
  {
    id: 4,
    rank: 4,
    name: "YieldKing_SOL",
    avatar: "YK",
    winRate: 87.1,
    totalTrades: 956,
    pnl24h: 76.8,
    volume: "$890K",
    avgPosition: "$42.1K",
    favoriteToken: "$JUP",
    badges: ["💎", "📈"],
    tab: ["yield", "alltime"],
  },
  {
    id: 5,
    rank: 5,
    name: "SniperBot_Pro",
    avatar: "SB",
    winRate: 85.9,
    totalTrades: 5234,
    pnl24h: 72.1,
    volume: "$1.2M",
    avgPosition: "$5.4K",
    favoriteToken: "$PYTH",
    badges: ["⚡"],
    tab: ["snipers", "alltime"],
  },
  {
    id: 6,
    rank: 6,
    name: "TokenHunter_99",
    avatar: "TH",
    winRate: 84.3,
    totalTrades: 1567,
    pnl24h: 68.5,
    volume: "$740K",
    avgPosition: "$11.3K",
    favoriteToken: "$MOODENG",
    badges: ["🐋"],
    tab: ["traders", "alltime"],
  },
  {
    id: 7,
    rank: 7,
    name: "LiquidityLord",
    avatar: "LL",
    winRate: 82.7,
    totalTrades: 723,
    pnl24h: 61.2,
    volume: "$1.5M",
    avgPosition: "$67.8K",
    favoriteToken: "$RAY",
    badges: ["💎"],
    tab: ["yield", "alltime"],
  },
  {
    id: 8,
    rank: 8,
    name: "FlashLoan_Fury",
    avatar: "FF",
    winRate: 81.4,
    totalTrades: 4102,
    pnl24h: 58.9,
    volume: "$980K",
    avgPosition: "$7.2K",
    favoriteToken: "$BONK",
    badges: ["⚡", "🐋"],
    tab: ["snipers", "alltime"],
  },
  {
    id: 9,
    rank: 9,
    name: "StakeSurgeon",
    avatar: "SS",
    winRate: 80.1,
    totalTrades: 445,
    pnl24h: 54.3,
    volume: "$2.1M",
    avgPosition: "$124K",
    favoriteToken: "$JUP",
    badges: ["💎", "📈"],
    tab: ["yield", "alltime"],
  },
  {
    id: 10,
    rank: 10,
    name: "MemeMogul_777",
    avatar: "MM",
    winRate: 78.6,
    totalTrades: 2890,
    pnl24h: 49.7,
    volume: "$650K",
    avgPosition: "$8.9K",
    favoriteToken: "$WIF",
    badges: ["📈"],
    tab: ["traders", "alltime"],
  },
  {
    id: 11,
    rank: 11,
    name: "ArbArmadillo",
    avatar: "AA",
    winRate: 77.2,
    totalTrades: 6789,
    pnl24h: 45.1,
    volume: "$3.8M",
    avgPosition: "$3.1K",
    favoriteToken: "$PYTH",
    badges: ["⚡"],
    tab: ["snipers", "alltime"],
  },
  {
    id: 12,
    rank: 12,
    name: "FarmFiend_SOL",
    avatar: "FS",
    winRate: 75.8,
    totalTrades: 312,
    pnl24h: 42.6,
    volume: "$1.1M",
    avgPosition: "$89.4K",
    favoriteToken: "$RAY",
    badges: ["💎"],
    tab: ["yield", "alltime"],
  },
  {
    id: 13,
    rank: 13,
    name: "DipBuyer_Dave",
    avatar: "DD",
    winRate: 74.5,
    totalTrades: 1234,
    pnl24h: 38.9,
    volume: "$520K",
    avgPosition: "$15.6K",
    favoriteToken: "$POPCAT",
    badges: ["🐋"],
    tab: ["traders", "alltime"],
  },
  {
    id: 14,
    rank: 14,
    name: "GaslessGuru",
    avatar: "GG",
    winRate: 73.1,
    totalTrades: 3456,
    pnl24h: 35.4,
    volume: "$780K",
    avgPosition: "$6.3K",
    favoriteToken: "$BONK",
    badges: ["⚡"],
    tab: ["snipers", "alltime"],
  },
  {
    id: 15,
    rank: 15,
    name: "VaultViper_X",
    avatar: "VV",
    winRate: 71.9,
    totalTrades: 189,
    pnl24h: 32.8,
    volume: "$1.8M",
    avgPosition: "$156K",
    favoriteToken: "$JUP",
    badges: ["💎", "📈"],
    tab: ["yield", "alltime"],
  },
  {
    id: 16,
    rank: 16,
    name: "RugPull_Radar",
    avatar: "RR",
    winRate: 70.4,
    totalTrades: 2167,
    pnl24h: 29.1,
    volume: "$430K",
    avgPosition: "$9.1K",
    favoriteToken: "$MOODENG",
    badges: ["🐋"],
    tab: ["traders", "alltime"],
  },
  {
    id: 17,
    rank: 17,
    name: "BlockchainBaron",
    avatar: "BB",
    winRate: 69.2,
    totalTrades: 876,
    pnl24h: 26.7,
    volume: "$920K",
    avgPosition: "$34.5K",
    favoriteToken: "$WIF",
    badges: ["📈"],
    tab: ["traders", "alltime"],
  },
  {
    id: 18,
    rank: 18,
    name: "TokenTwister_01",
    avatar: "TT",
    winRate: 68.0,
    totalTrades: 4521,
    pnl24h: 24.3,
    volume: "$560K",
    avgPosition: "$4.8K",
    favoriteToken: "$PYTH",
    badges: ["⚡"],
    tab: ["snipers", "alltime"],
  },
  {
    id: 19,
    rank: 19,
    name: "HarvestHawk",
    avatar: "HH",
    winRate: 66.8,
    totalTrades: 234,
    pnl24h: 21.9,
    volume: "$1.4M",
    avgPosition: "$98.2K",
    favoriteToken: "$RAY",
    badges: ["💎"],
    tab: ["yield", "alltime"],
  },
  {
    id: 20,
    rank: 20,
    name: "MoonshotMike",
    avatar: "MK",
    winRate: 65.5,
    totalTrades: 1678,
    pnl24h: 19.6,
    volume: "$380K",
    avgPosition: "$12.4K",
    favoriteToken: "$BONK",
    badges: [],
    tab: ["traders", "alltime"],
  },
  {
    id: 21,
    rank: 21,
    name: "Solanarch_Sam",
    avatar: "SA",
    winRate: 64.3,
    totalTrades: 567,
    pnl24h: 17.2,
    volume: "$670K",
    avgPosition: "$28.9K",
    favoriteToken: "$POPCAT",
    badges: ["🐋"],
    tab: ["traders", "alltime"],
  },
  {
    id: 22,
    rank: 22,
    name: "ClipClaw_Clip",
    avatar: "CC",
    winRate: 63.1,
    totalTrades: 3890,
    pnl24h: 15.8,
    volume: "$490K",
    avgPosition: "$5.6K",
    favoriteToken: "$WIF",
    badges: ["⚡"],
    tab: ["snipers", "alltime"],
  },
  {
    id: 23,
    rank: 23,
    name: "YieldYodeler",
    avatar: "YY",
    winRate: 61.9,
    totalTrades: 145,
    pnl24h: 14.1,
    volume: "$1.2M",
    avgPosition: "$112K",
    favoriteToken: "$JUP",
    badges: ["💎"],
    tab: ["yield", "alltime"],
  },
  {
    id: 24,
    rank: 24,
    name: "PanicSell_Pete",
    avatar: "PP",
    winRate: 60.7,
    totalTrades: 2345,
    pnl24h: 12.5,
    volume: "$310K",
    avgPosition: "$7.8K",
    favoriteToken: "$MOODENG",
    badges: [],
    tab: ["traders", "alltime"],
  },
  {
    id: 25,
    rank: 25,
    name: "SnipeSurfer_X",
    avatar: "SX",
    winRate: 59.4,
    totalTrades: 4789,
    pnl24h: 10.9,
    volume: "$420K",
    avgPosition: "$3.9K",
    favoriteToken: "$PYTH",
    badges: ["⚡"],
    tab: ["snipers", "alltime"],
  },
  {
    id: 26,
    rank: 26,
    name: "ApeArmy_Alpha",
    avatar: "AE",
    winRate: 58.2,
    totalTrades: 1123,
    pnl24h: 9.3,
    volume: "$540K",
    avgPosition: "$19.7K",
    favoriteToken: "$BONK",
    badges: ["🐋"],
    tab: ["traders", "alltime"],
  },
  {
    id: 27,
    rank: 27,
    name: "FarmFrenzy_0x",
    avatar: "FZ",
    winRate: 57.0,
    totalTrades: 98,
    pnl24h: 7.8,
    volume: "$980K",
    avgPosition: "$145K",
    favoriteToken: "$RAY",
    badges: ["💎"],
    tab: ["yield", "alltime"],
  },
  {
    id: 28,
    rank: 28,
    name: "DegenDolphin",
    avatar: "DL",
    winRate: 55.8,
    totalTrades: 3210,
    pnl24h: 6.4,
    volume: "$280K",
    avgPosition: "$6.1K",
    favoriteToken: "$WIF",
    badges: [],
    tab: ["snipers", "alltime"],
  },
  {
    id: 29,
    rank: 29,
    name: "ProfitPanda_88",
    avatar: "PA",
    winRate: 54.6,
    totalTrades: 876,
    pnl24h: 5.1,
    volume: "$460K",
    avgPosition: "$22.3K",
    favoriteToken: "$POPCAT",
    badges: ["📈"],
    tab: ["traders", "alltime"],
  },
  {
    id: 30,
    rank: 30,
    name: "VaultVulture",
    avatar: "VU",
    winRate: 53.3,
    totalTrades: 67,
    pnl24h: 3.9,
    volume: "$1.6M",
    avgPosition: "$178K",
    favoriteToken: "$JUP",
    badges: ["💎"],
    tab: ["yield", "alltime"],
  },
  {
    id: 31,
    rank: 31,
    name: "BlitzBuyer_42",
    avatar: "BZ",
    winRate: 52.1,
    totalTrades: 5432,
    pnl24h: 2.7,
    volume: "$350K",
    avgPosition: "$4.2K",
    favoriteToken: "$BONK",
    badges: ["⚡"],
    tab: ["snipers", "alltime"],
  },
  {
    id: 32,
    rank: 32,
    name: "TokenTitan_X",
    avatar: "TN",
    winRate: 50.9,
    totalTrades: 1456,
    pnl24h: 1.5,
    volume: "$510K",
    avgPosition: "$16.8K",
    favoriteToken: "$MOODENG",
    badges: [],
    tab: ["traders", "alltime"],
  },
  {
    id: 33,
    rank: 33,
    name: "HarvestHog",
    avatar: "HG",
    winRate: 49.7,
    totalTrades: 112,
    pnl24h: 0.8,
    volume: "$870K",
    avgPosition: "$134K",
    favoriteToken: "$RAY",
    badges: ["💎"],
    tab: ["yield", "alltime"],
  },
  {
    id: 34,
    rank: 34,
    name: "SniperSquid_01",
    avatar: "SQ",
    winRate: 48.5,
    totalTrades: 4123,
    pnl24h: -0.4,
    volume: "$290K",
    avgPosition: "$5.1K",
    favoriteToken: "$PYTH",
    badges: ["⚡"],
    tab: ["snipers", "alltime"],
  },
  {
    id: 35,
    rank: 35,
    name: "MoonBoy_Maxi",
    avatar: "MB",
    winRate: 47.2,
    totalTrades: 2678,
    pnl24h: -1.8,
    volume: "$180K",
    avgPosition: "$8.4K",
    favoriteToken: "$WIF",
    badges: [],
    tab: ["traders", "alltime"],
  },
  {
    id: 36,
    rank: 36,
    name: "YieldYeti",
    avatar: "YT",
    winRate: 46.0,
    totalTrades: 78,
    pnl24h: -2.9,
    volume: "$1.1M",
    avgPosition: "$167K",
    favoriteToken: "$JUP",
    badges: ["💎"],
    tab: ["yield", "alltime"],
  },
  {
    id: 37,
    rank: 37,
    name: "DipDiver_SOL",
    avatar: "DI",
    winRate: 44.8,
    totalTrades: 1890,
    pnl24h: -4.1,
    volume: "$240K",
    avgPosition: "$11.2K",
    favoriteToken: "$BONK",
    badges: [],
    tab: ["traders", "alltime"],
  },
  {
    id: 38,
    rank: 38,
    name: "ClipSniper_X",
    avatar: "CS",
    winRate: 43.6,
    totalTrades: 3567,
    pnl24h: -5.3,
    volume: "$320K",
    avgPosition: "$3.7K",
    favoriteToken: "$POPCAT",
    badges: ["⚡"],
    tab: ["snipers", "alltime"],
  },
  {
    id: 39,
    rank: 39,
    name: "FarmFiasco_0x",
    avatar: "FC",
    winRate: 42.4,
    totalTrades: 45,
    pnl24h: -6.7,
    volume: "$760K",
    avgPosition: "$189K",
    favoriteToken: "$RAY",
    badges: [],
    tab: ["yield", "alltime"],
  },
  {
    id: 40,
    rank: 40,
    name: "RektRonin_420",
    avatar: "RN",
    winRate: 41.1,
    totalTrades: 2345,
    pnl24h: -8.2,
    volume: "$150K",
    avgPosition: "$9.6K",
    favoriteToken: "$MOODENG",
    badges: [],
    tab: ["traders", "alltime"],
  },
  {
    id: 41,
    rank: 41,
    name: "SnipeSloth",
    avatar: "SL",
    winRate: 39.9,
    totalTrades: 4890,
    pnl24h: -9.5,
    volume: "$210K",
    avgPosition: "$4.5K",
    favoriteToken: "$PYTH",
    badges: ["⚡"],
    tab: ["snipers", "alltime"],
  },
  {
    id: 42,
    rank: 42,
    name: "VaultVandal",
    avatar: "VD",
    winRate: 38.7,
    totalTrades: 34,
    pnl24h: -10.8,
    volume: "$920K",
    avgPosition: "$201K",
    favoriteToken: "$JUP",
    badges: [],
    tab: ["yield", "alltime"],
  },
  {
    id: 43,
    rank: 43,
    name: "TokenTortoise",
    avatar: "TO",
    winRate: 37.5,
    totalTrades: 1567,
    pnl24h: -12.1,
    volume: "$190K",
    avgPosition: "$13.4K",
    favoriteToken: "$BONK",
    badges: [],
    tab: ["traders", "alltime"],
  },
  {
    id: 44,
    rank: 44,
    name: "BlitzBungler",
    avatar: "BG",
    winRate: 36.2,
    totalTrades: 5678,
    pnl24h: -13.6,
    volume: "$170K",
    avgPosition: "$2.8K",
    favoriteToken: "$WIF",
    badges: [],
    tab: ["snipers", "alltime"],
  },
  {
    id: 45,
    rank: 45,
    name: "HarvestHazard",
    avatar: "HZ",
    winRate: 35.0,
    totalTrades: 23,
    pnl24h: -15.2,
    volume: "$680K",
    avgPosition: "$215K",
    favoriteToken: "$RAY",
    badges: [],
    tab: ["yield", "alltime"],
  },
  {
    id: 46,
    rank: 46,
    name: "DegenDodo",
    avatar: "DO",
    winRate: 33.8,
    totalTrades: 3456,
    pnl24h: -16.9,
    volume: "$130K",
    avgPosition: "$7.1K",
    favoriteToken: "$POPCAT",
    badges: [],
    tab: ["traders", "alltime"],
  },
  {
    id: 47,
    rank: 47,
    name: "You",
    avatar: "YO",
    winRate: 52.3,
    totalTrades: 234,
    pnl24h: 8.7,
    volume: "$89K",
    avgPosition: "$12.4K",
    favoriteToken: "$BONK",
    badges: ["🐋"],
    tab: ["traders", "alltime"],
  },
  {
    id: 48,
    rank: 48,
    name: "SnipeSparrow",
    avatar: "SP",
    winRate: 31.4,
    totalTrades: 4234,
    pnl24h: -18.4,
    volume: "$110K",
    avgPosition: "$3.2K",
    favoriteToken: "$PYTH",
    badges: [],
    tab: ["snipers", "alltime"],
  },
  {
    id: 49,
    rank: 49,
    name: "FarmFumbler",
    avatar: "FU",
    winRate: 30.1,
    totalTrades: 12,
    pnl24h: -20.1,
    volume: "$540K",
    avgPosition: "$234K",
    favoriteToken: "$JUP",
    badges: [],
    tab: ["yield", "alltime"],
  },
  {
    id: 50,
    rank: 50,
    name: "RugPull_Rookie",
    avatar: "RO",
    winRate: 28.9,
    totalTrades: 1890,
    pnl24h: -22.7,
    volume: "$95K",
    avgPosition: "$5.8K",
    favoriteToken: "$MOODENG",
    badges: [],
    tab: ["traders", "alltime"],
  },
];

// ─── Badge Config ───

const badgeConfig: Record<string, { label: string; color: string }> = {
  "🐋": { label: "Whale Hunter", color: "rgba(59,130,246,0.15)" },
  "⚡": { label: "Fast Sniper", color: "rgba(234,179,8,0.15)" },
  "💎": { label: "Diamond Hands", color: "rgba(168,85,247,0.15)" },
  "📈": { label: "Profit King", color: "rgba(16,185,129,0.15)" },
};

// ─── Tab Config ───

const tabs: { key: LeaderboardTab; label: string; icon: React.ReactNode }[] = [
  { key: "traders", label: "Traders", icon: <BarChart3 className="w-3.5 h-3.5" /> },
  { key: "snipers", label: "Snipers", icon: <Target className="w-3.5 h-3.5" /> },
  { key: "yield", label: "Yield Farmers", icon: <Sparkles className="w-3.5 h-3.5" /> },
  { key: "alltime", label: "All-Time", icon: <Trophy className="w-3.5 h-3.5" /> },
];

const timeFilters: { key: TimeFilter; label: string }[] = [
  { key: "24h", label: "24H" },
  { key: "7d", label: "7D" },
  { key: "30d", label: "30D" },
  { key: "all", label: "All Time" },
];

// ─── Helper Components ───

function AvatarPlaceholder({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-9 h-9 text-xs",
    lg: "w-14 h-14 text-lg",
  };

  const colors = [
    "from-[#00ff41] to-[#00cc33]",
    "from-[#3b82f6] to-[#2563eb]",
    "from-[#a855f7] to-[#7c3aed]",
    "from-[#f59e0b] to-[#d97706]",
    "from-[#ef4444] to-[#dc2626]",
    "from-[#10b981] to-[#059669]",
  ];

  const colorIndex = name.charCodeAt(0) % colors.length;

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center font-bold text-[#030303] flex-shrink-0`}
    >
      {name}
    </div>
  );
}

function PodiumCard({ trader, position }: { trader: Trader; position: 1 | 2 | 3 }) {
  const styles = {
    1: {
      border: "border-[#eab308]",
      glow: "shadow-[0_0_30px_rgba(234,179,8,0.15)]",
      bg: "bg-gradient-to-b from-[rgba(234,179,8,0.08)] to-transparent",
      icon: <Crown className="w-5 h-5 text-[#eab308]" />,
      label: "1ST",
      labelBg: "bg-[#eab308]",
      ring: "ring-2 ring-[#eab308]/30",
    },
    2: {
      border: "border-[#94a3b8]",
      glow: "shadow-[0_0_20px_rgba(148,163,184,0.1)]",
      bg: "bg-gradient-to-b from-[rgba(148,163,184,0.06)] to-transparent",
      icon: <Medal className="w-5 h-5 text-[#94a3b8]" />,
      label: "2ND",
      labelBg: "bg-[#94a3b8]",
      ring: "ring-2 ring-[#94a3b8]/20",
    },
    3: {
      border: "border-[#d97706]",
      glow: "shadow-[0_0_20px_rgba(217,119,6,0.1)]",
      bg: "bg-gradient-to-b from-[rgba(217,119,6,0.06)] to-transparent",
      icon: <Award className="w-5 h-5 text-[#d97706]" />,
      label: "3RD",
      labelBg: "bg-[#d97706]",
      ring: "ring-2 ring-[#d97706]/20",
    },
  };

  const s = styles[position];

  return (
    <div
      className={`relative rounded-lg border ${s.border} ${s.glow} ${s.bg} p-4 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02]`}
    >
      {/* Position Label */}
      <div
        className={`${s.labelBg} text-[#030303] font-mono text-[9px] font-bold px-2 py-0.5 rounded-full mb-3`}
      >
        {s.label}
      </div>

      {/* Crown/Medal Icon */}
      <div className="mb-2">{s.icon}</div>

      {/* Avatar */}
      <div className={`${s.ring} rounded-full mb-3`}>
        <AvatarPlaceholder name={trader.avatar} size="lg" />
      </div>

      {/* Name */}
      <h3 className="font-mono text-sm font-bold text-[#e4e4e7] mb-1 truncate max-w-full">
        {trader.name}
      </h3>

      {/* Badges */}
      <div className="flex gap-1 mb-3">
        {trader.badges.map((badge) => (
          <span
            key={badge}
            className="text-sm"
            title={badgeConfig[badge]?.label}
          >
            {badge}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="w-full space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-mono text-[10px] text-[#525252] uppercase">Win Rate</span>
          <span className="font-mono text-xs font-bold text-[#00ff41]">
            {trader.winRate}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-mono text-[10px] text-[#525252] uppercase">Trades</span>
          <span className="font-mono text-xs text-[#e4e4e7]">
            {trader.totalTrades.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-mono text-[10px] text-[#525252] uppercase">P&L 24h</span>
          <span
            className={`font-mono text-xs font-bold ${
              trader.pnl24h >= 0 ? "text-[#10b981]" : "text-[#ef4444]"
            }`}
          >
            {trader.pnl24h >= 0 ? "+" : ""}
            {trader.pnl24h}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-mono text-[10px] text-[#525252] uppercase">Volume</span>
          <span className="font-mono text-xs text-[#3b82f6]">{trader.volume}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("traders");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("24h");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter traders by tab
  const filteredByTab = useMemo(() => {
    if (activeTab === "alltime") return traders;
    return traders.filter((t) => t.tab.includes(activeTab));
  }, [activeTab]);

  // Filter by search
  const filteredTraders = useMemo(() => {
    if (!searchQuery.trim()) return filteredByTab;
    const q = searchQuery.toLowerCase();
    return filteredByTab.filter((t) => t.name.toLowerCase().includes(q));
  }, [filteredByTab, searchQuery]);

  // Top 3 for podium
  const top3 = filteredTraders.slice(0, 3);

  // Remaining for table (rank 4+)
  const tableRows = filteredTraders.slice(3);

  // Find "You" in the full list
  const yourRank = traders.find((t) => t.name === "You");

  const handleExport = () => {
    const headers = [
      "Rank",
      "Trader",
      "Win Rate",
      "Total Trades",
      "P&L 24h",
      "Volume",
      "Avg Position",
      "Favorite Token",
    ];
    const rows = filteredTraders.map((t) => [
      t.rank,
      t.name,
      `${t.winRate}%`,
      t.totalTrades,
      `${t.pnl24h >= 0 ? "+" : ""}${t.pnl24h}%`,
      t.volume,
      t.avgPosition,
      t.favoriteToken,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compo-leaderboard-${activeTab}-${timeFilter}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
      <div className="p-3 space-y-3">
        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[rgba(0,255,65,0.1)] flex items-center justify-center">
              <Trophy className="w-4 h-4 text-[#00ff41]" />
            </div>
            <div>
              <h1 className="font-mono text-base font-bold text-[#e4e4e7]">
                Leaderboard
              </h1>
              <p className="font-mono text-[10px] text-[#525252]">
                Top performers on Solana
              </p>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[rgba(255,255,255,0.06)] bg-[#0a0a0b] hover:bg-[rgba(255,255,255,0.04)] transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#525252]" />
            <span className="font-mono text-[10px] text-[#71717a] uppercase tracking-wider">
              Export
            </span>
          </button>
        </div>

        {/* ── Tabs + Time Filter + Search ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Tabs */}
          <div className="flex gap-1 bg-[#0a0a0b] rounded-lg p-1 border border-[rgba(255,255,255,0.06)]">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={[
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-[10px] uppercase tracking-wider transition-all duration-200",
                  activeTab === tab.key
                    ? "bg-[rgba(0,255,65,0.12)] text-[#00ff41]"
                    : "text-[#525252] hover:text-[#71717a] hover:bg-[rgba(255,255,255,0.03)]",
                ].join(" ")}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Time Filter */}
          <div className="flex gap-1 bg-[#0a0a0b] rounded-lg p-1 border border-[rgba(255,255,255,0.06)]">
            {timeFilters.map((tf) => (
              <button
                key={tf.key}
                onClick={() => setTimeFilter(tf.key)}
                className={[
                  "px-3 py-1.5 rounded-md font-mono text-[10px] uppercase tracking-wider transition-all duration-200",
                  timeFilter === tf.key
                    ? "bg-[rgba(59,130,246,0.12)] text-[#3b82f6]"
                    : "text-[#525252] hover:text-[#71717a] hover:bg-[rgba(255,255,255,0.03)]",
                ].join(" ")}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#525252]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search traders..."
              className="w-full pl-9 pr-3 py-1.5 rounded-md bg-[#0a0a0b] border border-[rgba(255,255,255,0.06)] font-mono text-xs text-[#e4e4e7] placeholder:text-[#3f3f46] focus:outline-none focus:border-[rgba(0,255,65,0.3)] transition-colors"
            />
          </div>
        </div>

        {/* ── Your Rank Card (Prominent) ── */}
        {yourRank && (
          <Card className="border-[rgba(59,130,246,0.2)] bg-[rgba(59,130,246,0.03)]">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
              <span className="font-mono text-[10px] text-[#3b82f6] uppercase tracking-wider font-bold">
                Your Rank
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Rank Number */}
              <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.2)]">
                <span className="font-mono text-2xl font-bold text-[#3b82f6]">
                  #{yourRank.rank}
                </span>
              </div>

              {/* Trader Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <AvatarPlaceholder name={yourRank.avatar} size="md" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#3b82f6] truncate">
                      {yourRank.name}
                    </span>
                    <Badge variant="info" size="sm">YOU</Badge>
                  </div>
                  <div className="flex gap-1 mt-0.5">
                    {yourRank.badges.map((badge) => (
                      <span
                        key={badge}
                        className="text-xs"
                        title={badgeConfig[badge]?.label}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="hidden sm:grid grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="font-mono text-[9px] text-[#525252] uppercase tracking-wider">Win Rate</p>
                  <p className="font-mono text-sm font-bold text-[#00ff41]">{yourRank.winRate}%</p>
                </div>
                <div className="text-center">
                  <p className="font-mono text-[9px] text-[#525252] uppercase tracking-wider">Trades</p>
                  <p className="font-mono text-sm font-bold text-[#e4e4e7]">{yourRank.totalTrades}</p>
                </div>
                <div className="text-center">
                  <p className="font-mono text-[9px] text-[#525252] uppercase tracking-wider">P&L 24h</p>
                  <p className={cn(
                    "font-mono text-sm font-bold flex items-center justify-center gap-0.5",
                    yourRank.pnl24h >= 0 ? "text-[#10b981]" : "text-[#ef4444]"
                  )}>
                    {yourRank.pnl24h >= 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {yourRank.pnl24h >= 0 ? "+" : ""}{yourRank.pnl24h}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-mono text-[9px] text-[#525252] uppercase tracking-wider">Volume</p>
                  <p className="font-mono text-sm font-bold text-[#3b82f6]">{yourRank.volume}</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* ── Top 3 Podium ── */}
        {top3.length >= 3 && (
          <div className="grid grid-cols-3 gap-3">
            {/* 2nd place - left */}
            <div className="flex items-end justify-center pt-8">
              <PodiumCard trader={top3[1]} position={2} />
            </div>
            {/* 1st place - center */}
            <div className="flex items-end justify-center">
              <PodiumCard trader={top3[0]} position={1} />
            </div>
            {/* 3rd place - right */}
            <div className="flex items-end justify-center pt-12">
              <PodiumCard trader={top3[2]} position={3} />
            </div>
          </div>
        )}

        {/* ── Rankings Table ── */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse" />
              <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                Rankings
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#525252]">
              {filteredTraders.length} traders
            </span>
          </div>

          <div className="overflow-x-auto">
            {/* Table Header */}
            <div className="grid grid-cols-[50px_1fr_80px_90px_90px_80px_100px_100px] gap-2 px-3 py-1.5 border-b border-[rgba(255,255,255,0.06)] min-w-[700px]">
              {[
                "Rank",
                "Trader",
                "Win Rate",
                "Trades",
                "P&L 24h",
                "Volume",
                "Avg Position",
                "Favorite",
              ].map((h) => (
                <span
                  key={h}
                  className="font-mono text-[10px] text-[#525252] uppercase tracking-wider"
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Table Body */}
            <div className="space-y-0">
              {/* Show top 3 in table too if less than 3 in podium */}
              {top3.length < 3 &&
                top3.map((trader) => (
                  <TraderRow key={trader.id} trader={trader} />
                ))}

              {/* Remaining rows */}
              {tableRows.map((trader) => (
                <TraderRow key={trader.id} trader={trader} />
              ))}

              {tableRows.length === 0 && top3.length === 0 && (
                <div className="py-8 text-center">
                  <p className="font-mono text-xs text-[#525252]">
                    No traders found matching &quot;{searchQuery}&quot;
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* ── Achievement Badges Legend ── */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-3.5 h-3.5 text-[#eab308]" />
            <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
              Achievement Badges
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(badgeConfig).map(([emoji, config]) => (
              <div
                key={emoji}
                className="flex items-center gap-2 px-3 py-2 rounded-md border border-[rgba(255,255,255,0.06)] bg-[#030303]"
              >
                <span className="text-lg">{emoji}</span>
                <div>
                  <p className="font-mono text-[10px] font-bold text-[#e4e4e7]">
                    {config.label}
                  </p>
                  <p className="font-mono text-[9px] text-[#525252]">
                    {emoji === "🐋" && ">$500K volume"}
                    {emoji === "⚡" && "<3s entry time"}
                    {emoji === "💎" && "Holds >30 days"}
                    {emoji === "📈" && ">80% win rate"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
  );
}

// ─── Trader Row Component ───

function TraderRow({ trader }: { trader: Trader }) {
  const isTop3 = trader.rank <= 3;

  const rankStyle = isTop3
    ? trader.rank === 1
      ? "text-[#eab308]"
      : trader.rank === 2
        ? "text-[#94a3b8]"
        : "text-[#d97706]"
    : "text-[#525252]";

  const rowBg =
    trader.rank === 1
      ? "bg-[rgba(234,179,8,0.03)]"
      : trader.rank === 2
        ? "bg-[rgba(148,163,184,0.02)]"
        : trader.rank === 3
          ? "bg-[rgba(217,119,6,0.02)]"
          : "";

  return (
    <div
      className={[
        "grid grid-cols-[50px_1fr_80px_90px_90px_80px_100px_100px] gap-2 px-3 py-2.5 border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)] transition-colors min-w-[700px]",
        rowBg,
      ].join(" ")}
    >
      {/* Rank */}
      <div className="flex items-center">
        <span className={`font-mono text-xs font-bold ${rankStyle}`}>
          #{trader.rank}
        </span>
      </div>

      {/* Trader */}
      <div className="flex items-center gap-2 min-w-0">
        <AvatarPlaceholder name={trader.avatar} size="sm" />
        <div className="min-w-0">
          <span className="font-mono text-xs font-bold text-[#e4e4e7] truncate block">
            {trader.name}
          </span>
          <div className="flex gap-1 mt-0.5">
            {trader.badges.map((badge) => (
              <span
                key={badge}
                className="text-[10px] leading-none"
                title={badgeConfig[badge]?.label}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Win Rate */}
      <div className="flex items-center">
        <span
          className={`font-mono text-xs ${
            trader.winRate >= 70
              ? "text-[#00ff41]"
              : trader.winRate >= 50
                ? "text-[#e4e4e7]"
                : "text-[#ef4444]"
          }`}
        >
          {trader.winRate}%
        </span>
      </div>

      {/* Total Trades */}
      <div className="flex items-center">
        <span className="font-mono text-xs text-[#71717a]">
          {trader.totalTrades.toLocaleString()}
        </span>
      </div>

      {/* P&L 24h */}
      <div className="flex items-center">
        <span
          className={`font-mono text-xs font-bold flex items-center gap-0.5 ${
            trader.pnl24h >= 0 ? "text-[#10b981]" : "text-[#ef4444]"
          }`}
        >
          {trader.pnl24h >= 0 ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {trader.pnl24h >= 0 ? "+" : ""}
          {trader.pnl24h}%
        </span>
      </div>

      {/* Volume */}
      <div className="flex items-center">
        <span className="font-mono text-xs text-[#3b82f6]">
          {trader.volume}
        </span>
      </div>

      {/* Avg Position */}
      <div className="flex items-center">
        <span className="font-mono text-xs text-[#71717a]">
          {trader.avgPosition}
        </span>
      </div>

      {/* Favorite Token */}
      <div className="flex items-center">
        <span className="font-mono text-xs text-[#00ff41] font-bold">
          {trader.favoriteToken}
        </span>
      </div>
    </div>
  );
}
