"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  details?: { label: string; value: string }[];
  confirmLabel?: string;
  danger?: boolean;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  details,
  confirmLabel = "Confirm",
  danger = true,
}: ConfirmModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#161616] border border-[#222] rounded-lg shadow-2xl shadow-black/50 overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-3">
          <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
            {title}
          </h3>
          {description && (
            <p className="mt-2 font-mono text-xs text-[#52525b] leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Details */}
        {details && details.length > 0 && (
          <div className="px-5 pb-4 space-y-1.5">
            <div className="border border-[#222] rounded bg-[#111] p-3">
              {details.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1 first:pt-0 last:pb-0 border-b border-[rgba(255,255,255,0.03)] last:border-b-0"
                >
                  <span className="font-mono text-[10px] text-[#52525b] uppercase tracking-wider">
                    {d.label}
                  </span>
                  <span className="font-mono text-xs text-white">
                    {d.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded font-mono text-xs uppercase tracking-wider border border-[#222] text-[#52525b] hover:text-white hover:border-[#333] transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={[
              "flex-1 h-10 rounded font-mono text-xs font-bold uppercase tracking-wider transition-all duration-150",
              danger
                ? "bg-[#FF3B5C] text-white hover:bg-[#e63550] active:bg-[#cc2e46]"
                : "bg-[#00ff9f] text-black hover:bg-[#00e08f] active:bg-[#00c87e]",
            ].join(" ")}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
