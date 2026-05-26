import React from 'react';
import { TrendingUp, AlertTriangle, Clock, RefreshCcw, ShieldAlert, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/**
 * SummaryCards ACIONÁVEIS — V9 Pulse VF.
 * KPI cards usando .pvf-kpi (mint gradient corner accent + JetBrains Mono numbers)
 * Tones mapeiam para variants V9 (.pvf-kpi-blue / .pvf-kpi-deep) + state highlights.
 */
export default function ActionableSummaryCards({ transactions = [] }) {
  const formatCurrency = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

  const approved = transactions.filter((t) => t.status === 'approved');
  const refused = transactions.filter((t) => t.status === 'refused');
  const pending = transactions.filter((t) => t.status === 'pending');
  const preAuth = transactions.filter((t) => t.status === 'authorized');
  const total = approved.length + refused.length;
  const approvalRate = total > 0 ? (approved.length / total) * 100 : 0;
  const totalApproved = approved.reduce((s, t) => s + (t.amount || 0), 0);

  const expiringCards = 12;
  const stalePending = pending.filter((t) => {
    if (!t.created_date) return false;
    return Date.now() - new Date(t.created_date).getTime() > 24 * 3600 * 1000;
  }).length;

  const cards = [
    {
      key: 'approved',
      label: 'Volume Aprovado',
      value: formatCurrency(totalApproved),
      isCurrency: true,
      sub: `${approved.length} transações`,
      icon: TrendingUp,
      variant: 'mint',
      cta: 'Ver detalhes',
      onCta: () => toast.info('Abrindo análise de volume...'),
    },
    {
      key: 'rate',
      label: 'Taxa de Aprovação',
      value: `${approvalRate.toFixed(1)}%`,
      sub: `${approved.length}/${total} tentativas`,
      icon: TrendingUp,
      variant: 'blue',
      cta: approvalRate < 85 ? 'Ver oportunidades' : 'Análise completa',
      onCta: () => toast.info('Abrindo análise de aprovação...'),
      highlight: approvalRate < 85,
      highlightTone: 'warn',
    },
    {
      key: 'preauth',
      label: 'Pré-autorizações',
      value: preAuth.length,
      sub: preAuth.length > 0 ? `${preAuth.length} aguardando captura` : 'tudo capturado',
      icon: Clock,
      variant: 'deep',
      cta: preAuth.length > 0 ? 'Capturar agora' : 'Histórico',
      onCta: () => toast.success('Captura em lote iniciada'),
      highlight: preAuth.length > 0,
      highlightTone: 'warn',
    },
    {
      key: 'refused',
      label: 'Recusas',
      value: refused.length,
      sub: 'Recovery pode recuperar ~38%',
      icon: AlertTriangle,
      variant: 'mint',
      cta: 'Ativar Recovery',
      onCta: () => toast.success('Configurando Recovery Agent...'),
      highlight: refused.length > 5,
      highlightTone: 'err',
    },
    {
      key: 'stale',
      label: 'Pendentes > 24h',
      value: stalePending,
      sub: stalePending > 0 ? 'Risco de expirar' : 'tudo em dia',
      icon: RefreshCcw,
      variant: 'blue',
      cta: stalePending > 0 ? 'Reprocessar' : '—',
      onCta: () => toast.success('Reprocessamento iniciado'),
      highlight: stalePending > 0,
      highlightTone: 'warn',
    },
    {
      key: 'expiring',
      label: 'Cartões Expirando',
      value: expiringCards,
      sub: 'em até 30 dias',
      icon: ShieldAlert,
      variant: 'deep',
      cta: 'Solicitar atualização',
      onCta: () => toast.success('Campanha de atualização agendada'),
      highlight: expiringCards > 0,
      highlightTone: 'warn',
    },
  ];

  const variantClass = {
    mint: 'pvf-kpi',
    blue: 'pvf-kpi pvf-kpi-blue',
    deep: 'pvf-kpi pvf-kpi-deep',
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.key} className={cn(variantClass[c.variant], 'group')}>
            {/* Top: icon + highlight pill */}
            <div className="pvf-kpi-top">
              <div className="pvf-ic pvf-ic-sm pvf-ic-mint">
                <Icon strokeWidth={2} />
              </div>
              {c.highlight && (
                <span
                  className={cn(
                    'pvf-pill',
                    c.highlightTone === 'err'
                      ? 'pvf-pill-err'
                      : c.highlightTone === 'warn'
                      ? 'pvf-pill-warn'
                      : 'pvf-pill-brand'
                  )}
                  style={{ fontSize: 9, padding: '2px 7px' }}
                >
                  !
                </span>
              )}
            </div>

            {/* Label + Value */}
            <div>
              <div className="pvf-kpi-lab">{c.label}</div>
              <div className="pvf-kpi-val" style={{ fontSize: 22 }}>
                {c.isCurrency && <span className="pvf-ccy">R$</span>}
                {c.isCurrency ? c.value.replace('R$', '').trim() : c.value}
              </div>
              <div className="pvf-kpi-foot" style={{ fontSize: 10 }}>
                {c.sub}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={c.onCta}
              className="inline-flex items-center justify-between w-full mt-2 transition-all hover:-translate-y-px"
              style={{
                padding: '6px 10px',
                borderRadius: 8,
                background: 'rgba(0, 193, 148, 0.10)',
                border: '1px solid rgba(0, 193, 148, 0.28)',
                color: '#007A5C',
                fontFamily: 'Inter, sans-serif',
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '-0.005em',
                cursor: 'pointer',
              }}
            >
              <span>{c.cta}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}