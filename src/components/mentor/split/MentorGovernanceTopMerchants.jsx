import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Building2, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const fmtBRL = (n) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);

const scoreColor = (score) =>
  score >= 85
    ? 'bg-emerald-100 text-emerald-700'
    : score >= 70
      ? 'bg-amber-100 text-amber-700'
      : 'bg-red-100 text-red-700';

export default function MentorGovernanceTopMerchants({ merchants = [] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Crown className="w-4 h-4 text-violet-600" />
          Top Merchants por TPV de Splits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {merchants.map((m) => (
          <div
            key={m.rank}
            className="flex items-center justify-between gap-2 p-2.5 rounded-lg border bg-white dark:bg-slate-800 dark:border-slate-700 hover:shadow-sm transition cursor-pointer flex-wrap"
          >
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0',
                  m.rank === 1
                    ? 'bg-amber-100 text-amber-700'
                    : m.rank === 2
                      ? 'bg-slate-200 text-slate-600'
                      : m.rank === 3
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-slate-100 text-slate-500'
                )}
              >
                #{m.rank}
              </div>
              <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{m.merchant}</p>
                <p className="text-[10px] text-slate-500">
                  {m.splits} split(s) · {m.recipients} beneficiário(s)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-black text-slate-800 dark:text-white">{fmtBRL(m.tpv)}</p>
                <p className="text-[10px] text-slate-500">TPV 30d</p>
              </div>
              <Badge className={cn('text-[10px] flex-shrink-0', scoreColor(m.compliance_score))}>
                {m.compliance_score}/100
              </Badge>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}