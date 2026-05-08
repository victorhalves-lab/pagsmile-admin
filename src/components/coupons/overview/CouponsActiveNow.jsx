import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { formatBRL, timeSinceUse } from '../utils';

/**
 * Substitui "Cupons Recentes" por "Mais Ativos Agora" + Recentes em duas colunas.
 */
export default function CouponsActiveNow({ coupons }) {
  const mostActive = [...coupons]
    .filter((c) => c.status === 'active')
    .sort((a, b) => b.times_used - a.times_used)
    .slice(0, 5);

  const recent = [...coupons]
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
    .slice(0, 5);

  const renderItem = (c, showTime) => (
    <Link
      key={c.id}
      to={createPageUrl(`CouponDetail?id=${c.id}`)}
      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-[#2bc196]/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="min-w-0">
          <p className="font-mono text-xs font-bold truncate">{c.code}</p>
          <p className="text-[10px] text-slate-500 truncate">{c.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 text-right flex-shrink-0">
        <div>
          <p className="text-xs font-semibold">{c.times_used}</p>
          <p className="text-[10px] text-slate-400">
            {showTime ? timeSinceUse(c) : `${formatBRL(c.total_revenue_generated)}`}
          </p>
        </div>
        <Badge
          variant={c.status === 'active' ? 'default' : 'outline'}
          className="text-[9px] h-4 px-1.5"
        >
          {c.status === 'active' ? '●' : '○'}
        </Badge>
      </div>
    </Link>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            Mais Ativos Agora
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 p-2">
          {mostActive.map((c) => renderItem(c, true))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            Criados Recentemente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 p-2">
          {recent.map((c) => renderItem(c, false))}
        </CardContent>
      </Card>
    </div>
  );
}