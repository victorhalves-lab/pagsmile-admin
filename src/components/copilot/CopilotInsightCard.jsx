import React, { useState } from 'react';
import { Sparkles, ChevronRight, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const insightTypeConfig = {
  alert: {
    icon: AlertTriangle,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconColor: 'text-amber-600',
    badgeClass: 'bg-amber-100 text-amber-700'
  },
  opportunity: {
    icon: Lightbulb,
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    iconColor: 'text-emerald-600',
    badgeClass: 'bg-emerald-100 text-emerald-700'
  },
  trend_up: {
    icon: TrendingUp,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    badgeClass: 'bg-blue-100 text-blue-700'
  },
  trend_down: {
    icon: TrendingDown,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-600',
    badgeClass: 'bg-red-100 text-red-700'
  },
  info: {
    icon: Sparkles,
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-600',
    badgeClass: 'bg-purple-100 text-purple-700'
  }
};

export default function CopilotInsightCard({
  title = "Insights do DIA Copilot",
  insights = [],
  onRefresh,
  onAction,
  loading = false,
  compact = false,
  className
}) {
  const [dismissedInsights, setDismissedInsights] = useState([]);

  const handleDismiss = (index) => {
    setDismissedInsights(prev => [...prev, index]);
  };

  const visibleInsights = insights.filter((_, idx) => !dismissedInsights.includes(idx));

  if (compact) {
    return (
      <div className={cn("bg-gradient-to-r from-primary/5 to-emerald-500/5 rounded-xl border border-primary/20 p-4", className)}>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 mb-1">
              {visibleInsights[0]?.title || "Sem insights no momento"}
            </p>
            <p className="text-xs text-gray-600 line-clamp-2">
              {visibleInsights[0]?.description || "O Copilot está analisando seus dados..."}
            </p>
            {visibleInsights[0]?.action && (
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 h-auto text-primary text-xs mt-1"
                onClick={() => onAction?.(visibleInsights[0].action)}
              >
                {visibleInsights[0].action.label} <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn("border-primary/20 bg-gradient-to-br from-white to-primary/5 overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <p className="text-xs text-gray-500">Análise inteligente dos seus dados</p>
            </div>
          </div>
          {onRefresh && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRefresh}
              disabled={loading}
              className="text-gray-500 hover:text-primary"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-gray-500">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span className="text-sm">Analisando seus dados...</span>
            </div>
          </div>
        ) : visibleInsights.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhum insight disponível no momento</p>
            <p className="text-xs">O Copilot está monitorando seus dados</p>
          </div>
        ) : (
          visibleInsights.map((insight, idx) => {
            const config = insightTypeConfig[insight.type] || insightTypeConfig.info;
            const Icon = config.icon;
            
            return (
              <div 
                key={idx}
                className={cn(
                  "relative p-4 rounded-xl border transition-all hover:shadow-md",
                  config.bgColor,
                  config.borderColor
                )}
              >
                <button 
                  onClick={() => handleDismiss(idx)}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="flex items-start gap-3">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", config.bgColor)}>
                    <Icon className={cn("w-4 h-4", config.iconColor)} />
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-900">{insight.title}</span>
                      {insight.badge && (
                        <Badge className={cn("text-[10px] px-1.5 py-0", config.badgeClass)}>
                          {insight.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
                    {insight.metrics && (
                      <div className="flex items-center gap-4 mb-2">
                        {insight.metrics.map((metric, mIdx) => (
                          <div key={mIdx} className="text-xs">
                            <span className="text-gray-500">{metric.label}: </span>
                            <span className={cn("font-semibold", metric.color || "text-gray-900")}>{metric.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {insight.action && (
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="p-0 h-auto text-primary text-xs"
                        onClick={() => onAction?.(insight.action)}
                      >
                        {insight.action.label} <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}