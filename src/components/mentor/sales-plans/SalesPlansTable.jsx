import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, Copy, GitBranch, History, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { PLAN_STATUS, REGULATORY_PROGRAMS } from '@/components/mentor/mocks/salesPlansMock';

const HealthIndicator = ({ score, status }) => {
  const color = score >= 90 ? 'bg-emerald-500' : score >= 75 ? 'bg-amber-500' : score > 0 ? 'bg-red-500' : 'bg-slate-300';
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${Math.min(score, 100)}%` }} />
      </div>
      <span className="text-[10px] font-bold">{score || '—'}</span>
    </div>
  );
};

export default function SalesPlansTable({ plans = [], selected = [], onToggleSelect, onToggleAll, onClone, onCompare }) {
  const allSelected = plans.length > 0 && selected.length === plans.length;

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="p-2 w-8"><Checkbox checked={allSelected} onCheckedChange={onToggleAll} /></th>
                <th className="text-left p-2 font-semibold">Plano</th>
                <th className="text-center p-2 font-semibold">Status</th>
                <th className="text-left p-2 font-semibold">Projeto</th>
                <th className="text-center p-2 font-semibold">Vigência</th>
                <th className="text-right p-2 font-semibold">Terminais</th>
                <th className="text-right p-2 font-semibold">TPV/mês</th>
                <th className="text-right p-2 font-semibold">Receita/mês</th>
                <th className="text-center p-2 font-semibold">Margem</th>
                <th className="text-center p-2 font-semibold">Drift</th>
                <th className="text-center p-2 font-semibold">Saúde</th>
                <th className="text-center p-2 font-semibold">Programas</th>
                <th className="text-center p-2 font-semibold">v</th>
                <th className="text-center p-2 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => {
                const status = PLAN_STATUS[p.status];
                const isSelected = selected.includes(p.id);
                return (
                  <tr key={p.id} className={`border-b hover:bg-slate-50 dark:hover:bg-slate-900 ${isSelected ? 'bg-violet-50 dark:bg-violet-900/20' : ''}`}>
                    <td className="p-2 text-center">
                      <Checkbox checked={isSelected} onCheckedChange={() => onToggleSelect?.(p.id)} />
                    </td>
                    <td className="p-2">
                      <Link to={`${createPageUrl('AdminIntSalesPlanDetail')}?id=${p.id}`} className="hover:text-violet-700">
                        <p className="font-bold text-sm">{p.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{p.code}</p>
                      </Link>
                    </td>
                    <td className="text-center p-2">
                      <Badge className={`text-[9px] ${status?.color}`}>{status?.label}</Badge>
                    </td>
                    <td className="p-2 text-[11px]">{p.project_name}</td>
                    <td className="text-center p-2 text-[10px]">
                      <p>{new Date(p.effective_from).toLocaleDateString('pt-BR')}</p>
                      <p className="text-slate-500">{p.effective_to ? `até ${new Date(p.effective_to).toLocaleDateString('pt-BR')}` : 'sem prazo'}</p>
                    </td>
                    <td className="text-right p-2 font-mono">{p.terminal_count.toLocaleString('pt-BR')}</td>
                    <td className="text-right p-2 font-mono">{p.monthly_tpv > 0 ? `${(p.monthly_tpv / 1_000_000).toFixed(1)}M` : '—'}</td>
                    <td className="text-right p-2 font-mono">{p.monthly_revenue > 0 ? `${(p.monthly_revenue / 1_000_000).toFixed(2)}M` : '—'}</td>
                    <td className="text-center p-2">
                      {p.avg_margin > 0 ? <Badge variant="outline" className="text-[9px]">{p.avg_margin.toFixed(1)}%</Badge> : '—'}
                    </td>
                    <td className="text-center p-2">
                      {p.drift_pct > 0 ? (
                        <Badge className={`text-[9px] ${p.drift_pct > 1.5 ? 'bg-red-100 text-red-700' : p.drift_pct > 1 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {p.drift_pct.toFixed(1)}%
                        </Badge>
                      ) : '—'}
                    </td>
                    <td className="text-center p-2"><HealthIndicator score={p.health_score} status={p.health_status} /></td>
                    <td className="text-center p-2">
                      <div className="flex justify-center gap-0.5">
                        {p.regulatory_programs?.slice(0, 3).map((rp) => (
                          <span key={rp} title={REGULATORY_PROGRAMS[rp]?.label} className="text-[10px]">
                            {REGULATORY_PROGRAMS[rp]?.icon}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="text-center p-2">
                      <Badge variant="outline" className="text-[9px]">v{p.version}</Badge>
                    </td>
                    <td className="text-center p-2">
                      <div className="flex justify-center gap-0.5">
                        <Button asChild size="icon" variant="ghost" className="h-7 w-7" title="Detalhes">
                          <Link to={`${createPageUrl('AdminIntSalesPlanDetail')}?id=${p.id}`}>
                            <Eye className="w-3 h-3" />
                          </Link>
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onClone?.(p)} title="Clonar">
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onCompare?.(p)} title="Comparar">
                          <GitBranch className="w-3 h-3" />
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