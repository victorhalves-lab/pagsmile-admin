import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const SelectionButton = React.forwardRef(({ 
  className, 
  selected, 
  onClick, 
  children, 
  variant = "default",
  type = "button",
  disabled = false,
  size = "default",
  ...props 
}, ref) => {
  const sizeClasses = {
    sm: "px-3 py-2 text-xs",
    default: "px-5 py-4 text-sm",
    lg: "px-6 py-5 text-base"
  };

  return (
    <button
      type={type}
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative flex items-center justify-center text-center transition-all duration-200 border-2 rounded-xl group",
        sizeClasses[size],
        "font-semibold",
        selected 
          ? "border-[#2bc196] bg-[#2bc196]/10 text-[#2bc196] shadow-lg shadow-[#2bc196]/10" 
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      {selected && variant === "default" && (
        <div className="absolute top-2 right-2">
           <div className="w-5 h-5 rounded-full bg-[#2bc196] flex items-center justify-center shadow-sm">
             <Check className="w-3 h-3 text-white stroke-[3]" />
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