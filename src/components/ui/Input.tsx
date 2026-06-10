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
        <span className="absolute left-3 w-4 h-4 flex items-center justify-center text-[#52525b] pointer-events-none">
          {icon}
        </span>
      )}
      <input
        className={[
          "w-full h-10 rounded px-3",
          "bg-[#111] border border-[#222]",
          "text-white placeholder:text-[#52525b]",
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
