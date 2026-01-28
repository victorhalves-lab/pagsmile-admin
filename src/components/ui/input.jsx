import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
                "flex h-12 w-full rounded-xl border-2 border-slate-100 bg-slate-50/50 px-4 py-2 text-base shadow-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:border-[#00D26A] focus-visible:ring-4 focus-visible:ring-[#00D26A]/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-slate-300 hover:bg-white dark:bg-slate-900/50 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-slate-600 dark:focus-visible:border-[#00D26A] dark:focus-visible:ring-[#00D26A]/20",
                className
              )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }