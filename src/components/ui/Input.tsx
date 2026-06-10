import type { ReactNode, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  mono?: boolean;
}

export function Input({
  icon,
  mono = false,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className={["relative flex items-center", className].join(" ")}>
      {icon && (
        <span className="absolute left-3 w-4 h-4 flex items-center justify-center text-[#525252] pointer-events-none">
          {icon}
        </span>
      )}
      <input
        className={[
          "w-full h-10 rounded px-3",
          "bg-[#0a0a0b] border border-[rgba(255,255,255,0.08)]",
          "text-[#e4e4e7] placeholder:text-[#525252]",
          "focus:outline-none focus:border-[#3b82f6]",
          "transition-colors duration-150",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          icon ? "pl-10" : "",
          mono ? "font-mono" : "font-sans",
        ].join(" ")}
        {...props}
      />
    </div>
  );
}
