import React from 'react';
import { TrendingUp, AlertTriangle, Clock, RefreshCcw, ShieldAlert, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

/**
 * SummaryCards ACIONÁVEIS — substitui os decorativos.
 * Cada card tem um CTA claro (não só número estático).
 */
export default function ActionableSummaryCards({ transactions = [] }) {
  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

  const approved = transactions.filter(t => t.status === 'approved');
  const refused = transactions.filter(t => t.status === 'refused');
  const pending = transactions.filter(t => t.status === 'pending');
  const preAuth = transactions.filter(t => t.status === 'authorized');
  const total = approved.length + refused.length;
  const approvalRate = total > 0 ? (approved.length / total) * 100 : 0;
  const totalApproved = approved.reduce((s, t) => s + (t.amount || 0), 0);

  // mock derivado: cartões expirando, pendentes >24h
  const expiringCards = 12;
  const stalePending = pending.filter(t => {
    if (!t.created_date) return false;
    return Date.now() - new Date(t.created_date).getTime() > 24 * 3600 * 1000;
  }).length;

  const cards = [
    {
      key: 'approved',
      label: 'Volume aprovado',
      value: formatCurrency(totalApproved),
      sub: `${approved.length} transações`,
      icon: TrendingUp,
      tone: 'emerald',
      cta: 'Ver detalhes',
      onCta: () => toast.info('Abrindo análise de volume...'),
    },
    {
      key: 'rate',
      label: 'Taxa de aprovação',
      value: `${approvalRate.toFixed(1)}%`,
      sub: `${approved.length}/${total} tentativas`,
      icon: TrendingUp,
      tone: 'blue',
      cta: approvalRate < 85 ? 'Ver oportunidades' : 'Análise completa',
      onCta: () => toast.info('Abrindo análise de aprovação...'),
      highlight: approvalRate < 85,
    },
    {
      key: 'preauth',
      label: 'Pré-autorizações',
      value: preAuth.length,
      sub: preAuth.length > 0 ? `${preAuth.length} aguardando captura` : 'tudo capturado',
      icon: Clock,
      tone: 'amber',
      cta: preAuth.length > 0 ? 'Capturar agora' : 'Histórico',
      onCta: () => toast.success('Captura em lote iniciada'),
      highlight: preAuth.length > 0,
    },
    {
      key: 'refused',
      label: 'Recusas',
      value: refused.length,
      sub: 'Recovery pode recuperar ~38%',
      icon: AlertTriangle,
      tone: 'red',
      cta: 'Ativar Recovery',
      onCta: () => toast.success('Configurando Recovery Agent...'),
      highlight: refused.length > 5,
    },
    {
      key: 'stale',
      label: 'Pendentes > 24h',
      value: stalePending,
      sub: stalePending > 0 ? 'Risco de expirar' : 'tudo em dia',
      icon: RefreshCcw,
      tone: 'orange',
      cta: stalePending > 0 ? 'Reprocessar' : '—',
      onCta: () => toast.success('Reprocessamento iniciado'),
      highlight: stalePending > 0,
    },
    {
      key: 'expiring',
      label: 'Cartões expirando',
      value: expiringCards,
      sub: 'em até 30 dias',
      icon: ShieldAlert,
      tone: 'purple',
      cta: 'Solicitar atualização',
      onCta: () => toast.success('Campanha de atualização agendada'),
      highlight: expiringCards > 0,
    },
  ];

  const tones = {
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600', text: 'text-emerald-700 dark:text-emerald-400', ring: 'ring-emerald-200' },
    blue:    { bg: 'bg-blue-50 dark:bg-blue-900/20',       icon: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600',       text: 'text-blue-700 dark:text-blue-400',     ring: 'ring-blue-200' },
    amber:   { bg: 'bg-amber-50 dark:bg-amber-900/20',     icon: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600',     text: 'text-amber-700 dark:text-amber-400',   ring: 'ring-amber-200' },
    red:     { bg: 'bg-red-50 dark:bg-red-900/20',         icon: 'bg-red-100 dark:bg-red-900/40 text-red-600',           text: 'text-red-700 dark:text-red-400',       ring: 'ring-red-200' },
    orange:  { bg: 'bg-orange-50 dark:bg-orange-900/20',   icon: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600',   text: 'text-orange-700 dark:text-orange-400', ring: 'ring-orange-200' },
    purple:  { bg: 'bg-purple-50 dark:bg-purple-900/20',   icon: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600',   text: 'text-purple-700 dark:text-purple-400', ring: 'ring-purple-200' },
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map(c => {
        const t = tones[c.tone];
        const Icon = c.icon;
        return (
          <div
            key={c.key}
            className={cn(
              "rounded-xl border border-slate-100 dark:border-slate-700 p-3 transition-all hover:shadow-md group flex flex-col justify-between",
              t.bg,
              c.highlight && `ring-1 ${t.ring}`
            )}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", t.icon)}>
                  <Icon className="w-4 h-4" />
                </div>
                {c.highlight && <span className="w-2 h-2 rounded-full bg-current animate-pulse" />}
              </div>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{c.label}</p>
              <p className={cn("text-lg font-bold mt-0.5", t.text)}>{c.value}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{c.sub}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className={cn("mt-2 h-7 px-2 text-[11px] justify-between hover:bg-white dark:hover:bg-slate-800", t.text)}
              onClick={c.onCta}
            >
              {c.cta}
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}