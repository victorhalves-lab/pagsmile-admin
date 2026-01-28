import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2bc196] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] dark:focus-visible:ring-offset-[#002443]",
  {
    variants: {
      variant: {
        default:
          "bg-[#2bc196] text-white shadow-lg shadow-[#2bc196]/25 hover:shadow-xl hover:shadow-[#2bc196]/40 hover:bg-[#239b7a] hover:-translate-y-0.5 border border-[#2bc196]/20 dark:shadow-[#2bc196]/10",
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-600 dark:bg-red-900/50 dark:text-red-200 dark:hover:bg-red-900",
        outline:
          "border-2 border-slate-200 bg-transparent text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-slate-600",
        secondary:
          "bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
        ghost: "hover:bg-slate-100 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
        link: "text-[#2bc196] underline-offset-4 hover:underline",
        success: "bg-[#2bc196]/10 text-[#2bc196] hover:bg-[#2bc196]/20 border border-[#2bc196]/20",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }