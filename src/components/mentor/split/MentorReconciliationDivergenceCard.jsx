import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SEVERITY = {
  high: { label: 'Alta', color: 'bg-red-100 text-red-700 border-red-300', card: 'border-l-red-600' },
  medium: { label: 'Média', color: 'bg-amber-100 text-amber-700 border-amber-300', card: 'border-l-amber-500' },
  low: { label: 'Baixa', color: 'bg-blue-100 text-blue-700 border-blue-300', card: 'border-l-blue-500' },
};

const TYPE_LABEL = {
  amount_mismatch: 'Valor divergente',
  missing_recipient: 'Beneficiário ausente',
  fee_treatment: 'Tratamento MDR errado',
  rounding: 'Arredondamento',
};

const fmt = (n) => (n != null ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n) : '—');

export default function MentorReconciliationDivergenceCard({ divergence, onAccept, onReverse }) {
  const sev = SEVERITY[divergence.severity];
  const totalDelta = Object.values(divergence.delta || {}).reduce((sum, v) => sum + Math.abs(v || 0), 0);

  return (
    <Card className={cn('border-l-4', sev.card)}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={cn('gap-1 border', sev.color)}>
              <AlertTriangle className="w-3 h-3" />
              {sev.label}
            </Badge>
            <Badge variant="outline" className="text-[10px]">{TYPE_LABEL[divergence.type]}</Badge>
            <code className="text-[10px] font-mono text-slate-400">{divergence.divergence_id}</code>
          </div>
          <span className="text-[10px] text-slate-400">
            {new Date(divergence.detected_at).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-slate-50 dark:bg-slate-800 rounded p-2">
            <p className="text-slate-500 uppercase font-bold text-[9px]">Transação</p>
            <p className="font-mono text-slate-700 dark:text-slate-200">{divergence.transaction_id}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded p-2">
            <p className="text-slate-500 uppercase font-bold text-[9px]">Merchant</p>
            <p className="font-semibold text-slate-700 dark:text-slate-200">{divergence.merchant}</p>
          </div>
        </div>

        {/* Diff de valores */}
        <div className="bg-white border rounded p-2.5 space-y-1.5">
          <p className="text-[10px] uppercase font-bold text-slate-500">Esperado vs Realizado</p>
          {Object.keys(divergence.expected || {}).map((key) => {
            const exp = divergence.expected[key];
            const act = divergence.actual?.[key] ?? 0;
            const delta = divergence.delta?.[key] || 0;
            return (
              <div key={key} className="flex items-center gap-2 text-[11px]">
                <span className="capitalize text-slate-500 w-20">{key}:</span>
                <span className="font-mono text-slate-600">{fmt(exp)}</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="font-mono text-slate-700 font-semibold">{fmt(act)}</span>
                {delta !== 0 && (
                  <Badge className={cn('text-[10px]', delta > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700')}>
                    Δ {delta > 0 ? '+' : ''}{fmt(delta)}
                  </Badge>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-violet-50 border border-violet-200 rounded p-2 flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-violet-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] uppercase font-bold text-violet-700">Diagnóstico Mentor</p>
            <p className="text-[11px] text-violet-900 mt-0.5">{divergence.cause_hint}</p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1">→ {divergence.suggested_action}</p>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => onAccept?.(divergence)}>
            <ShieldCheck className="w-3 h-3 mr-1" /> Aceitar como tolerância
          </Button>
          {totalDelta > 0.05 && (
            <Button size="sm" className="flex-1 h-8 text-xs bg-violet-600 hover:bg-violet-700" onClick={() => onReverse?.(divergence)}>
              Estornar diferença
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}