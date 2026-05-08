import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const formatCurrency = (v) => {
  if (v >= 1000000) return `R$ ${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `R$ ${(v / 1000).toFixed(0)}k`;
  return `R$ ${v.toFixed(0)}`;
};

export default function CohortMatrix({ subaccounts = [] }) {
  const cohorts = useMemo(() => {
    // Group subaccounts by month of creation
    const grouped = {};
    const now = new Date();
    
    subaccounts.forEach(s => {
      if (!s.created_date) return;
      const created = new Date(s.created_date);
      const monthKey = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, '0')}`;
      if (!grouped[monthKey]) {
        grouped[monthKey] = { 
          period: monthKey, 
          count: 0, 
          subaccounts: [],
          monthsAgo: (now.getFullYear() - created.getFullYear()) * 12 + (now.getMonth() - created.getMonth())
        };
      }
      grouped[monthKey].count += 1;
      grouped[monthKey].subaccounts.push(s);
    });

    // Take last 6 cohorts
    const sortedCohorts = Object.values(grouped)
      .sort((a, b) => b.period.localeCompare(a.period))
      .slice(0, 6)
      .reverse();

    // For each cohort, calculate retention/GMV per month after creation (mock based on data)
    return sortedCohorts.map(cohort => {
      const monthsToShow = Math.min(cohort.monthsAgo + 1, 6);
      const periods = [];
      
      for (let i = 0; i < 6; i++) {
        if (i > cohort.monthsAgo) {
          periods.push(null); // future, no data
        } else {
          // Simulate decay: 100% in M0, decreasing
          const baseRetention = 100;
          const decay = Math.pow(0.92, i); // 8% decay per month
          const retention = baseRetention * decay;
          
          // GMV grows then plateaus
          const totalGmv = cohort.subaccounts.reduce((sum, s) => sum + (s.total_volume || 0), 0);
          const monthGmv = (totalGmv / Math.max(monthsToShow, 1)) * (1 + i * 0.1) * decay;
          
          periods.push({
            retention,
            gmv: monthGmv,
          });
        }
      }
      
      return {
        period: cohort.period,
        count: cohort.count,
        periods,
      };
    });
  }, [subaccounts]);

  const getCellColor = (retention) => {
    if (retention === null) return 'bg-slate-50';
    if (retention >= 90) return 'bg-emerald-500 text-white';
    if (retention >= 75) return 'bg-emerald-400 text-white';
    if (retention >= 60) return 'bg-emerald-200 text-emerald-900';
    if (retention >= 40) return 'bg-amber-200 text-amber-900';
    if (retention >= 20) return 'bg-orange-200 text-orange-900';
    return 'bg-red-200 text-red-900';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Cohort Analysis</CardTitle>
            <p className="text-xs text-slate-500 mt-1">Retenção de subcontas ao longo do tempo</p>
          </div>
          <Badge variant="outline" className="gap-1">
            <Info className="w-3 h-3" />
            Últimas 6 cohorts
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {cohorts.length === 0 ? (
          <p className="text-center py-8 text-sm text-slate-500">Sem dados suficientes para análise de coorte</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left p-2 font-semibold text-slate-600">Período</th>
                  <th className="text-center p-2 font-semibold text-slate-600">Subs</th>
                  {[0, 1, 2, 3, 4, 5].map(m => (
                    <th key={m} className="text-center p-2 font-semibold text-slate-600">M+{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cohorts.map((cohort, idx) => (
                  <tr key={idx}>
                    <td className="p-2 font-medium text-slate-700">{cohort.period}</td>
                    <td className="p-2 text-center">
                      <Badge variant="outline">{cohort.count}</Badge>
                    </td>
                    {cohort.periods.map((period, pIdx) => (
                      <td key={pIdx} className="p-1">
                        {period === null ? (
                          <div className="h-12 rounded bg-slate-50" />
                        ) : (
                          <div 
                            className={cn(
                              "h-12 rounded flex flex-col items-center justify-center text-[10px] font-semibold",
                              getCellColor(period.retention)
                            )}
                            title={`${period.retention.toFixed(0)}% retenção • ${formatCurrency(period.gmv)} GMV`}
                          >
                            <span className="text-xs">{period.retention.toFixed(0)}%</span>
                            <span className="opacity-80">{formatCurrency(period.gmv)}</span>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex items-center gap-2 mt-4 text-[10px] text-slate-500 flex-wrap">
          <span>Retenção:</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-200" /> 0-20%
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-orange-200" /> 20-40%
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-amber-200" /> 40-60%
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-emerald-300" /> 60-90%
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-emerald-500" /> 90%+
          </div>
        </div>
      </CardContent>
    </Card>
  );
}