import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Scale, FileLock2, Zap, ArrowRight, Info } from 'lucide-react';
import { createPageUrl } from '@/components/utils';
import { MOCK_EFFECTS, formatCurrencyShort } from '@/components/regulatory/mocks/urMock';

const TYPES = [
  {
    key: 'judicial',
    label: 'Bloqueios judiciais',
    description: 'Penhoras e ordens judiciais',
    icon: Scale,
    iconBg: 'bg-rose-50 dark:bg-rose-950/40',
    iconColor: 'text-rose-600 dark:text-rose-400',
    accent: 'border-l-rose-400 dark:border-l-rose-500',
    valueColor: 'text-rose-700 dark:text-rose-300',
    match: (e) => e.type === 'judicial_lien' || e.type === 'attachment',
  },
  {
    key: 'cessions',
    label: 'Cessões fiduciárias',
    description: 'Recebíveis em garantia',
    icon: FileLock2,
    iconBg: 'bg-amber-50 dark:bg-amber-950/40',
    iconColor: 'text-amber-600 dark:text-amber-400',
    accent: 'border-l-amber-400 dark:border-l-amber-500',
    valueColor: 'text-amber-700 dark:text-amber-300',
    match: (e) => e.type.includes('assignment'),
  },
  {
    key: 'anticipations',
    label: 'Antecipações registradas',
    description: 'Com terceiros (FIDC, bancos)',
    icon: Zap,
    iconBg: 'bg-sky-50 dark:bg-sky-950/40',
    iconColor: 'text-sky-600 dark:text-sky-400',
    accent: 'border-l-sky-400 dark:border-l-sky-500',
    valueColor: 'text-sky-700 dark:text-sky-300',
    match: (e) => e.type === 'registered_anticipation',
  },
];

export default function RegulatoryCommitmentsCard() {
  // mock — lojista atual
  const myEffects = MOCK_EFFECTS.filter(
    (e) => e.ur?.merchant?.id === 'mer_001' && e.status === 'active'
  );
  const totalCommitted = myEffects.reduce((s, e) => s + e.value_affected, 0);

  if (myEffects.length === 0) return null;

  const breakdown = TYPES.map((t) => {
    const items = myEffects.filter(t.match);
    const value = items.reduce((s, e) => s + e.value_affected, 0);
    const pct = totalCommitted > 0 ? (value / totalCommitted) * 100 : 0;
    return { ...t, count: items.length, value, pct };
  }).filter((t) => t.count > 0);

  return (
    <Card className="overflow-hidden border-slate-200 dark:border-slate-700">
      {/* Header com fundo sutil */}
      <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/60 dark:to-slate-800/20 border-b border-slate-100 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 dark:bg-slate-100 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-white dark:text-slate-900" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Compromissos sobre seus recebíveis
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <Info className="w-3 h-3" />
                Valores comprometidos por gravames registrados em CERC/B3
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right pl-13 sm:pl-0">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">
              Total comprometido
            </p>
            <p className="text-xl font-black text-slate-900 dark:text-white tabular-nums">
              {formatCurrencyShort(totalCommitted)}
            </p>
          </div>
        </div>
      </div>

      <CardContent className="p-5">
        {/* Barra empilhada de proporção */}
        <div className="mb-4">
          <div className="flex h-2 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
            {breakdown.map((item) => (
              <div
                key={item.key}
                className={`${item.iconBg.replace('bg-', 'bg-').replace('-50', '-400').replace('dark:bg-', 'dark:bg-').replace('-950/40', '-500')}`}
                style={{ width: `${item.pct}%` }}
                title={`${item.label}: ${item.pct.toFixed(0)}%`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            {breakdown.map((item) => (
              <div key={item.key} className="flex items-center gap-1.5 text-[11px]">
                <span className={`w-2 h-2 rounded-full ${item.iconColor.replace('text-', 'bg-')}`} />
                <span className="text-slate-500 dark:text-slate-400">{item.label}</span>
                <span className="text-slate-700 dark:text-slate-200 font-semibold tabular-nums">
                  {item.pct.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cards por tipo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {breakdown.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className={`relative p-4 rounded-lg bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 border-l-4 ${item.accent} hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className={`w-9 h-9 rounded-lg ${item.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-4.5 h-4.5 ${item.iconColor}`} />
                  </div>
                  <span className={`text-2xl font-black tabular-nums ${item.iconColor}`}>
                    {item.count}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  {item.label}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 mb-2">
                  {item.description}
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/50">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                    Valor afetado
                  </p>
                  <p className={`text-base font-bold tabular-nums ${item.valueColor}`}>
                    {formatCurrencyShort(item.value)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50">
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Dados sincronizados com registradoras autorizadas pelo Banco Central
          </p>
          <Link to={createPageUrl('MyContractEffects')}>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-700 dark:text-slate-200 hover:text-slate-900">
              Ver detalhes <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}