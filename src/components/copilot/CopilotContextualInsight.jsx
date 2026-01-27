import React from 'react';
import { Sparkles, ChevronRight, X, Lightbulb, AlertTriangle, TrendingUp, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const insightStyles = {
  alert: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: AlertTriangle,
    iconColor: 'text-amber-600'
  },
  opportunity: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: Lightbulb,
    iconColor: 'text-emerald-600'
  },
  trend: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: TrendingUp,
    iconColor: 'text-blue-600'
  },
  info: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: Info,
    iconColor: 'text-purple-600'
  },
  default: {
    bg: 'bg-gradient-to-r from-primary/5 to-emerald-500/5',
    border: 'border-primary/20',
    icon: Sparkles,
    iconColor: 'text-primary'
  }
};

export default function CopilotContextualInsight({
  type = 'default',
  title,
  description,
  actionLabel,
  onAction,
  onDismiss,
  compact = false,
  className
}) {
  const style = insightStyles[type] || insightStyles.default;
  const Icon = style.icon;

  if (compact) {
    return (
      <div className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg border text-xs",
        style.bg,
        style.border,
        className
      )}>
        <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
        <span className="text-gray-700 flex-1">{description}</span>
        {actionLabel && (
          <Button 
            variant="link" 
            size="sm" 
            className="p-0 h-auto text-primary text-xs"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      "relative p-4 rounded-xl border",
      style.bg,
      style.border,
      className
    )}>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/5 text-gray-400 hover:text-gray-600"
        >
          <X className="w-3 h-3" />
        </button>
      )}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0 pr-4">
          {title && (
            <p className="font-medium text-sm text-gray-900 mb-1">{title}</p>
          )}
          <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
          {actionLabel && (
            <Button 
              variant="link" 
              size="sm" 
              className="p-0 h-auto text-primary text-xs mt-2"
              onClick={onAction}
            >
              {actionLabel} <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}