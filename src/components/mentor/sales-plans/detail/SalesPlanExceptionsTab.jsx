import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Plus } from 'lucide-react';
import { MOCK_PLAN_EXCEPTIONS } from '@/components/mentor/mocks/salesPlansMock';

export default function SalesPlanExceptionsTab({ planId }) {
  const exceptions = MOCK_PLAN_EXCEPTIONS.filter((e) => e.plan_id === planId);
  const permanentCount = exceptions.filter((e) => e.status === 'permanent').length;
  const totalImpact = exceptions.reduce((acc, e) => acc + Math.abs(e.delta), 0);

  return (
    <div className="space-y-4">
      <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-200">
        <CardContent className="p-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 mt-0.5" />
          <div className="flex-1 text-xs text-amber-900 dark:text-amber-200">
            <p className="font-bold">{exceptions.length} exceção(ões) ativa(s) · {permanentCount} permanente(s)</p>
            <p className="mt-0.5">
              Custo cumulativo das exceções: <strong>{totalImpact.toFixed(2)}pp de margem</strong>.
              {permanentCount > 0 && ' Exceções permanentes >180 dias são candidatas a virar planos próprios.'}
            </p>
          </div>
          <Button size="sm" variant="outline">
            <Plus className="w-3 h-3 mr-1" />Nova exceção
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Exceções comerciais ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b bg-slate-50 dark:bg-slate-900">
                <tr>
                  <th className="text-left p-2 font-semibold">Merchant</th>
                  <th className="text-center p-2 font-semibold">MCC</th>
                  <th className="text-right p-2 font-semibold">Plano</th>
                  <th className="text-right p-2 font-semibold">Negociado</th>
                  <th className="text-center p-2 font-semibold">Δ</th>
                  <th className="text-left p-2 font-semibold">Razão</th>
                  <th className="text-center p-2 font-semibold">Aprovador</th>
                  <th className="text-center p-2 font-semibold">Vigência</th>
                  <th className="text-center p-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {exceptions.map((e) => (
                  <tr key={e.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-900">
                    <td className="p-2 font-bold">{e.merchant_name}</td>
                    <td className="text-center p-2 font-mono">{e.mcc}</td>
                    <td className="text-right p-2 font-mono">{e.plan_rate.toFixed(2)}%</td>
                    <td className="text-right p-2 font-mono font-bold text-violet-700">{e.requested_rate.toFixed(2)}%</td>
                    <td className="text-center p-2">
                      <Badge className={`text-[9px] ${e.delta < 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {e.delta > 0 ? '+' : ''}{e.delta.toFixed(2)}pp
                      </Badge>
                    </td>
                    <td className="p-2 text-[10px] italic max-w-[200px]">"{e.reason}"</td>
                    <td className="text-center p-2 text-[10px]">{e.approved_by.split('@')[0]}</td>
                    <td className="text-center p-2 text-[10px]">
                      {e.expires_at ? new Date(e.expires_at).toLocaleDateString('pt-BR') : 'permanente'}
                    </td>
                    <td className="text-center p-2">
                      <Badge className={`text-[9px] ${e.status === 'active' ? 'bg-emerald-100 text-emerald-700' : e.status === 'permanent' ? 'bg-violet-100 text-violet-700' : 'bg-amber-100 text-amber-700'}`}>
                        {e.status === 'active' ? 'Ativa' : e.status === 'permanent' ? 'Permanente' : 'Expirando'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {exceptions.length === 0 && <p className="text-xs text-slate-500 italic text-center py-4">Sem exceções ativas neste plano.</p>}
        </CardContent>
      </Card>
    </div>
  );
}