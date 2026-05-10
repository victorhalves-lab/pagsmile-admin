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
    match: (e) => e.type === 'judicial_lien' || e.type === 'attachment',
  },
  {
    key: 'cessions',
    label: 'Cessões fiduciárias',
    description: 'Recebíveis em garantia',
    icon: FileLock2,
    match: (e) => e.type.includes('assignment'),
  },
  {
    key: 'anticipations',
    label: 'Antecipações registradas',
    description: 'Com terceiros (FIDC, bancos)',
    icon: Zap,
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
    return { ...t, count: items.length, value };
  }).filter((t) => t.count > 0);

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
              <Shield className="w-4.5 h-4.5 text-slate-600 dark:text-slate-300" />
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
          <div className="flex items-center gap-3 sm:flex-col sm:items-end">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Total comprometido
              </p>
              <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                {formatCurrencyShort(totalCommitted)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {breakdown.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50"
              >
                <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {item.count}
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-300 truncate">
                      {item.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {formatCurrencyShort(item.value)} · {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end mt-3">
          <Link to={createPageUrl('MyContractEffects')}>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-600 dark:text-slate-300">
              Ver detalhes <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}