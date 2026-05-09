import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitCompare, Plus, Minus, Equal } from 'lucide-react';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);

/**
 * Diff visual antes vs depois — Mentor F2939, F2873.
 * Mostra terminais a adicionar, manter e remover com TPV impactado.
 */
export default function SplitTerminalDiffPanel({ original = [], next = [], terminalsMap = {} }) {
  const originalIds = new Set(original);
  const nextIds = new Set(next);

  const toAdd = next.filter((id) => !originalIds.has(id));
  const toRemove = original.filter((id) => !nextIds.has(id));
  const toKeep = original.filter((id) => nextIds.has(id));

  const sumTpv = (ids) => ids.reduce((s, id) => s + (terminalsMap[id]?.tpv_30d || 0), 0);

  const tpvAdded = sumTpv(toAdd);
  const tpvRemoved = sumTpv(toRemove);
  const tpvKept = sumTpv(toKeep);
  const tpvDelta = tpvAdded - tpvRemoved;

  const Block = ({ title, icon: Icon, color, ids, tpv }) => (
    <div className={`rounded-lg p-3 border ${color}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Icon className="w-4 h-4" />
          <span className="text-xs font-bold uppercase">{title}</span>
        </div>
        <Badge variant="outline" className="text-[10px] bg-white">{ids.length}</Badge>
      </div>
      <p className="text-xl font-bold">{formatCurrency(tpv)}</p>
      <p className="text-[10px] opacity-80">TPV agregado 30d</p>
      {ids.length > 0 && (
        <div className="mt-2 max-h-28 overflow-y-auto space-y-1">
          {ids.map((id) => {
            const t = terminalsMap[id];
            if (!t) return null;
            return (
              <div key={id} className="text-[10px] bg-white/70 rounded px-1.5 py-1 truncate">
                <code className="font-mono opacity-70">{t.tid}</code> · {t.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-violet-600" />
          Diff de Vínculos · Antes vs Depois
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Block
            title="A adicionar"
            icon={Plus}
            color="bg-emerald-50 border-emerald-200 text-emerald-800"
            ids={toAdd}
            tpv={tpvAdded}
          />
          <Block
            title="Manter"
            icon={Equal}
            color="bg-slate-50 border-slate-200 text-slate-700"
            ids={toKeep}
            tpv={tpvKept}
          />
          <Block
            title="A remover"
            icon={Minus}
            color="bg-red-50 border-red-200 text-red-800"
            ids={toRemove}
            tpv={tpvRemoved}
          />
        </div>

        <div className={`rounded-lg p-3 border-2 ${tpvDelta >= 0 ? 'border-emerald-300 bg-emerald-50' : 'border-amber-300 bg-amber-50'}`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-[10px] uppercase font-bold opacity-70">Variação líquida do TPV vinculado</p>
              <p className={`text-2xl font-black ${tpvDelta >= 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                {tpvDelta >= 0 ? '+' : ''}{formatCurrency(tpvDelta)}
              </p>
            </div>
            <div className="text-right text-[11px]">
              <p className="opacity-70">TPV total vinculado após mudança</p>
              <p className="font-bold text-slate-800">{formatCurrency(tpvKept + tpvAdded)} / mês</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}