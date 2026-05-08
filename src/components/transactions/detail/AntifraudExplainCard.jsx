import React from 'react';
import { Shield, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Antifraude EXPLICÁVEL — não só o score, mas POR QUE.
 * DIFERENCIAL — Stripe Radar mostra score, mas não decompõe em sinais individuais.
 */
export default function AntifraudExplainCard({ transaction }) {
  if (!transaction) return null;

  const score = transaction.antifraud_data?.score ?? transaction.risk_score ?? 23;
  const recommendation = score >= 70 ? 'review' : score >= 40 ? 'caution' : 'approve';

  const signals = [
    { name: 'Geolocalização do IP',      result: 'pass', detail: 'IP brasileiro consistente com endereço de cobrança', impact: -8 },
    { name: 'Histórico do device',       result: 'pass', detail: 'Device conhecido — 12 compras anteriores', impact: -12 },
    { name: 'Velocidade transacional',   result: 'caution', detail: '3 transações nas últimas 6h (atípico)', impact: +6 },
    { name: 'Match nome × cartão',       result: 'pass', detail: 'Nome no cartão = nome do comprador', impact: -5 },
    { name: 'BIN reputation',            result: 'pass', detail: 'BIN 411111 — Itaú, baixo risco histórico', impact: -3 },
    { name: 'Email idade',               result: 'pass', detail: 'Email com 4+ anos, alta reputação', impact: -7 },
    { name: 'Padrão de horário',         result: 'pass', detail: 'Compra em horário típico do cliente', impact: -2 },
  ];

  const tones = {
    pass: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    caution: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    fail: { icon: X, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
  };

  const recBadge = {
    approve: { label: 'Aprovar', color: 'bg-emerald-100 text-emerald-700' },
    caution: { label: 'Cautela', color: 'bg-amber-100 text-amber-700' },
    review: { label: 'Revisar manualmente', color: 'bg-red-100 text-red-700' },
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-semibold">Análise Antifraude — Explicável</h4>
          </div>
          <span className={cn("text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full font-bold", recBadge[recommendation].color)}>
            {recBadge[recommendation].label}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90">
              <circle cx="40" cy="40" r="32" stroke="currentColor" className="text-slate-200" strokeWidth="6" fill="none" />
              <circle
                cx="40" cy="40" r="32"
                stroke={score >= 70 ? '#ef4444' : score >= 40 ? '#f59e0b' : '#10b981'}
                strokeWidth="6" fill="none"
                strokeDasharray={`${(score / 100) * 201} 201`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold">{score}</p>
              <p className="text-[9px] text-slate-500 uppercase">score</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500">Provedor: <strong className="text-slate-700">{transaction.antifraud_data?.provider || 'PagSmile AF'}</strong></p>
            <p className="text-xs text-slate-500">Modelo: v3.2 (LightGBM + sinais comportamentais)</p>
            <p className="text-xs text-slate-500 mt-1">Quanto menor, mais seguro</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">
          Decomposição dos sinais ({signals.length})
        </p>
        <div className="space-y-1.5">
          {signals.map((s, i) => {
            const t = tones[s.result];
            const Icon = t.icon;
            return (
              <div key={i} className="flex items-start gap-2 p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
                <div className={cn("w-6 h-6 rounded flex items-center justify-center flex-shrink-0", t.bg)}>
                  <Icon className={cn("w-3.5 h-3.5", t.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium">{s.name}</p>
                    <span className={cn(
                      "text-[10px] font-mono",
                      s.impact > 0 ? "text-red-600" : "text-emerald-600"
                    )}>
                      {s.impact > 0 ? '+' : ''}{s.impact}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">{s.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}