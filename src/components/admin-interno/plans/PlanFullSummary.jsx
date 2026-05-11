import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { COST_CATEGORIES, getByPath, formatUnit } from './planSchema';

/**
 * Resumo completo de um plano: todas as categorias de custo em colunas/tabela.
 * Usado tanto no detalhe (admin interno) quanto na seleção pelo cliente.
 */
export default function PlanFullSummary({ plan, compact = false }) {
  return (
    <div className={compact ? 'space-y-3' : 'grid grid-cols-1 md:grid-cols-2 gap-3'}>
      {COST_CATEGORIES.map((cat) => (
        <Card key={cat.id} className="border-slate-200">
          <CardContent className="p-3.5 space-y-2">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="text-base">{cat.icon}</span>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">{cat.label}</span>
            </div>
            <div className="space-y-1.5">
              {cat.items.map((item) => {
                const v = getByPath(plan, item.key);
                return (
                  <div key={item.key} className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-bold text-slate-900 font-mono">{formatUnit(v, item.unit)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}