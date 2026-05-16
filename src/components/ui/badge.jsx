import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

/**
 * Badge · V7 Design System
 * Paleta sóbria: emerald/sky/amber/rose/slate
 * Sem gradientes. Border + bg com opacidade controlada.
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-pag-mint-200 bg-pag-mint-50 text-pag-mint-700 hover:bg-pag-mint-100 dark:border-pag-mint-500/30 dark:bg-pag-mint-500/12 dark:text-pag-mint-300",
        secondary:
          "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-pag-navy-600 dark:bg-pag-navy-700 dark:text-slate-300",
        destructive:
          "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400",
        success:
          "border-pag-mint-200 bg-pag-mint-50 text-pag-mint-700 dark:border-pag-mint-500/30 dark:bg-pag-mint-500/12 dark:text-pag-mint-300",
        warning:
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400",
        info:
          "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400",
        brand:
          "border-pag-navy-200 bg-pag-navy-50 text-pag-navy-700 dark:border-pag-mint-500/30 dark:bg-pag-mint-500/12 dark:text-pag-mint-300",
        outline:
          "text-slate-600 border-slate-200 hover:bg-pag-mint-50 hover:text-pag-mint-700 hover:border-pag-mint-200 dark:text-slate-400 dark:border-pag-navy-600 dark:hover:bg-pag-mint-500/10 dark:hover:text-pag-mint-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }