import React from 'react';
import { Wand2, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

/**
 * "O que fazer agora?" — playbook automático para recusas.
 * Cada motivo ganha 1-3 ações concretas + botão para aplicar.
 */
export default function WhatToDoActions() {
  const playbooks = [
    {
      reason: 'NSF (saldo insuficiente)',
      severity: 'high',
      actions: [
        { label: 'Oferecer PIX com 5% de desconto', impact: '+R$ 18.4k recuperáveis/mês', kind: 'primary' },
        { label: 'Retry em 72h', impact: '~28% de sucesso', kind: 'secondary' },
        { label: 'Sugerir parcelamento 3x sem juros', impact: '~15% de sucesso', kind: 'secondary' },
      ],
    },
    {
      reason: 'Erro do emissor (cód 91)',
      severity: 'medium',
      actions: [
        { label: 'Reprocessar via fallback (Cielo)', impact: '~68% de sucesso', kind: 'primary' },
        { label: 'Retry em 2h automático', impact: 'Já configurado', kind: 'secondary' },
      ],
    },
    {
      reason: 'Cartão expirado',
      severity: 'medium',
      actions: [
        { label: 'Solicitar atualização (Account Updater)', impact: '~62% atualizam em 7d', kind: 'primary' },
        { label: 'Enviar e-mail "atualize seu cartão"', impact: 'Reciclagem proativa', kind: 'secondary' },
      ],
    },
    {
      reason: 'Suspeita de fraude',
      severity: 'critical',
      actions: [
        { label: 'Revisar manualmente', impact: 'Análise antes de bloquear', kind: 'primary' },
        { label: 'Adicionar à blocklist', impact: 'Se confirmado fraude', kind: 'danger' },
      ],
    },
  ];

  const tones = {
    high: 'border-red-200 bg-red-50/50 dark:bg-red-900/10',
    medium: 'border-amber-200 bg-amber-50/50 dark:bg-amber-900/10',
    critical: 'border-red-300 bg-red-100/50 dark:bg-red-900/20',
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-emerald-900/10 dark:via-slate-900 dark:to-blue-900/10 rounded-xl border border-emerald-200 dark:border-emerald-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-emerald-600" />
          <h4 className="text-sm font-semibold">O que fazer agora? — Playbooks</h4>
        </div>
        <span className="text-[10px] uppercase tracking-wide text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          Prescritivo
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {playbooks.map((p, i) => (
          <div key={i} className={cn("rounded-lg border p-3 space-y-2", tones[p.severity])}>
            <p className="text-xs font-semibold">{p.reason}</p>
            <div className="space-y-1.5">
              {p.actions.map((a, j) => (
                <div key={j} className="flex items-center justify-between gap-2 text-xs bg-white dark:bg-slate-900 rounded p-2 border border-slate-100 dark:border-slate-700">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{a.label}</p>
                    <p className="text-[10px] text-slate-500">{a.impact}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={a.kind === 'primary' ? 'default' : a.kind === 'danger' ? 'destructive' : 'outline'}
                    className={cn(
                      "h-6 text-[10px] gap-1 flex-shrink-0",
                      a.kind === 'primary' && "bg-[#2bc196] hover:bg-[#25a880]"
                    )}
                    onClick={() => toast.success(`Ação aplicada: ${a.label}`)}
                  >
                    Aplicar
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}