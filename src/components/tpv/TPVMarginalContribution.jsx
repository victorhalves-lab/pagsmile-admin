import React from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { TPV_MARGINAL_CONTRIBUTION } from './mocks/tpvMock';

export default function TPVMarginalContribution() {
  const total = TPV_MARGINAL_CONTRIBUTION.reduce((s, d) => s + d.contribution, 0);
  
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-purple-600" />
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">Decomposição do Crescimento</h3>
      </div>
      <p className="text-xs text-slate-500 mb-3">Contribuição marginal de cada driver para o crescimento total de <strong>+{total.toFixed(1)}%</strong></p>
      <div className="space-y-2">
        {TPV_MARGINAL_CONTRIBUTION.map((d, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-xs mb-0.5">
              <span className="text-slate-700 dark:text-slate-300">{d.driver}</span>
              <span className="font-bold text-emerald-600">+{d.contribution}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-500" style={{ width: `${(d.contribution / total) * 100}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}