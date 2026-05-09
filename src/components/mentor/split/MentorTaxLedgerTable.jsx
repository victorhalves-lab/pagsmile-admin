import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator } from 'lucide-react';

const fmt = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

export default function MentorTaxLedgerTable({ entries = [] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Calculator className="w-4 h-4 text-violet-600" />
          Ledger Fiscal · Retenções por Transação
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="text-left p-2 font-bold text-slate-600 dark:text-slate-300">Beneficiário</th>
              <th className="text-left p-2 font-bold text-slate-600 dark:text-slate-300">Tipo</th>
              <th className="text-right p-2 font-bold text-slate-600 dark:text-slate-300">Bruto</th>
              <th className="text-right p-2 font-bold text-slate-600 dark:text-slate-300">IR</th>
              <th className="text-right p-2 font-bold text-slate-600 dark:text-slate-300">ISS</th>
              <th className="text-right p-2 font-bold text-slate-600 dark:text-slate-300">PIS/COFINS/CSLL</th>
              <th className="text-right p-2 font-bold text-slate-600 dark:text-slate-300">Líquido</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.entry_id} className="border-b last:border-0 dark:border-slate-700">
                <td className="p-2">
                  <p className="font-bold text-slate-800 dark:text-white">{e.beneficiary}</p>
                  <code className="text-[10px] text-slate-500">{e.document}</code>
                </td>
                <td className="p-2">
                  <Badge variant="outline" className="text-[10px]">
                    {e.type === 'individual' ? 'PF' : 'PJ'}
                  </Badge>
                </td>
                <td className="p-2 text-right font-semibold text-slate-700 dark:text-slate-200">{fmt(e.gross_amount)}</td>
                <td className="p-2 text-right text-red-700">-{fmt(e.ir_retained)}</td>
                <td className="p-2 text-right text-amber-700">-{fmt(e.iss_calculated)}</td>
                <td className="p-2 text-right text-cyan-700">{e.pcc_retained > 0 ? `-${fmt(e.pcc_retained)}` : '—'}</td>
                <td className="p-2 text-right font-black text-emerald-700">{fmt(e.net_to_beneficiary)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}