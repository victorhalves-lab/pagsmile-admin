import React from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const SAMPLE_RECS = [
  {
    id: 1,
    type: 'cleanup',
    icon: '🧹',
    title: 'Chave "Old Mobile App" não é usada há 90 dias',
    desc: 'Considere revogar para reduzir superfície de ataque',
    action: 'Revisar chave',
    priority: 'medium',
  },
  {
    id: 2,
    type: 'plugin',
    icon: '🇧🇷',
    title: 'Você tem WooCommerce instalado',
    desc: 'Adicione ContaAzul para fechar fluxo fiscal automático',
    action: 'Ver plugin',
    priority: 'high',
  },
  {
    id: 3,
    type: 'webhook',
    icon: '⚠️',
    title: 'Webhook "CRM Sync" com 12% de falhas hoje',
    desc: 'Helena IA sugere revisar o endpoint receiver',
    action: 'Investigar',
    priority: 'high',
  },
];

export default function AIRecommendationCard({ recommendations = SAMPLE_RECS, onAction, onDismiss }) {
  return (
    <div className="rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-violet-500/5 dark:via-slate-900 dark:to-blue-500/5 p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-sm font-bold">Helena IA · Recomendações</h3>
        <Badge className="bg-violet-100 text-violet-700 border-0 text-[10px]">{recommendations.length} insights</Badge>
      </div>

      <div className="space-y-2">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 hover:shadow-sm transition-all"
          >
            <span className="text-2xl flex-shrink-0">{rec.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{rec.title}</p>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{rec.desc}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  'h-7 text-xs',
                  rec.priority === 'high' && 'border-violet-500/40 text-violet-700'
                )}
                onClick={() => onAction?.(rec)}
              >
                {rec.action} <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onDismiss?.(rec)}>
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}