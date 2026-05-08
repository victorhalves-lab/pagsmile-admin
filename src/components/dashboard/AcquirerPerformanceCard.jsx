import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

/**
 * Performance por Adquirente — DIFERENCIAL DA PAGSMILE (orquestração nativa).
 * Padrão Yuno / Adyen.
 *
 * Mostra aprovação, volume e recomendação de roteamento por adquirente.
 */
export default function AcquirerPerformanceCard({ acquirers = [] }) {
  const defaultAcquirers = [
    { name: 'Stone',    approval: 92.4, volume: 845230, change: 1.2,  status: 'best',     bestFor: 'Visa débito' },
    { name: 'Cielo',    approval: 88.1, volume: 612480, change: -0.8, status: 'normal',   bestFor: 'Mastercard' },
    { name: 'Rede',     approval: 86.7, volume: 423190, change: 0.5,  status: 'normal',   bestFor: 'Elo' },
    { name: 'Getnet',   approval: 79.3, volume: 198420, change: -3.2, status: 'underperf', bestFor: '—' },
  ];
  const list = acquirers.length > 0 ? acquirers : defaultAcquirers;

  const formatCurrency = (v) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(v || 0);

  const statusConfig = {
    best:       { label: 'Melhor performance', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    normal:     { label: 'Em linha',           color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
    underperf:  { label: 'Subperformando',     color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  };

  return (
    <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Network className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Performance por Adquirente</h3>
                <Badge className="bg-violet-100 text-violet-700 border-0 text-[9px] gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> Orquestração
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500">Roteamento inteligente — últimos 7 dias</p>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="space-y-2">
          {list.map((acq) => {
            const cfg = statusConfig[acq.status] || statusConfig.normal;
            const positive = acq.change >= 0;
            return (
              <div
                key={acq.name}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border transition-all hover:shadow-sm',
                  acq.status === 'best'
                    ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/10'
                    : acq.status === 'underperf'
                    ? 'border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/10'
                    : 'border-slate-200 dark:border-slate-800'
                )}
              >
                {/* Nome */}
                <div className="w-24 flex-shrink-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{acq.name}</p>
                  <Badge variant="secondary" className={cn('text-[9px] mt-0.5 px-1.5 py-0 h-4 border-0', cfg.color)}>
                    {cfg.label}
                  </Badge>
                </div>

                {/* Aprovação com gauge */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-base font-bold text-slate-900 dark:text-white">
                      {acq.approval.toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-slate-500">aprovação</span>
                    <span
                      className={cn(
                        'text-[10px] font-semibold flex items-center gap-0.5 ml-auto',
                        positive ? 'text-emerald-600' : 'text-red-600'
                      )}
                    >
                      {positive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                      {Math.abs(acq.change).toFixed(1)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        acq.status === 'best'
                          ? 'bg-gradient-to-r from-emerald-400 to-[#2bc196]'
                          : acq.status === 'underperf'
                          ? 'bg-gradient-to-r from-red-400 to-red-600'
                          : 'bg-gradient-to-r from-slate-400 to-slate-500'
                      )}
                      style={{ width: `${acq.approval}%` }}
                    />
                  </div>
                </div>

                {/* Volume + best for */}
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {formatCurrency(acq.volume)}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Ideal: <span className="font-medium">{acq.bestFor}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer com sugestão */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Link
            to={createPageUrl('AdminIntOrchestration')}
            className="flex items-center gap-2 text-[11px] text-violet-600 dark:text-violet-400 hover:underline"
          >
            <Sparkles className="w-3 h-3" />
            <span className="font-semibold">Sugestão IA:</span>
            <span>Rotear 20% do volume Visa de Getnet → Stone aumenta aprovação em ~3.1%</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}