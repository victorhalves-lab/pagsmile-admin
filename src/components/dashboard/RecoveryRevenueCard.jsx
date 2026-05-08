import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Sparkles, RotateCcw, ShieldCheck } from 'lucide-react';
import Sparkline from './Sparkline';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

/**
 * Recovery Revenue [#16] — JUSTIFICA o produto.
 * Padrão AppMax/Iugu — referências em recovery exposto.
 * Mostra ROI do PagSmile: quanto Recovery Agent + Dispute Manager + Retentativas recuperaram.
 */
export default function RecoveryRevenueCard({ data = {} }) {
  const formatCurrency = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);

  const recovery   = data.recovery   ?? 18420;
  const disputes   = data.disputes   ?? 8950;
  const retries    = data.retries    ?? 12380;
  const total = recovery + disputes + retries;

  const breakdowns = [
    { label: 'Recovery Agent',    value: recovery, icon: RotateCcw,    color: 'text-emerald-600', to: createPageUrl('RecoveryAgent') },
    { label: 'Dispute Manager',   value: disputes, icon: ShieldCheck,  color: 'text-blue-600',    to: createPageUrl('DisputeManager') },
    { label: 'Smart retries',     value: retries,  icon: TrendingUp,   color: 'text-violet-600',  to: createPageUrl('Transactions') },
  ];

  return (
    <Card className="border-2 border-emerald-200 dark:border-emerald-900 bg-gradient-to-br from-emerald-50/50 via-white to-white dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900 shadow-sm overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Receita recuperada — mês
              </p>
              <p className="text-[10px] text-slate-500">Pelos agentes IA da PagSmile</p>
            </div>
          </div>
        </div>

        <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(total)}</p>
        <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 inline-flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          ROI do PagSmile este mês
        </p>

        <Sparkline data={[8, 12, 15, 18, 22, 28, 35, 42]} color="emerald" height={28} className="mt-2" />

        <div className="mt-3 pt-3 border-t border-emerald-100 dark:border-emerald-900 space-y-1.5">
          {breakdowns.map((b) => {
            const Icon = b.icon;
            return (
              <Link key={b.label} to={b.to} className="flex items-center justify-between text-[11px] hover:text-[#2bc196] transition-colors">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <Icon className={cn('w-3 h-3', b.color)} />
                  {b.label}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(b.value)}</span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Mini util pra evitar import extra de cn neste arquivo simples
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}