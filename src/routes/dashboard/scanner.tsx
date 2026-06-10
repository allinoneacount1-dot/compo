"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ClipboardCopy,
  Bell,
  Share2,
  BookOpen,
  ExternalLink,
  Globe,
  AtSign,
  AlertTriangle,
  Shield,
  Clock,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Download,
  Filter,
  Lock,
  Unlock,
  Flame,
  Loader2,
  RefreshCw,
  X,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { CountUp } from "../../components/ui/CountUp";
import { ProgressBar } from "../../components/ui/ProgressBar";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
} from "../../components/ui/Table";
import {
  truncateAddress,
  riskLabel,
  timeAgo,
  downloadCSV,
  formatPriceDetailed,
  formatPercent,
  formatNumber,
} from "../../lib/utils/format";
import { cn } from "../../lib/utils/cn";
import { useTokenScanner } from "../../lib/hooks/scanner";
import type { TokenScanResult } from "../../lib/api/honeypot";

// --- Types ---

interface HistoryEntry {
  address: string;
  token: string;
  score: number;
  verdict: string;
  time: string;
  timeDate: Date;
  scanResult: TokenScanResult;
}

type RiskFilter = "all" | "safe" | "caution" | "danger";
type HistorySortField = "time" | "token" | "score" | "verdict";
type SortDir = "asc" | "desc";

// --- Preset Tokens ---

