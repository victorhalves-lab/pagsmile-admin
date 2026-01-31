import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, X, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';

export default function AgentProactiveNotification({ 
  notification,
  onAction,
  onDismiss,
  accentColor = "#2bc196"
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
    }
  }, [notification]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss?.(), 300);
  };

  const handleAction = () => {
    setIsVisible(false);
    setTimeout(() => onAction?.(notification), 300);
  };

  if (!notification) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20, x: 20 }}
          className="fixed bottom-24 right-6 z-30 max-w-sm"
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            style={{ boxShadow: `0 10px 40px ${accentColor}20` }}
          >
            {/* Header */}
            <div 
              className="px-4 py-2 flex items-center justify-between"
              style={{ background: `linear-gradient(135deg, ${accentColor}20, transparent)` }}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: accentColor }}
                >
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {notification.agentName || 'Agente IA'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleDismiss}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>

            {/* Content */}
            <div className="px-4 py-3">
              <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                {notification.title}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {notification.description}
              </p>
            </div>

            {/* Action */}
            <div className="px-4 pb-3">
              <Button
                size="sm"
                className="w-full text-xs"
                style={{ backgroundColor: accentColor }}
                onClick={handleAction}
              >
                {notification.actionLabel || 'Ver detalhes'}
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}