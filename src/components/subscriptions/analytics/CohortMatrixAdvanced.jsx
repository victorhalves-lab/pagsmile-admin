import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const cohorts = [
  { cohort: '2025-09', size: 42 },
  { cohort: '2025-10', size: 51 },
  { cohort: '2025-11', size: 38 },
  { cohort: '2025-12', size: 47 },
  { cohort: '2026-01', size: 62 },
  { cohort: '2026-02', size: 55 },
];

const buildRetention = (m) => Math.max(0, 100 - m * 6 - Math.random() * 8);

export default function CohortMatrixAdvanced({ onCellClick }) {
  const [dim, setDim] = useState('month');
  const months = Array.from({ length: 12 }).map((_, i) => i);

  const colorFor = (v) => {
    if (v >= 80) return 'bg-emerald-500 text-white';
    if (v >= 60) return 'bg-emerald-300 text-emerald-900';
    if (v >= 40) return 'bg-amber-300 text-amber-900';
    if (v >= 20) return 'bg-orange-300 text-orange-900';
    return 'bg-red-300 text-red-900';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Cohort retention matrix</CardTitle>
          <Select value={dim} onValueChange={setDim}>
            <SelectTrigger className="w-32 h-7 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="month" className="text-xs">Por mês</SelectItem>
              <SelectItem value="plan" className="text-xs">Por plano</SelectItem>
              <SelectItem value="origin" className="text-xs">Por origem</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="text-[10px]">
          <thead>
            <tr>
              <th className="p-1 text-left font-bold">Cohort</th>
              <th className="p-1 text-center font-bold">Size</th>
              {months.map((m) => <th key={m} className="p-1 text-center font-bold w-10">M{m}</th>)}
            </tr>
          </thead>
          <tbody>
            {cohorts.map((row) => (
              <tr key={row.cohort}>
                <td className="p-1 font-bold">{row.cohort}</td>
                <td className="p-1 text-center text-slate-500">{row.size}</td>
                {months.map((m) => {
                  const v = buildRetention(m);
                  return (
                    <td key={m} className="p-0.5">
                      <button
                        onClick={() => onCellClick?.(row, m, Math.round(v))}
                        className={cn('w-full h-7 rounded font-bold text-[10px]', colorFor(v))}
                      >
                        {Math.round(v)}%
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}