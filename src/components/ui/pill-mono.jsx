import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * PillMono · V7 Design System
 * Pill mono uppercase com letter-spacing wide.
 * Inspirado no .pill do V7 (font JetBrains Mono, 10px, brand-d color).
 *
 * Variants: brand | slate | amber | rose | sky | ink
 */
const variantStyles = {
  brand: "text-emerald-700 bg-emerald-500/[0.14] border-emerald-500/30",
  slate: "text-slate-600 bg-slate-500/10 border-slate-300",
  amber: "text-amber-700 bg-amber-500/[0.14] border-amber-500/30",
  rose: "text-rose-700 bg-rose-500/[0.14] border-rose-500/30",
  sky: "text-sky-700 bg-sky-500/[0.14] border-sky-500/30",
  ink: "text-slate-900 bg-slate-900/5 border-slate-900/15",
};

const PillMono = React.forwardRef(
  ({ className, variant = "brand", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 font-mono uppercase",
          "px-2.5 py-1 rounded-full border",
          "text-[10px] leading-none tracking-[0.06em] font-medium",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
PillMono.displayName = "PillMono";

export { PillMono };