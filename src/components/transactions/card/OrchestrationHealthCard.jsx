import React from 'react';
import { Activity, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

/**
 * Saúde da orquestração — qual adquirente está roteando, latência, fallback ativo.
 * DIFERENCIAL vs Stripe (não tem orquestração nativa).
 */
export default function OrchestrationHealthCard() {
  const acquirers = [
    { name: 'Cielo',     status: 'healthy', share: 42, latency: 312, approval: 89.2, errors: 0.4 },
    { name: 'Rede',      status: 'healthy', share: 28, latency: 289, approval: 87.8, errors: 0.6 },
    { name: 'Stone',     status: 'degraded', share: 18, latency: 567, approval: 81.3, errors: 2.1 },
    { name: 'Getnet',    status: 'healthy', share: 12, latency: 341, approval: 86.1, errors: 0.8 },
  ];

  const tones = {
    healthy: { dot: 'bg-emerald-500', label: 'Saudável', color: 'text-emerald-700' },
    degraded: { dot: 'bg-amber-500', label: 'Degradada', color: 'text-amber-700' },
    down: { dot: 'bg-red-500', label: 'Fora', color: 'text-red-700' },
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-600" />
          <h4 className="text-sm font-semibold">Orquestração — saúde dos adquirentes</h4>
        </div>
        <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => toast.success('Fallback ativado para Cielo')}>
          <Zap className="w-3.5 h-3.5 mr-1" />
          Aplicar fallback
        </Button>
      </div>

      <div className="space-y-2">
        {acquirers.map(a => {
          const t = tones[a.status];
          return (
            <div key={a.name} className="grid grid-cols-12 gap-2 items-center p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
              <div className="col-span-3 flex items-center gap-2">
                <span className={cn("w-2 h-2 rounded-full", t.dot, a.status !== 'healthy' && "animate-pulse")} />
                <span className="text-xs font-semibold">{a.name}</span>
              </div>
              <div className="col-span-2 text-xs text-slate-500">
                <span className="font-medium text-slate-700 dark:text-slate-300">{a.share}%</span> tráfego
              </div>
              <div className="col-span-2 text-xs">
                <span className={cn(a.latency > 500 ? "text-red-600 font-semibold" : "text-slate-600")}>
                  {a.latency}ms
                </span>
              </div>
              <div className="col-span-2 text-xs font-semibold" style={{ color: a.approval >= 85 ? '#10b981' : a.approval >= 80 ? '#f59e0b' : '#ef4444' }}>
                {a.approval}%
              </div>
              <div className="col-span-3 text-right">
                <span className={cn("text-[10px] font-medium", t.color)}>{t.label}</span>
                {a.errors > 1 && (
                  <span className="ml-1.5 inline-flex items-center gap-0.5 text-[10px] text-red-600">
                    <AlertCircle className="w-2.5 h-2.5" />
                    {a.errors}% erros
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-500">Latência média p95: <strong className="text-slate-700">387ms</strong></span>
        <span className="flex items-center gap-1 text-emerald-600">
          <CheckCircle2 className="w-3 h-3" />
          Orquestração ativa
        </span>
      </div>
    </div>
  );
}