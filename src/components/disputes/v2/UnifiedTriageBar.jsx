import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UnifiedTriageBar({ counts, currentChip, onSelectChip }) {
  const chips = [
    { id: 'critical', label: 'Crítico', color: 'red', count: counts.critical },
    { id: 'high', label: 'Alto', color: 'orange', count: counts.high },
    { id: 'medium', label: 'Médio', color: 'amber', count: counts.medium },
    { id: 'precb', label: 'Pre-CBs', color: 'orange', count: counts.precb },
    { id: 'cb', label: 'Chargebacks', color: 'red', count: counts.cb },
    { id: 'med', label: 'MEDs', color: 'emerald', count: counts.med },
  ];

  const colorMap = {
    red: 'bg-red-100 text-red-700 border-red-300',
    orange: 'bg-orange-100 text-orange-700 border-orange-300',
    amber: 'bg-amber-100 text-amber-700 border-amber-300',
    emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  };

  return (
    <Card className="border-purple-200 bg-purple-50/30">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <p className="text-xs font-bold text-purple-900">Triagem IA:</p>
          </div>
          {chips.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectChip(c.id)}
              className={cn(
                'px-2.5 py-1 rounded-full text-[11px] font-bold border-2 transition-all',
                currentChip === c.id ? colorMap[c.color] : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              )}
            >
              {c.label} <span className="opacity-70">({c.count})</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}