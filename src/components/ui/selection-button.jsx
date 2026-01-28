import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const SelectionButton = React.forwardRef(({ 
  className, 
  selected, 
  onClick, 
  children, 
  variant = "default", // default (icon check) or simple (just border/bg change)
  type = "button",
  disabled = false,
  ...props 
}, ref) => {
  return (
    <button
      type={type}
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative flex items-center justify-center text-center transition-all duration-200 border-2 rounded-xl group",
        // Base sizes
        "px-4 py-3 text-sm font-semibold",
        // Selected state
        selected 
          ? "border-[#2bc196] bg-[#2bc196]/5 text-[#2bc196] shadow-[0_0_10px_rgba(0,194,149,0.15)]" 
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {selected && variant === "default" && (
        <div className="absolute top-2 right-2 md:static md:mr-2">
           <div className="w-4 h-4 rounded-full bg-[#2bc196] flex items-center justify-center">
             <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
           </div>
        </div>
      )}
      <span className={cn("flex-1", selected ? "font-bold" : "font-medium")}>
        {children}
      </span>
    </button>
  );
});

SelectionButton.displayName = "SelectionButton";

export default SelectionButton;