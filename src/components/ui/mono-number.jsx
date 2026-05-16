import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MonoNumber · V7 Design System
 * Renderiza números/IDs/códigos técnicos em JetBrains Mono com tabular-nums.
 * Padrão Bloomberg-lite do V7.
 *
 * Sizes: xs (10px) | sm (12px) | base (14px) | lg (18px) | xl (24px) | hero (32px) | display (40px)
 */
const sizeStyles = {
  xs: "text-[10px]",
  sm: "text-xs",
  base: "text-sm",
  lg: "text-lg",
  xl: "text-2xl font-semibold",
  hero: "text-[32px] font-bold leading-none",
  display: "text-[40px] font-extrabold leading-none tracking-tight",
};

const MonoNumber = React.forwardRef(
  ({ className, size = "base", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "font-mono tabular-nums",
          sizeStyles[size],
          className
        )}
        style={{ fontVariantNumeric: "tabular-nums" }}
        {...props}
      >
        {children}
      </span>
    );
  }
);
MonoNumber.displayName = "MonoNumber";

export { MonoNumber };