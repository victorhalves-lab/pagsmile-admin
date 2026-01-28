import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CardSelectionItem({ 
  icon: Icon, 
  title, 
  description, 
  details, 
  isSelected, 
  onClick,
  className 
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        "relative group cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200 overflow-hidden",
        isSelected 
          ? "border-[#2bc196] bg-[#2bc196]/5 shadow-[0_0_20px_rgba(0,210,106,0.1)]" 
          : "border-slate-100 bg-white hover:border-[#2bc196]/30 hover:shadow-lg hover:shadow-slate-200/50",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300",
          isSelected 
            ? "bg-[#2bc196] text-white shadow-lg shadow-[#2bc196]/30" 
            : "bg-slate-50 text-slate-500 group-hover:bg-[#2bc196]/10 group-hover:text-[#2bc196]"
        )}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className={cn(
              "text-lg font-bold transition-colors",
              isSelected ? "text-slate-900" : "text-slate-700 group-hover:text-slate-900"
            )}>
              {title}
            </h3>
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-[#2bc196] rounded-full p-1"
              >
                <Check className="w-3 h-3 text-white" />
              </motion.div>
            )}
          </div>
          
          <p className="text-slate-500 text-sm mt-1 font-medium">{description}</p>
          
          {details && (
            <div className="mt-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2bc196]/50" />
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{details}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}