const PRESET_TOKENS = [
  { label: "BONK", address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263" },
  { label: "WIF", address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm" },
  { label: "POPCAT", address: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr" },
  { label: "JUP", address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN" },
];

// --- Helpers ---

function getVerdictVariant(verdict: string) {
  if (verdict === "SAFE" || verdict === "success") return "success" as const;
  if (verdict === "DANGER" || verdict === "danger") return "danger" as const;
  if (verdict === "CAUTION" || verdict === "warning") return "warning" as const;
  return "neutral" as const;
}

function getScoreColorValue(score: number) {
  if (score >= 70) return "#10b981";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

function getScoreTextClass(score: number) {
  if (score >= 70) return "text-[#10b981]";
  if (score >= 40) return "text-[#f59e0b]";
  return "text-[#ef4444]";
}

function getProgressBarColor(score: number): "success" | "warning" | "danger" {
  if (score >= 70) return "success";
  if (score >= 40) return "warning";
  return "danger";
}

// --- RiskGauge Component ---

function RiskGauge({ score }: { score: number }) {
  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const color = getScoreColorValue(score);
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-[152px] h-[152px]">
        <svg
          width={radius * 2 + stroke}
          height={radius * 2 + stroke}
          className="absolute inset-0"
        >
          <circle
            cx={radius + stroke / 2}
            cy={radius + stroke / 2}
            r={normalizedRadius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={stroke}
          />
          <motion.circle
            cx={radius + stroke / 2}
            cy={radius + stroke / 2}
            r={normalizedRadius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            transform={`rotate(-90 ${radius + stroke / 2} ${radius + stroke / 2})`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={["text-4xl font-bold font-mono tabular-nums", getScoreTextClass(score)].join(" ")}>
            <CountUp value={score} duration={1.5} />
          </span>
          <span className="font-mono text-[10px] text-[#525252] mt-0.5">
            /100
          </span>
        </div>
      </div>
      <Badge variant={getVerdictVariant(riskLabel(score).toLowerCase())}>
        {riskLabel(score)}
      </Badge>
    </div>
  );
}

// --- Liquidity Lock Badge ---

function LPStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "Locked":
      return (
        <div className="flex items-center gap-1.5 text-[#10b981]">
          <Lock className="w-3.5 h-3.5" />
          <span className="font-mono text-xs font-bold">LOCKED</span>
        </div>
      );
    case "Burned":
      return (
        <div className="flex items-center gap-1.5 text-[#10b981]">
          <Flame className="w-3.5 h-3.5" />
          <span className="font-mono text-xs font-bold">BURNED</span>
        </div>
      );
    case "Partial":
      return (
        <div className="flex items-center gap-1.5 text-[#f59e0b]">
          <Lock className="w-3.5 h-3.5" />
          <span className="font-mono text-xs font-bold">PARTIAL</span>
        </div>
      );
    case "None":
      return (
        <div className="flex items-center gap-1.5 text-[#ef4444]">
          <Unlock className="w-3.5 h-3.5" />
          <span className="font-mono text-xs font-bold">UNLOCKED</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-1.5 text-[#71717a]">
          <Lock className="w-3.5 h-3.5" />
          <span className="font-mono text-xs font-bold">UNKNOWN</span>
        </div>
      );
  }
}

// --- Scanning Progress ---

function ScanningProgress({ progress }: { progress: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col items-center py-12"
    >
      <Loader2 className="w-10 h-10 text-[#00FF9F] animate-spin mb-4" />
      <p className="font-mono text-sm text-[#a1a1aa] mb-1">Scanning Token...</p>
      {progress && (
        <p className="font-mono text-[10px] text-[#525252]">{progress}</p>
      )}
      <div className="flex items-center gap-2 mt-6">
        {["Fetching pair data", "Analyzing contract", "Checking taxes", "Computing risk score"].map(
          (step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.4 }}
              className="flex items-center gap-1"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#00FF9F] animate-pulse" />
              <span className="font-mono text-[9px] text-[#525252]">{step}</span>
            </motion.div>
          )
        )}
      </div>
    </motion.div>
  );
}

// --- Main Component ---

export default function TokenScanner() {
  const [scanAddress, setScanAddress] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showBatch, setShowBatch] = useState(false);
  const [batchInput, setBatchInput] = useState("");

  // History filter + sort state
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");
  const [historySortField, setHistorySortField] = useState<HistorySortField>("time");
  const [historySortDir, setHistorySortDir] = useState<SortDir>("desc");

  const { result, isScanning, error, progress, scan, reset } = useTokenScanner();

  const handleScan = useCallback(
    (address?: string) => {
      const target = address || scanAddress;
      if (!target) return;
      setScanAddress(target);
      scan(target);
    },
    [scanAddress, scan]
  );

  const handlePresetClick = (address: string) => {
    setScanAddress(address);
    scan(address);
  };

  // Add to history when scan completes
  const addToHistory = useCallback(() => {
    if (!result) return;
    const entry: HistoryEntry = {
      address: result.address,
      token: result.tokenInfo.symbol,
      score: result.overallScore,
      verdict: riskLabel(result.overallScore),
      time: "Just now",
      timeDate: new Date(),
      scanResult: result,
    };
    setHistory((prev) => [entry, ...prev].slice(0, 50));
  }, [result]);

  // Auto-add to history when result changes
  const prevResultRef = useState<{ address: string } | null>(null);
  if (result && (!prevResultRef[0] || prevResultRef[0].address !== result.address)) {
    prevResultRef[0] = { address: result.address };
    // Use setTimeout to avoid setState during render
    setTimeout(() => {
      setHistory((prev) => {
        const exists = prev.some((e) => e.address === result.address);
        if (exists) return prev;
        return [
          {
            address: result.address,
            token: result.tokenInfo.symbol,
            score: result.overallScore,
            verdict: riskLabel(result.overallScore),
            time: "Just now",
            timeDate: new Date(),
            scanResult: result,
          },
          ...prev,
        ].slice(0, 50);
      });
    }, 0);
  }

  const handleHistoryClick = (entry: HistoryEntry) => {
    setScanAddress(entry.address);
    // We don't re-scan, just show the cached result
    // The scan hook doesn't support setting result directly, so we re-scan
    scan(entry.address);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
  };

  const handleBatchScan = useCallback(() => {
    const addresses = batchInput
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (addresses.length === 0) return;
    // Scan the first one in the main view
    setScanAddress(addresses[0]);
    scan(addresses[0]);
    setShowBatch(false);
    setBatchInput("");
  }, [batchInput, scan]);

  // Filtered + sorted history
  const filteredHistory = useMemo(() => {
    const filtered =
      riskFilter === "all"
        ? history
        : history.filter((entry) => {
            if (riskFilter === "safe") return entry.verdict === "SAFE";
            if (riskFilter === "caution") return entry.verdict === "CAUTION";
            if (riskFilter === "danger") return entry.verdict === "DANGER";
            return true;
          });
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (historySortField) {
        case "time":
          cmp = a.timeDate.getTime() - b.timeDate.getTime();
          break;
        case "token":
          cmp = a.token.localeCompare(b.token);
          break;
        case "score":
          cmp = a.score - b.score;
          break;
        case "verdict":
          cmp = a.verdict.localeCompare(b.verdict);
          break;
      }
      return historySortDir === "asc" ? cmp : -cmp;
    });
  }, [history, riskFilter, historySortField, historySortDir]);

  const handleExportHistory = useCallback(() => {
    downloadCSV(
      `compo-scanner-history-${new Date().toISOString().slice(0, 10)}.csv`,
      ["Address", "Token", "Risk Score", "Verdict", "Time"],
      filteredHistory.map((e) => [
        e.address,
        e.token,
        e.score.toString(),
        e.verdict,
        e.time,
      ])
    );
  }, [filteredHistory]);

  const handleHistorySort = useCallback(
    (field: HistorySortField) => {
      if (historySortField === field) {
        setHistorySortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setHistorySortField(field);
        setHistorySortDir("desc");
      }
    },
    [historySortField]
  );

  return (
    <div className="p-3 space-y-3 max-w-[1200px]">
      {/* -- 1. Scan Input -- */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-3.5 h-3.5 text-[#3b82f6]" />
          <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
            Token Security Scanner
          </span>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              icon={<Search className="w-4 h-4" />}
              mono
              placeholder="Enter Solana token address (e.g., DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263)"
              value={scanAddress}
              onChange={(e) => setScanAddress(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleScan();
              }}
            />
          </div>
          <Button
            variant="primary"
            size="lg"
            loading={isScanning}
            onClick={() => handleScan()}
          >
            {isScanning ? "SCANNING..." : "SCAN"}
          </Button>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#525252]">
              Try:
            </span>
            {PRESET_TOKENS.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                size="sm"
                onClick={() => handlePresetClick(preset.address)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <button
            onClick={() => setShowBatch(!showBatch)}
            className="flex items-center gap-1 text-[#3b82f6] hover:text-[#60a5fa] transition-colors font-mono text-[10px]"
          >
            Batch Scan
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Batch Scan Input */}
        <AnimatePresence>
          {showBatch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.06)]">
                <textarea
                  value={batchInput}
                  onChange={(e) => setBatchInput(e.target.value)}
                  placeholder="Enter multiple addresses (one per line, max 5)"
                  className="w-full h-24 px-3 py-2 rounded bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)] text-[#e4e4e7] font-mono text-xs placeholder:text-[#525252] focus:outline-none focus:border-[#3b82f6] resize-none"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowBatch(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleBatchScan}>
                    Scan First Token
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* -- Error State -- */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="border-l-[3px] border-l-[#ef4444] bg-[rgba(239,68,68,0.06)]">
              <div className="flex items-start gap-3">
                <XCircle className="w-4 h-4 text-[#ef4444] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-mono text-xs font-bold text-[#ef4444] mb-1">
                    SCAN FAILED
                  </p>
                  <p className="font-mono text-[10px] text-[#a1a1aa]">{error}</p>
                </div>
                <button onClick={reset} className="ml-auto text-[#525252] hover:text-[#a1a1aa]">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -- 2. Scan Results -- */}
      <AnimatePresence mode="wait">
        {isScanning && (
          <Card key="scanning">
            <ScanningProgress progress={progress} />
          </Card>
        )}

        {result && !isScanning && (
          <motion.div
            key="scan-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            {/* Risk Score Gauge */}
            <Card className="flex flex-col items-center py-8">
              <div className="flex items-center gap-2 mb-5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#525252]" />
                <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                  Risk Assessment
                </span>
              </div>
              <RiskGauge score={result.overallScore} />
            </Card>

            {/* Risk Breakdown -- 4 column grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {result.categories.map((cat) => (
                <Card key={cat.label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-[#71717a] uppercase tracking-wider">
                      {cat.label}
                    </span>
                    <span
                      className={[
                        "font-mono text-xs font-bold tabular-nums",
                        getScoreTextClass(cat.score),
                      ].join(" ")}
                    >
                      {cat.score}/100
                    </span>
                  </div>
                  <ProgressBar
                    value={cat.score}
                    color={getProgressBarColor(cat.score)}
                    size="sm"
                    className="mb-3"
                  />
                  <div className="space-y-1.5">
                    {cat.findings.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-1.5 text-[11px]"
                      >
                        <span
                          className={cn(
                            "flex-shrink-0 mt-px",
                            f.positive ? "text-[#10b981]" : "text-[#f59e0b]"
                          )}
                        >
                          {f.positive ? "✅" : "⚠️"}
                        </span>
                        <span
                          className={cn(
                            "font-mono text-[10px] leading-tight",
                            f.positive
                              ? "text-[#71717a]"
                              : "text-[#a1a1aa]"
                          )}
                        >
                          {f.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            {/* Verdict Banner */}
            <Card
              className={cn(
                "border-l-[3px]",
                result.overallScore >= 71
                  ? "border-l-[#10b981] bg-[rgba(16,185,129,0.06)]"
                  : result.overallScore >= 41
                    ? "border-l-[#f59e0b] bg-[rgba(245,158,11,0.06)]"
                    : "border-l-[#ef4444] bg-[rgba(239,68,68,0.06)]"
              )}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">
                    {result.overallScore >= 71 ? "✅" : result.overallScore >= 41 ? "⚠️" : "🚫"}
                  </span>
                  <div>
                    <p
                      className={cn(
                        "font-mono text-xs font-bold mb-1",
                        getScoreTextClass(result.overallScore)
                      )}
                    >
                      VERDICT: {riskLabel(result.overallScore)} --{" "}
                      {result.verdictText}
                    </p>
                    <p className="font-mono text-[10px] text-[#71717a]">
                      Scanned at {result.scanTime.toLocaleTimeString()} *{" "}
                      {truncateAddress(result.address)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<BookOpen className="w-4 h-4" />}
                  >
                    Add to Watchlist
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Bell className="w-4 h-4" />}
                  >
                    Set Alert
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Share2 className="w-4 h-4" />}
                  >
                    Share Report
                  </Button>
                </div>
              </div>
            </Card>

            {/* Honeypot Quick Check + LP Lock */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Honeypot Check */}
              <Card>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-3.5 h-3.5 text-[#3b82f6]" />
                  <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                    Honeypot &amp; Tax Check
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    {
                      label: "Honeypot",
                      pass: result.honeypotCheck ? !result.honeypotCheck.isHoneypot : true,
                      detail: result.honeypotCheck?.isHoneypot ? "DETECTED" : "None",
                    },
                    {
                      label: "Buy Tax",
                      pass: (result.honeypotCheck?.buyTax ?? 0) < 5,
                      detail: `${(result.honeypotCheck?.buyTax ?? 0).toFixed(1)}%`,
                    },
                    {
                      label: "Sell Tax",
                      pass: (result.honeypotCheck?.sellTax ?? 0) < 10,
                      detail: `${(result.honeypotCheck?.sellTax ?? 0).toFixed(1)}%`,
                    },
                    {
                      label: "Transfer Tax",
                      pass: (result.honeypotCheck?.transferTax ?? 0) < 5,
                      detail: `${(result.honeypotCheck?.transferTax ?? 0).toFixed(1)}%`,
                    },
                  ].map((check) => (
                    <div
                      key={check.label}
                      className={cn(
                        "rounded border p-2.5 text-center",
                        check.pass
                          ? "border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.04)]"
                          : "border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.04)]"
                      )}
                    >
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <span
                          className={cn(
                            "w-2 h-2 rounded-full",
                            check.pass ? "bg-[#10b981]" : "bg-[#ef4444]"
                          )}
                        />
                        <span className="font-mono text-[10px] text-[#71717a] uppercase tracking-wider">
                          {check.label}
                        </span>
                      </div>
                      <p
                        className={cn(
                          "font-mono text-xs font-bold",
                          check.pass ? "text-[#10b981]" : "text-[#ef4444]"
                        )}
                      >
                        {check.pass ? "PASS" : "FAIL"}
                      </p>
                      {check.detail && (
                        <p className="font-mono text-[9px] text-[#525252] mt-0.5">
                          {check.detail}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Liquidity Lock Card */}
              <Card>
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="w-3.5 h-3.5 text-[#3b82f6]" />
                  <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                    Liquidity Lock Status
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#71717a] uppercase tracking-wider">
                      Status
                    </span>
                    <LPStatusBadge
                      status={
                        result.honeypotCheck?.liquidityLocked
                          ? result.honeypotCheck.lockPercentage > 80
                            ? "Locked"
                            : "Partial"
                          : "None"
                      }
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-[#71717a] uppercase tracking-wider">
                        Locked
                      </span>
                      <span className="font-mono text-xs text-[#e4e4e7]">
                        {result.honeypotCheck?.lockPercentage?.toFixed(1) ?? 0}%
                      </span>
                    </div>
                    <ProgressBar
                      value={result.honeypotCheck?.lockPercentage ?? 0}
                      color={
                        (result.honeypotCheck?.lockPercentage ?? 0) > 80
                          ? "success"
                          : (result.honeypotCheck?.lockPercentage ?? 0) > 30
                            ? "warning"
                            : "danger"
                      }
                      size="md"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                        Liquidity
                      </span>
                      <p className="font-mono text-xs text-[#e4e4e7] mt-0.5">
                        ${formatNumber(result.tokenInfo.liquidityUsd)}
                      </p>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                        Volume 24h
                      </span>
                      <p className="font-mono text-xs text-[#e4e4e7] mt-0.5">
                        ${formatNumber(result.tokenInfo.volumeH24)}
                      </p>
                    </div>
                  </div>
                  {result.honeypotCheck?.lockDate && (
                    <div>
                      <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                        Unlock Date
                      </span>
                      <p className="font-mono text-xs text-[#f59e0b] mt-0.5">
                        {result.honeypotCheck.lockDate}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Token Info + Similar Contracts Row */}
            <div className="grid lg:grid-cols-2 gap-3">
              {/* Token Info Card */}
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                  <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                    Token Information
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Name & Symbol */}
                  <div>
                    <p className="font-mono text-lg font-bold text-[#e4e4e7]">
                      {result.tokenInfo.name}
                    </p>
                    <Badge variant="info" size="sm">
                      ${result.tokenInfo.symbol}
                    </Badge>
                  </div>

                  {/* Address */}
                  <div>
                    <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                      Contract
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-xs text-[#3b82f6]">
                        {truncateAddress(result.tokenInfo.address)}
                      </span>
                      <button
                        onClick={() => handleCopy(result.tokenInfo.address)}
                        className="text-[#525252] hover:text-[#71717a] transition-colors"
                      >
                        <ClipboardCopy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Price & Change */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                        Price
                      </span>
                      <p className="font-mono text-xs text-[#e4e4e7] mt-0.5">
                        {formatPriceDetailed(result.tokenInfo.priceUsd)}
                      </p>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                        24h Change
                      </span>
                      <p
                        className={cn(
                          "font-mono text-xs mt-0.5",
                          result.tokenInfo.priceChangeH24 >= 0
                            ? "text-[#10b981]"
                            : "text-[#ef4444]"
                        )}
                      >
                        {formatPercent(result.tokenInfo.priceChangeH24)}
                      </p>
                    </div>
                  </div>

                  {/* Market Cap & FDV */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                        Market Cap
                      </span>
                      <p className="font-mono text-xs text-[#e4e4e7] mt-0.5">
                        {result.tokenInfo.marketCap > 0
                          ? `$${formatNumber(result.tokenInfo.marketCap)}`
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                        FDV
                      </span>
                      <p className="font-mono text-xs text-[#e4e4e7] mt-0.5">
                        {result.tokenInfo.fdv > 0
                          ? `$${formatNumber(result.tokenInfo.fdv)}`
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* DEX */}
                  <div>
                    <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                      DEX
                    </span>
                    <p className="font-mono text-xs text-[#e4e4e7] mt-0.5">
                      {result.tokenInfo.dexId}
                    </p>
                  </div>

                  {/* Website */}
                  {result.tokenInfo.info?.websites &&
                    result.tokenInfo.info.websites.length > 0 && (
                      <div>
                        <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                          Website
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Globe className="w-3 h-3 text-[#525252]" />
                          <span className="font-mono text-xs text-[#3b82f6]">
                            {result.tokenInfo.info.websites[0].url}
                          </span>
                          <ExternalLink className="w-3 h-3 text-[#525252]" />
                        </div>
                      </div>
                    )}

                  {/* Socials */}
                  {result.tokenInfo.info?.socials &&
                    result.tokenInfo.info.socials.length > 0 && (
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                          Socials
                        </span>
                        {result.tokenInfo.info.socials.map((s) => (
                          <span
                            key={s.url}
                            className="font-mono text-[10px] text-[#3b82f6] flex items-center gap-1"
                          >
                            {s.type === "twitter" && <AtSign className="w-3 h-3" />}
                            {s.type}
                          </span>
                        ))}
                      </div>
                    )}
                </div>
              </Card>

              {/* Similar Contracts Card */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#f59e0b]" />
                    <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
                      Similar Flagged Contracts
                    </span>
                  </div>
                </div>

                <div className="space-y-0">
                  {/* Header */}
                  <div className="grid grid-cols-[1fr_80px_80px] gap-2 px-3 py-1.5 border-b border-[rgba(255,255,255,0.06)]">
                    {["Address", "Score", "Status"].map((h) => (
                      <span
                        key={h}
                        className="font-mono text-[10px] text-[#525252] uppercase tracking-wider"
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Rows */}
                  {result.similarContracts.length === 0 && (
                    <div className="py-6 text-center">
                      <p className="font-mono text-[10px] text-[#525252]">
                        No similar contracts found
                      </p>
                    </div>
                  )}
                  {result.similarContracts.map((c) => {
                    const statusVariant =
                      c.status === "HONEYPOT"
                        ? "danger"
                        : c.status === "RUGGED"
                          ? "danger"
                          : c.status === "SAFE"
                            ? "success"
                            : "warning";

                    return (
                      <div
                        key={c.address}
                        className="grid grid-cols-[1fr_80px_80px] gap-2 px-3 py-3 border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                      >
                        <span className="font-mono text-xs text-[#3b82f6] truncate">
                          {c.address}
                        </span>
                        <span
                          className={[
                            "font-mono text-xs font-bold tabular-nums",
                            getScoreTextClass(c.score),
                          ].join(" ")}
                        >
                          {c.score}
                        </span>
                        <Badge
                          variant={statusVariant as "danger" | "warning" | "success"}
                          size="sm"
                        >
                          {c.status}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* -- 3. Scan History Table -- */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#525252]" />
            <span className="font-mono text-[10px] text-[#525252] uppercase tracking-wider">
              Recent Scans
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Risk Filter Dropdown */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-3 h-3 text-[#525252]" />
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value as RiskFilter)}
                className="h-7 px-1.5 rounded bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)] text-[#e4e4e7] font-mono text-[10px] focus:outline-none focus:border-[#3b82f6] appearance-none cursor-pointer"
              >
                <option value="all">All</option>
                <option value="safe">Safe</option>
                <option value="caution">Caution</option>
                <option value="danger">Danger</option>
              </select>
            </div>
            <span className="font-mono text-[10px] text-[#525252]">
              {filteredHistory.length} entries
            </span>
            <button
              onClick={handleExportHistory}
              className="flex items-center gap-1 h-7 px-2 rounded bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.2)] text-[#3b82f6] hover:bg-[rgba(59,130,246,0.2)] transition-colors"
            >
              <Download className="w-3 h-3" />
              <span className="font-mono text-[10px] uppercase tracking-wider">CSV</span>
            </button>
          </div>
        </div>

        <Table columns="2fr 1fr 80px 100px 80px">
          <TableHeader>
            <span
              className="cursor-pointer hover:text-[#e4e4e7] transition-colors select-none flex items-center gap-1"
              onClick={() => handleHistorySort("time")}
            >
              Time
              {historySortField === "time" &&
                (historySortDir === "asc" ? (
                  <ChevronUp className="w-3 h-3 text-[#3b82f6]" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-[#3b82f6]" />
                ))}
            </span>
            <span
              className="cursor-pointer hover:text-[#e4e4e7] transition-colors select-none flex items-center gap-1"
              onClick={() => handleHistorySort("token")}
            >
              Token
              {historySortField === "token" &&
                (historySortDir === "asc" ? (
                  <ChevronUp className="w-3 h-3 text-[#3b82f6]" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-[#3b82f6]" />
                ))}
            </span>
            <span
              className="cursor-pointer hover:text-[#e4e4e7] transition-colors select-none flex items-center gap-1"
              onClick={() => handleHistorySort("score")}
            >
              Score
              {historySortField === "score" &&
                (historySortDir === "asc" ? (
                  <ChevronUp className="w-3 h-3 text-[#3b82f6]" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-[#3b82f6]" />
                ))}
            </span>
            <span
              className="cursor-pointer hover:text-[#e4e4e7] transition-colors select-none flex items-center gap-1"
              onClick={() => handleHistorySort("verdict")}
            >
              Verdict
              {historySortField === "verdict" &&
                (historySortDir === "asc" ? (
                  <ChevronUp className="w-3 h-3 text-[#3b82f6]" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-[#3b82f6]" />
                ))}
            </span>
            <span className="text-[#525252]">Actions</span>
          </TableHeader>

          {filteredHistory.length === 0 && (
            <div className="py-8 text-center">
              <Clock className="w-8 h-8 text-[#525252] mx-auto mb-2" />
              <p className="font-mono text-xs text-[#525252]">
                {history.length === 0
                  ? "No scans yet. Enter a token address above to get started."
                  : "No scans match this filter"}
              </p>
            </div>
          )}

          {filteredHistory.map((entry, i) => (
            <TableRow key={`${entry.address}-${i}`} onClick={() => handleHistoryClick(entry)}>
              <TableCell mono>
                <span className="font-mono text-[10px] text-[#525252]">
                  {entry.time}
                </span>
              </TableCell>
              <TableCell>
                <span className="font-mono text-xs text-[#00ff41] font-bold">
                  {entry.token}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={[
                    "font-mono text-xs font-bold tabular-nums",
                    getScoreTextClass(entry.score),
                  ].join(" ")}
                >
                  {entry.score}/100
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={getVerdictVariant(entry.verdict)} size="sm">
                  {entry.verdict}
                </Badge>
              </TableCell>
              <TableCell>
                <button
                  className="font-mono text-[10px] text-[#3b82f6] hover:text-[#60a5fa] transition-colors px-2 py-0.5 rounded border border-[rgba(59,130,246,0.15)] hover:border-[rgba(59,130,246,0.3)]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHistoryClick(entry);
                  }}
                >
                  View
                </button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
}
