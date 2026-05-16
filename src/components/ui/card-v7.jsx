import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * CardV7 · Design System V7
 *
 * Card profissional com sombra dupla canônica do V7:
 *   box-shadow: 0 1px 0 rgba(15,23,42,.04), 0 6px 24px -16px rgba(15,23,42,.18)
 *
 * Variantes:
 *  - default  : Branco com border-slate-200
 *  - feature  : Fundo slate-900 (dark feature card)
 *  - brand    : Fundo emerald translúcido
 *  - subtle   : Fundo slate-50 (zona secundária)
 *  - outline  : Apenas border, sem sombra
 */

const variantStyles = {
  default: "bg-white border border-slate-200 shadow-v7-card",
  feature: "bg-slate-900 border border-slate-800 text-white shadow-v7-card",
  brand: "bg-emerald-50/60 border border-emerald-200 shadow-v7-card",
  subtle: "bg-slate-50 border border-slate-200",
  outline: "bg-white border border-slate-200",
};

const CardV7 = React.forwardRef(
  ({ className, variant = "default", interactive = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-card-v7 transition-shadow",
        variantStyles[variant],
        interactive && "hover:shadow-v7-card-hover cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
CardV7.displayName = "CardV7";

const CardV7Header = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-start justify-between gap-3 p-5 pb-3", className)}
    {...props}
  />
));
CardV7Header.displayName = "CardV7Header";

const CardV7Title = React.forwardRef(
  ({ className, eyebrow, children, ...props }, ref) => (
    <div className="min-w-0">
      {eyebrow && (
        <span className="block font-mono uppercase tracking-[0.12em] text-[10px] font-medium text-slate-500 mb-1">
          {eyebrow}
        </span>
      )}
      <h3
        ref={ref}
        className={cn(
          "text-base font-semibold tracking-tight text-slate-900",
          className
        )}
        {...props}
      >
        {children}
      </h3>
    </div>
  )
);
CardV7Title.displayName = "CardV7Title";

const CardV7Description = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-slate-500", className)}
    {...props}
  />
));
CardV7Description.displayName = "CardV7Description";

const CardV7Content = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />
));
CardV7Content.displayName = "CardV7Content";

const CardV7Footer = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between gap-3 px-5 py-3 border-t border-slate-100 text-xs text-slate-500",
      className
    )}
    {...props}
  />
));
CardV7Footer.displayName = "CardV7Footer";

export {
  CardV7,
  CardV7Header,
  CardV7Title,
  CardV7Description,
  CardV7Content,
  CardV7Footer,
};