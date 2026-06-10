import type { ReactNode } from "react";

/* ─── Context for column configuration ─── */

interface TableContextValue {
  columns: string[];
  dense: boolean;
}

import { createContext, useContext } from "react";

const TableContext = createContext<TableContextValue>({
  columns: [],
  dense: false,
});

/* ─── Table ─── */

interface TableProps {
  children: ReactNode;
  /** CSS grid column track string, e.g. "2fr 1fr 1fr 80px" */
  columns: string;
  dense?: boolean;
  className?: string;
}

export function Table({ children, columns, dense = false, className = "" }: TableProps) {
  return (
    <TableContext.Provider value={{ columns: columns.split(/\s+/), dense }}>
      <div className={["w-full", className].join(" ")}>{children}</div>
    </TableContext.Provider>
  );
}

/* ─── TableHeader ─── */

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

export function TableHeader({ children, className = "" }: TableHeaderProps) {
  const { columns } = useContext(TableContext);

  return (
    <div
      className={[
        "grid gap-2 items-center",
        "text-[#71717a] uppercase text-[10px] font-medium tracking-wider",
        "border-b border-[rgba(255,255,255,0.06)]",
        "px-4 py-2",
        className,
      ].join(" ")}
      style={{ gridTemplateColumns: columns.join(" ") }}
    >
      {children}
    </div>
  );
}

/* ─── TableRow ─── */

interface TableRowProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function TableRow({ children, onClick, className = "" }: TableRowProps) {
  const { columns } = useContext(TableContext);

  return (
    <div
      onClick={onClick}
      className={[
        "grid gap-2 items-center",
        "border-b border-[rgba(255,255,255,0.04)]",
        "px-4 py-3",
        "text-[#e4e4e7] text-sm",
        "transition-colors duration-100",
        onClick ? "cursor-pointer hover:bg-[rgba(255,255,255,0.03)]" : "hover:bg-[rgba(255,255,255,0.02)]",
        className,
      ].join(" ")}
      style={{ gridTemplateColumns: columns.join(" ") }}
    >
      {children}
    </div>
  );
}

/* ─── TableCell ─── */

interface TableCellProps {
  children: ReactNode;
  align?: "left" | "right" | "center";
  mono?: boolean;
  className?: string;
}

export function TableCell({ children, align = "left", mono = false, className = "" }: TableCellProps) {
  const alignClass =
    align === "right"
      ? "text-right justify-self-end"
      : align === "center"
        ? "text-center justify-self-center"
        : "text-left justify-self-start";

  return (
    <div
      className={[
        "truncate min-w-0",
        mono ? "font-mono" : "",
        alignClass,
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
