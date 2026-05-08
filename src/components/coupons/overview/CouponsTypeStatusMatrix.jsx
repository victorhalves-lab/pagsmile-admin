import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Grid3x3 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Substitui os 2 PieCharts por uma matriz tipo × status (mais densa, menos ruído).
 */
export default function CouponsTypeStatusMatrix({ coupons }) {
  const types = [
    { key: 'percentage', label: 'Percentual' },
    { key: 'fixed_amount', label: 'Valor Fixo' },
  ];
  const statuses = [
    { key: 'active', label: 'Ativos', color: 'bg-emerald-500' },
    { key: 'inactive', label: 'Inativos', color: 'bg-slate-400' },
    { key: 'expired', label: 'Expirados', color: 'bg-amber-500' },
    { key: 'depleted', label: 'Esgotados', color: 'bg-red-500' },
  ];

  const matrix = types.map((t) => ({
    type: t,
    cells: statuses.map((s) => coupons.filter((c) => c.type === t.key && c.status === s.key).length),
  }));

  const max = Math.max(...matrix.flatMap((r) => r.cells), 1);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Grid3x3 className="w-4 h-4" />
          Matriz Tipo × Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left p-1.5"></th>
                {statuses.map((s) => (
                  <th key={s.key} className="p-1.5 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={cn('w-2 h-2 rounded-full', s.color)} />
                      <span className="text-[10px] font-medium">{s.label}</span>
                    </div>
                  </th>
                ))}
                <th className="p-1.5 text-center text-[10px] font-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((row) => {
                const rowTotal = row.cells.reduce((s, n) => s + n, 0);
                return (
                  <tr key={row.type.key}>
                    <td className="p-1.5 font-medium text-xs">{row.type.label}</td>
                    {row.cells.map((cell, i) => {
                      const intensity = cell / max;
                      return (
                        <td key={i} className="p-1.5">
                          <div
                            className={cn(
                              'rounded text-center font-bold py-2 transition-colors',
                              cell === 0
                                ? 'bg-slate-50 dark:bg-slate-800 text-slate-300'
                                : 'text-white'
                            )}
                            style={cell > 0 ? { backgroundColor: `rgba(43,193,150,${0.3 + intensity * 0.7})` } : {}}
                          >
                            {cell}
                          </div>
                        </td>
                      );
                    })}
                    <td className="p-1.5 text-center font-bold">{rowTotal}</td>
                  </tr>
                );
              })}
              <tr className="border-t border-slate-200">
                <td className="p-1.5 text-[10px] font-bold">Total</td>
                {statuses.map((s, i) => {
                  const colTotal = matrix.reduce((sum, r) => sum + r.cells[i], 0);
                  return (
                    <td key={s.key} className="p-1.5 text-center font-bold">{colTotal}</td>
                  );
                })}
                <td className="p-1.5 text-center font-bold text-[#2bc196]">{coupons.length}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}