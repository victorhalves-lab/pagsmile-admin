import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-[#2bc196] bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2bc196] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:shadow-[0_0_0_1px_rgba(43,193,150,0.2)] dark:border-[#2bc196]/50 dark:bg-[#002443] dark:ring-offset-[#002443] dark:placeholder:text-slate-400 dark:focus-visible:ring-[#2bc196] shadow-sm",
        className
      )}
      ref={ref}
      {...props} />
  )
})
Input.displayName = "Input"

export { Input }