import React from 'react';
import { Sparkles, ArrowRight, Plug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function PluginRecommendations({ recommendations = [], onSelect }) {
  if (recommendations.length === 0) return null;

  return (
    <div className="rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-50/50 via-white to-blue-50/50 dark:from-violet-500/5 dark:via-slate-900 dark:to-blue-500/5 p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold">Recomendações para você</h3>
          <p className="text-xs text-slate-500">Baseado nas suas integrações atuais</p>
        </div>
        <Badge className="ml-auto bg-violet-100 text-violet-700 border-0 text-[10px]">IA</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {recommendations.slice(0, 3).map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all cursor-pointer"
            onClick={() => onSelect?.(p)}
          >
            <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 border">
              <span className="text-2xl">{p.emoji || '🔌'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{p.name}</p>
              <p className="text-xs text-slate-500 truncate">{p.reason || p.description}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}