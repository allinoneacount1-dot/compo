import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

type ToastVariant = "success" | "error" | "info";

interface ToastData {
  id: string;
  variant: ToastVariant;
  message: string;
  duration?: number;
}

const variantConfig: Record<ToastVariant, { icon: typeof CheckCircle2; border: string; text: string }> = {
  success: {
    icon: CheckCircle2,
    border: "border-l-[#00FF9F]",
    text: "text-[#00FF9F]",
  },
  error: {
    icon: XCircle,
    border: "border-l-[#FF3B5C]",
    text: "text-[#FF3B5C]",
  },
  info: {
    icon: Info,
    border: "border-l-[#3B82F6]",
    text: "text-[#3B82F6]",
  },
};

const slideVariants = {
  hidden: { opacity: 0, y: -8, x: 0 },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: { type: "spring" as const, damping: 20, stiffness: 300 },
  },
  exit: {
    opacity: 0,
    x: 80,
    transition: { duration: 0.2 },
  },
};

let toastListeners: Array<(toast: ToastData) => void> = [];

function generateId() {
  return `toast_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Call this from anywhere to fire a toast */
export function showToast(variant: ToastVariant, message: string, duration = 4000) {
  const toast: ToastData = { id: generateId(), variant, message, duration };
  toastListeners.forEach((listener) => listener(toast));
}

function ToastItem({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: string) => void }) {
  const { icon: Icon, border, text } = variantConfig[toast.variant];

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration ?? 4000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <motion.div
      layout
      variants={slideVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={[
        "flex items-center gap-3 px-4 py-3 rounded border-l-2",
        "bg-[var(--color-bg-surface)] shadow-[var(--shadow-card)]",
        "max-w-sm w-full pointer-events-auto",
        border,
      ].join(" ")}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 ${text}`} />
      <span className="flex-1 text-sm text-[var(--color-text-primary)] font-medium">
        {toast.message}
      </span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-0.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors flex-shrink-0"
        aria-label="Dismiss toast"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

/** Render this once at the app root to enable toasts */
export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: ToastData) => {
    setToasts((prev) => [...prev, toast]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    toastListeners.push(addToast);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== addToast);
    };
  }, [addToast]);

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
