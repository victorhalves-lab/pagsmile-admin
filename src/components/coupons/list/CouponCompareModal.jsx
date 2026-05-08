import React from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftRight } from 'lucide-react';
import { formatBRL, calcRoi, calcConversion } from '../utils';

export default function CouponCompareModal({ open, onOpenChange, coupons }) {
  if (coupons.length !== 2) return null;
  const [a, b] = coupons;

  const rows = [
    { label: 'Tipo', a: a.type === 'percentage' ? 'Percentual' : 'Fixo', b: b.type === 'percentage' ? 'Percentual' : 'Fixo' },
    { label: 'Valor', a: a.type === 'percentage' ? `${a.value}%` : formatBRL(a.value), b: b.type === 'percentage' ? `${b.value}%` : formatBRL(b.value) },
    { label: 'Status', a: a.status, b: b.status },
    { label: 'Usos', a: a.times_used, b: b.times_used, compare: 'higher' },
    { label: 'Desconto total', a: formatBRL(a.total_discount_given), b: formatBRL(b.total_discount_given) },
    { label: 'Receita gerada', a: formatBRL(a.total_revenue_generated), b: formatBRL(b.total_revenue_generated), compare: 'higher' },
    { label: 'ROI', a: `${calcRoi(a).toFixed(1)}x`, b: `${calcRoi(b).toFixed(1)}x`, compare: 'higher' },
    { label: 'Conversão', a: `${calcConversion(a).toFixed(1)}%`, b: `${calcConversion(b).toFixed(1)}%`, compare: 'higher' },
    { label: 'Empilhável', a: a.is_stackable ? 'Sim' : 'Não', b: b.is_stackable ? 'Sim' : 'Não' },
    { label: 'Nominal', a: a.is_nominal ? 'Sim' : 'Não', b: b.is_nominal ? 'Sim' : 'Não' },
  ];

  const compareCells = (row) => {
    if (!row.compare) return [false, false];
    const valA = parseFloat(String(row.a).replace(/[^\d.-]/g, ''));
    const valB = parseFloat(String(row.b).replace(/[^\d.-]/g, ''));
    if (isNaN(valA) || isNaN(valB)) return [false, false];
    return [valA > valB, valB > valA];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4" />
            Comparar 2 cupons
          </DialogTitle>
        </DialogHeader>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 text-xs text-slate-500 font-medium">Métrica</th>
              <th className="text-center py-2">
                <p className="font-mono font-bold">{a.code}</p>
                <p className="text-[10px] text-slate-500 font-normal">{a.name}</p>
              </th>
              <th className="text-center py-2">
                <p className="font-mono font-bold">{b.code}</p>
                <p className="text-[10px] text-slate-500 font-normal">{b.name}</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const [aWins, bWins] = compareCells(r);
              return (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-2 text-xs text-slate-600">{r.label}</td>
                  <td className={`text-center py-2 text-sm ${aWins ? 'font-bold text-emerald-600' : ''}`}>
                    {r.a}
                    {aWins && <Badge className="ml-1 text-[8px] bg-emerald-100 text-emerald-700 border-0">★</Badge>}
                  </td>
                  <td className={`text-center py-2 text-sm ${bWins ? 'font-bold text-emerald-600' : ''}`}>
                    {r.b}
                    {bWins && <Badge className="ml-1 text-[8px] bg-emerald-100 text-emerald-700 border-0">★</Badge>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </DialogContent>
    </Dialog>
  );
}