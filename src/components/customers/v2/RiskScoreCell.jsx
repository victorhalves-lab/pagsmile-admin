import React from 'react';
import { cn } from '@/lib/utils';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function RiskScoreCell({ score = 0 }) {
  const getConfig = () => {
    if (score < 30) return { label: 'Baixo', color: 'text-emerald-600', bg: 'bg-emerald-100', bar: 'bg-emerald-500', icon: ShieldCheck };
    if (score < 60) return { label: 'Médio', color: 'text-yellow-600', bg: 'bg-yellow-100', bar: 'bg-yellow-500', icon: Shield };
    return { label: 'Alto', color: 'text-red-600', bg: 'bg-red-100', bar: 'bg-red-500', icon: ShieldAlert };
  };
  const c = getConfig();
  const Icon = c.icon;

  return (
    <div className="flex items-center gap-2">
      <div className={cn('w-7 h-7 rounded-md flex items-center justify-center', c.bg)}>
        <Icon className={cn('w-3.5 h-3.5', c.color)} />
      </div>
      <div className="flex-1 min-w-[60px]">
        <div className="flex items-center justify-between mb-0.5">
          <span className={cn('text-xs font-bold', c.color)}>{score}</span>
          <span className="text-[10px] text-slate-400">{c.label}</span>
        </div>
        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className={cn('h-full rounded-full transition-all', c.bar)} style={{ width: `${score}%` }} />
        </div>
      </div>
    </div>
  );
}