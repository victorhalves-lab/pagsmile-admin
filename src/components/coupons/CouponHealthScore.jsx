import React from 'react';
import { cn } from '@/lib/utils';
import { calcCouponHealth } from './utils';

export default function CouponHealthScore({ coupon, showLabel = true, size = 'sm' }) {
  const { score, status, label } = calcCouponHealth(coupon);

  const colorMap = {
    good: 'bg-emerald-500 text-white',
    warn: 'bg-amber-500 text-white',
    bad: 'bg-red-500 text-white',
  };

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          'rounded-full font-bold flex items-center justify-center',
          colorMap[status],
          size === 'sm' ? 'w-6 h-6 text-[9px]' : 'w-8 h-8 text-xs'
        )}
        title={`Health Score: ${score} (${label})`}
      >
        {score}
      </span>
      {showLabel && <span className="text-[10px] text-slate-500">{label}</span>}
    </div>
  );
}