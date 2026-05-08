import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const PRESETS = [
  { id: 'all', label: 'Todas', filter: () => true },
  { id: 'active', label: 'Ativas', filter: (s) => s.status === 'active', tone: 'emerald' },
  { id: 'pending', label: 'Pendentes', filter: (s) => ['draft', 'pending_documents', 'under_review'].includes(s.status), tone: 'amber' },
  { id: 'risk', label: 'Em Risco', filter: (s) => s.risk_level === 'high' || s.status === 'suspended', tone: 'red' },
  { id: 'dormant', label: 'Dormentes', filter: (s) => s.status === 'active' && (s.total_transactions || 0) === 0, tone: 'orange' },
  { id: 'top_gmv', label: 'Top GMV', filter: () => true, tone: 'purple' },
  { id: 'no_kyc', label: 'KYC Pendente', filter: (s) => s.compliance_status !== 'compliant', tone: 'orange' },
];

const toneClasses = {
  default: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  emerald: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
  amber: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
  red: 'bg-red-100 text-red-700 hover:bg-red-200',
  orange: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
  purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
};

const activeToneClasses = {
  default: 'bg-slate-700 text-white',
  emerald: 'bg-emerald-600 text-white',
  amber: 'bg-amber-600 text-white',
  red: 'bg-red-600 text-white',
  orange: 'bg-orange-600 text-white',
  purple: 'bg-purple-600 text-white',
};

export default function SubaccountsQuickFilters({ subaccounts = [], activePreset = 'all', onChange }) {
  const counts = PRESETS.reduce((acc, p) => {
    acc[p.id] = subaccounts.filter(p.filter).length;
    return acc;
  }, {});

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-slate-500 font-medium">Filtros rápidos:</span>
      {PRESETS.map(preset => {
        const isActive = activePreset === preset.id;
        const tone = preset.tone || 'default';
        return (
          <button
            key={preset.id}
            onClick={() => onChange?.(preset.id)}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all",
              isActive ? activeToneClasses[tone] : toneClasses[tone]
            )}
          >
            {preset.label}
            <Badge 
              variant="outline" 
              className={cn(
                "text-[10px] h-4 px-1 border-0",
                isActive ? "bg-white/20 text-white" : "bg-white/60"
              )}
            >
              {counts[preset.id]}
            </Badge>
          </button>
        );
      })}
    </div>
  );
}