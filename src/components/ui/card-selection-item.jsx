import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

export const CardSelectionItem = ({ 
  selected, 
  onClick, 
  children, 
  className,
  disabled = false
}) => {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={cn(
        "relative group cursor-pointer rounded-2xl border-2 transition-all duration-300 ease-in-out overflow-hidden bg-white dark:bg-slate-800/50",
        selected 
          ? "border-[#00D26A] shadow-[0_4px_20px_-4px_rgba(0,210,106,0.25)] scale-[1.01]" 
          : "border-slate-200 dark:border-slate-700 hover:border-[#00D26A]/50 hover:shadow-lg dark:hover:border-[#00D26A]/30",
        disabled && "opacity-50 cursor-not-allowed grayscale",
        className
      )}
    >
      {/* Conteúdo */}
      <div className="p-4 md:p-6 relative z-10">
        {children}
      </div>

      {/* Indicador de Seleção (Check) */}
      <div
        className={cn(
          "absolute top-0 right-0 p-1.5 rounded-bl-xl transition-all duration-300 transform",
          selected 
            ? "bg-[#00D26A] translate-y-0 translate-x-0" 
            : "translate-x-full -translate-y-full"
        )}
      >
        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
      </div>

      {/* Overlay de Brilho no Hover (apenas se não selecionado) */}
      {!selected && !disabled && (
        <div className="absolute inset-0 bg-[#00D26A]/0 group-hover:bg-[#00D26A]/[0.02] transition-colors duration-300" />
      )}
      
      {/* Borda animada interna (opcional para dar mais destaque) */}
      {selected && (
         <div className="absolute inset-0 border border-[#00D26A] rounded-[14px] opacity-50" />
      )}
    </div>
  );
};