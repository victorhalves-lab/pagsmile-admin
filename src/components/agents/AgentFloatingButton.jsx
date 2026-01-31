import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';

export default function AgentFloatingButton({ 
  isOpen, 
  onClick, 
  agentName,
  accentColor = "#2bc196",
  pulseNotification = false
}) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <Button
        onClick={onClick}
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
          isOpen && "rotate-180"
        )}
        style={{ 
          background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
          boxShadow: `0 4px 20px ${accentColor}40`
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
      
      {/* Pulse notification indicator */}
      {pulseNotification && !isOpen && (
        <span className="absolute top-0 right-0 flex h-4 w-4">
          <span 
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: accentColor }}
          />
          <span 
            className="relative inline-flex rounded-full h-4 w-4"
            style={{ backgroundColor: accentColor }}
          />
        </span>
      )}

      {/* Label tooltip */}
      {!isOpen && (
        <div className="absolute bottom-full right-0 mb-2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap">
            {agentName}
          </div>
        </div>
      )}
    </motion.div>
  );
}