import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, User, Building2, Store, CreditCard } from 'lucide-react';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

/**
 * Diagrama visual de como o split funciona — diferencial vs concorrentes.
 * Mostra o fluxo: Cliente → PagSmile → distribuição entre recipients.
 */
export default function SplitFlowDiagram({ rule, sampleAmount = 100 }) {
  if (!rule) return null;

  const recipients = rule.recipients || [];
  const psFee = sampleAmount * 0.04; // 4% mock
  const brandFee = sampleAmount * 0.025; // 2.5% mock
  const netAfterFees = sampleAmount - psFee - brandFee;

  const calcRecipient = (r) => {
    if (r.type === 'percentage') return (netAfterFees * (r.value || 0)) / 100;
    return r.value || 0;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Como funciona este split</CardTitle>
        <p className="text-xs text-slate-500">Exemplo com transação de {formatCurrency(sampleAmount)}</p>
      </CardHeader>
      <CardContent>
        {/* Fluxo horizontal em desktop, vertical em mobile */}
        <div className="space-y-4">
          {/* Cliente paga */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-blue-700" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-blue-700 uppercase font-semibold">1. Cliente paga</p>
              <p className="font-bold text-slate-800">{formatCurrency(sampleAmount)}</p>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="w-5 h-5 text-slate-400 rotate-90" />
          </div>

          {/* Fees */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-[10px] uppercase text-slate-500 font-semibold">PagSmile (MDR)</p>
              <p className="text-sm font-semibold text-red-600">-{formatCurrency(psFee)}</p>
              <p className="text-[10px] text-slate-400">4%</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-[10px] uppercase text-slate-500 font-semibold">Bandeira</p>
              <p className="text-sm font-semibold text-red-600">-{formatCurrency(brandFee)}</p>
              <p className="text-[10px] text-slate-400">2.5%</p>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 py-1">
            Líquido para distribuir: <strong className="text-slate-800">{formatCurrency(netAfterFees)}</strong>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="w-5 h-5 text-slate-400 rotate-90" />
          </div>

          {/* Recipients */}
          <div className="space-y-2">
            <p className="text-xs text-slate-500 uppercase font-semibold mb-2">2. Distribuição</p>
            {recipients.map((r, idx) => {
              const value = calcRecipient(r);
              const pct = netAfterFees > 0 ? (value / netAfterFees) * 100 : 0;
              return (
                <div key={idx} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <div className="w-9 h-9 rounded-full bg-emerald-200 flex items-center justify-center flex-shrink-0">
                    {idx === 0 ? <Store className="w-4 h-4 text-emerald-700" /> : <Building2 className="w-4 h-4 text-emerald-700" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{r.name || `Recebedor ${idx + 1}`}</p>
                    <p className="text-[11px] text-slate-500">
                      {r.type === 'percentage' ? `${r.value}%` : 'Valor fixo'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-700">{formatCurrency(value)}</p>
                    <p className="text-[10px] text-slate-500">{pct.toFixed(1)}% do líquido</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}