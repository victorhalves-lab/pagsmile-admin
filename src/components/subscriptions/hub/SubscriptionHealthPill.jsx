import React from 'react';
import { calcHealthScore } from '@/components/subscriptions/utils';
import { cn } from '@/lib/utils';

export default function SubscriptionHealthPill({ subscription, showScore, size = 'md' }) {
  const score = calcHealthScore(subscription);
  const status = score >= 70 ? 'healthy' : score >= 40 ? 'attention' : 'risk';
  const config = {
    healthy: { label: 'Saudável', dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
    attention: { label: 'Atenção', dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
    risk: { label: 'Risco', dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50' },
  }[status];
  const sizes = size === 'sm' ? 'h-4 px-1.5 text-[9px]' : 'h-5 px-2 text-[10px]';
  return (
    <div className={cn('inline-flex items-center gap-1 rounded-full font-bold', sizes, config.bg, config.text)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
      {showScore && <span className="opacity-70">{score}</span>}
    </div>
  );
}