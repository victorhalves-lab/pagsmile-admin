import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { formatBRL, calcRoi } from '../utils';

/**
 * Top 5 + Bottom 5 cupons por receita. Substitui só "Top 5" do Overview.
 */
export default function CouponsTopBottom({ coupons }) {
  const sorted = [...coupons].sort((a, b) => b.total_revenue_generated - a.total_revenue_generated);
  const top5 = sorted.slice(0, 5);
  const bottom5 = sorted.slice(-5).reverse();

  const renderRow = (c, idx, isTop) => (
    <Link
      key={c.id}
      to={createPageUrl(`CouponDetail?id=${c.id}`)}
      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className={`text-xs font-bold ${isTop ? 'text-emerald-600' : 'text-slate-400'}`}>
          #{idx + 1}
        </span>
        <div className="min-w-0">
          <p className="font-mono text-xs font-semibold truncate">{c.code}</p>
          <p className="text-[10px] text-slate-500 truncate">{c.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <Badge variant="outline" className="text-[10px]">
          {calcRoi(c).toFixed(1)}x ROI
        </Badge>
        <p className={`text-xs font-semibold ${isTop ? 'text-emerald-600' : 'text-slate-500'}`}>
          {formatBRL(c.total_revenue_generated)}
        </p>
      </div>
    </Link>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-600" />
            Top 5 Performers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 p-2">
          {top5.map((c, i) => renderRow(c, i, true))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-amber-600" />
            Bottom 5 — Atenção
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 p-2">
          {bottom5.map((c, i) => renderRow(c, i, false))}
        </CardContent>
      </Card>
    </div>
  );
}