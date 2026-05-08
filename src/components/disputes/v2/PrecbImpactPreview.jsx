import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, ShieldCheck } from 'lucide-react';
import { fmtBRL } from './utils';

export default function PrecbImpactPreview({ alert }) {
  if (!alert) return null;
  const amount = alert.amount || 0;
  const brandFee = Math.max(15, amount * 0.04); // taxa estimada bandeira
  const ratioImpact = 0.02; // pp estimado
  const totalSaved = amount + brandFee;

  return (
    <Card className="border-emerald-200 bg-emerald-50/40">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <p className="text-xs font-bold text-emerald-900">Preview de impacto se reembolsar</p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-white rounded-md">
            <p className="text-[9px] uppercase font-bold text-slate-500">Custo do refund</p>
            <p className="text-sm font-black text-slate-700">{fmtBRL(amount)}</p>
          </div>
          <div className="p-2 bg-white rounded-md">
            <p className="text-[9px] uppercase font-bold text-slate-500">Evita CB + Taxa</p>
            <p className="text-sm font-black text-emerald-700">{fmtBRL(totalSaved)}</p>
          </div>
          <div className="p-2 bg-white rounded-md">
            <p className="text-[9px] uppercase font-bold text-slate-500">Ratio impact</p>
            <p className="text-sm font-black text-emerald-700">+{ratioImpact}pp</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-800">
          <TrendingUp className="w-3 h-3" />
          <span>
            <strong>Economiza ~{fmtBRL(brandFee)}</strong> em taxas + protege seu ratio vs ignorar.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}