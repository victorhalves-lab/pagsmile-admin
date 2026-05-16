import * as React from "react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { MonoNumber } from "@/components/ui/mono-number";

/**
 * KPICardV7 · Design System V7
 *
 * Baseado em "KPI Family v5.0" + "KPI Hierarchy" do design system.
 * 5 variantes visuais inspiradas no V7:
 *
 *  - default  : Card branco com sombra dupla canônica (padrão)
 *  - hero     : Destaque máximo, número 40px display
 *  - compact  : Inline para grids densas
 *  - feature  : Fundo slate-900 (escuro) com texto branco
 *  - brand    : Fundo emerald translúcido + border emerald
 *
 * Sizes (controla o número principal):
 *  - sm  : 20px
 *  - md  : 32px (default)
 *  - lg  : 40px (hero)
 */

const DeltaIndicator = ({ value, inverted = false, variant = "default" }) => {
  if (value === undefined || value === null) return null;
  const isPositive = value > 0;
  const isNegative = value < 0;
  const isNeutral = value === 0;

  // inverted: para métricas onde "negativo é bom" (ex: taxa de declínio)
  const good = inverted ? isNegative : isPositive;
  const bad = inverted ? isPositive : isNegative;

  const Icon = isNeutral ? Minus : isPositive ? ArrowUp : ArrowDown;

  const colorByContext = () => {
    if (variant === "feature") {
      // dark bg → tons claros
      if (good) return "text-emerald-300 bg-emerald-500/15 border-emerald-400/20";
      if (bad) return "text-rose-300 bg-rose-500/15 border-rose-400/20";
      return "text-slate-400 bg-white/5 border-white/10";
    }
    if (good) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (bad) return "text-rose-700 bg-rose-50 border-rose-200";
    return "text-slate-600 bg-slate-50 border-slate-200";
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border",
        "font-mono text-[10px] tabular-nums font-semibold",
        colorByContext()
      )}
    >
      <Icon className="w-2.5 h-2.5" strokeWidth={2.5} />
      {Math.abs(value).toFixed(1)}%
    </span>
  );
};

const variantStyles = {
  default: {
    container: "bg-white border border-slate-200 shadow-v7-card",
    label: "text-slate-500",
    title: "text-slate-900",
    sub: "text-slate-500",
  },
  hero: {
    container: "bg-white border border-slate-200 shadow-v7-card",
    label: "text-slate-500",
    title: "text-slate-900",
    sub: "text-slate-500",
  },
  compact: {
    container: "bg-white border border-slate-200 shadow-sm",
    label: "text-slate-500",
    title: "text-slate-900",
    sub: "text-slate-500",
  },
  feature: {
    container: "bg-slate-900 border border-slate-800 text-white shadow-v7-card",
    label: "text-slate-400",
    title: "text-white",
    sub: "text-slate-400",
  },
  brand: {
    container: "bg-emerald-50/60 border border-emerald-200 shadow-v7-card",
    label: "text-emerald-700",
    title: "text-emerald-950",
    sub: "text-emerald-700/80",
  },
};

const sizeStyles = {
  sm: "lg",
  md: "hero",
  lg: "display",
};

const KPICardV7 = React.forwardRef(
  (
    {
      className,
      label,
      value,
      delta,
      deltaInverted = false,
      hint,
      icon: Icon,
      action,
      variant = "default",
      size = "md",
      footer,
      children,
      ...props
    },
    ref
  ) => {
    const styles = variantStyles[variant] || variantStyles.default;
    const numberSize = sizeStyles[size] || sizeStyles.md;

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-card-v7 p-5 transition-shadow hover:shadow-v7-card-hover",
          styles.container,
          className
        )}
        {...props}
      >
        {/* Header: label + icon/action */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            {Icon && (
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0",
                  variant === "feature" ? "text-slate-400" : "text-slate-400"
                )}
              />
            )}
            <span
              className={cn(
                "font-mono uppercase tracking-[0.12em] text-[10px] font-medium truncate",
                styles.label
              )}
            >
              {label}
            </span>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>

        {/* Value + Delta */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <MonoNumber
            size={numberSize}
            className={cn("tracking-tight", styles.title)}
          >
            {value}
          </MonoNumber>
          {delta !== undefined && (
            <DeltaIndicator
              value={delta}
              inverted={deltaInverted}
              variant={variant}
            />
          )}
        </div>

        {/* Hint / subtítulo */}
        {hint && (
          <p className={cn("mt-1.5 text-xs", styles.sub)}>{hint}</p>
        )}

        {/* Slot livre (sparkline, mini-chart, etc) */}
        {children && <div className="mt-3">{children}</div>}

        {/* Footer (CTA discreto, link) */}
        {footer && (
          <div
            className={cn(
              "mt-4 pt-3 border-t text-xs",
              variant === "feature"
                ? "border-slate-800"
                : variant === "brand"
                ? "border-emerald-200"
                : "border-slate-100"
            )}
          >
            {footer}
          </div>
        )}
      </div>
    );
  }
);
KPICardV7.displayName = "KPICardV7";

/**
 * KPIGrid · helper para grid responsiva padrão V7
 */
const KPIGrid = ({ className, cols = 4, children, ...props }) => {
  const colsMap = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
  };
  return (
    <div className={cn("grid gap-4", colsMap[cols], className)} {...props}>
      {children}
    </div>
  );
};

export { KPICardV7, KPIGrid, DeltaIndicator };