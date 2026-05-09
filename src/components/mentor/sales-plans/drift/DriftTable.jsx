import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { toast } from 'sonner';

const SEV_CFG = {
  low: { color: 'bg-blue-100 text-blue-700', label: 'BAIXA' },
  medium: { color: 'bg-amber-100 text-amber-700', label: 'MÉDIA' },
  high: { color: 'bg-red-100 text-red-700', label: 'ALTA' },
};

export default function DriftTable({ drifts = [] }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="text-left p-2 font-semibold">Plano · Campo</th>
                <th className="text-center p-2 font-semibold">Severidade</th>
                <th className="text-right p-2 font-semibold">Configurado</th>
                <th className="text-right p-2 font-semibold">Realizado</th>
                <th className="text-center p-2 font-semibold">Δ</th>
                <th className="text-right p-2 font-semibold">Transações</th>
                <th className="text-right p-2 font-semibold">Impacto receita</th>
                <th className="text-left p-2 font-semibold">Causa raiz</th>
                <th className="text-center p-2 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {drifts.map((d) => {
                const sev = SEV_CFG[d.severity];
                return (
                  <tr key={d.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-900">
                    <td className="p-2">
                      <p className="font-bold text-[11px]">{d.plan_name}</p>
                      <p className="text-[9px] text-slate-500 font-mono">{d.plan_code} · {d.field_label}</p>
                    </td>
                    <td className="text-center p-2">
                      <Badge className={`text-[9px] ${sev?.color}`}>{sev?.label}</Badge>
                    </td>
                    <td className="text-right p-2 font-mono">{d.configured.toFixed(2)}%</td>
                    <td className="text-right p-2 font-mono">{d.realized.toFixed(2)}%</td>
                    <td className="text-center p-2">
                      <Badge className={`text-[9px] ${d.delta < 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {d.delta > 0 ? '+' : ''}{d.delta.toFixed(2)}pp
                      </Badge>
                    </td>
                    <td className="text-right p-2 font-mono">{(d.transactions_affected / 1000).toFixed(0)}k</td>
                    <td className="text-right p-2 font-mono font-bold text-red-600">
                      R$ {(Math.abs(d.revenue_impact) / 1000).toFixed(0)}k
                    </td>
                    <td className="p-2 text-[10px] max-w-[280px]">
                      <p className="italic text-slate-600 dark:text-slate-400">{d.root_cause}</p>
                    </td>
                    <td className="text-center p-2">
                      <div className="flex justify-center gap-0.5">
                        <Button asChild size="icon" variant="ghost" className="h-7 w-7" title="Ver plano">
                          <Link to={`${createPageUrl('AdminIntSalesPlanDetail')}?id=${d.plan_id}`}>
                            <Eye className="w-3 h-3" />
                          </Link>
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" title="Resolver" onClick={() => toast.info(`Sugestão IA: "${d.recommendation}"`)}>
                          <Wrench className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}