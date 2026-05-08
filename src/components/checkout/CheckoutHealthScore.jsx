import React from 'react';
import { Activity, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * Health Score do checkout — 0-100 combinando completude, performance, mobile, antifraude.
 * Visível em múltiplas telas para identificar problemas sem investigar.
 */
export default function CheckoutHealthScore({ score = 78, compact = false }) {
  const checks = [
    { ok: true,  label: 'Configuração completa',     points: 20 },
    { ok: true,  label: 'Performance > média',       points: 15 },
    { ok: true,  label: 'Mobile-friendly',            points: 15 },
    { ok: false, label: '3DS habilitado',             points: 10 },
    { ok: true,  label: 'Antifraude ativo',           points: 15 },
    { ok: true,  label: 'Webhooks saudáveis',         points: 10 },
    { ok: false, label: 'A/B test em produção',      points: 8 },
    { ok: false, label: 'PIX otimizado',              points: 7 },
  ];

  const tone = score >= 80 ? 'emerald' : score >= 60 ? 'amber' : 'red';
  const toneClasses = {
    emerald: { ring: 'stroke-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', label: 'Saudável' },
    amber: { ring: 'stroke-amber-500', text: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', label: 'Atenção' },
    red: { ring: 'stroke-red-500', text: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', label: 'Crítico' },
  };
  const t = toneClasses[tone];

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-full", t.bg)}>
              <Activity className={cn("w-3 h-3", t.text)} />
              <span className={cn("text-xs font-bold", t.text)}>{score}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Health score do checkout: <strong>{score}/100</strong> — {t.label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-24 h-24 -rotate-90">
            <circle cx="48" cy="48" r="40" stroke="currentColor" className="text-slate-200" strokeWidth="8" fill="none" />
            <circle cx="48" cy="48" r="40" strokeWidth="8" fill="none" strokeLinecap="round"
              className={t.ring}
              strokeDasharray={`${(score / 100) * 251} 251`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className={cn("text-2xl font-bold", t.text)}>{score}</p>
            <p className="text-[9px] text-slate-500 uppercase">de 100</p>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold">Health Score do Checkout</h4>
            <span className={cn("text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full", t.bg, t.text)}>
              {t.label}
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3">Combinação de completude, performance, mobile e antifraude</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {checks.map((c, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px]">
                {c.ok ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                )}
                <span className={c.ok ? "text-slate-600" : "text-amber-700 font-medium"}>
                  {c.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}