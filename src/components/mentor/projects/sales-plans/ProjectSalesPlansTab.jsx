import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { MOCK_SALES_PLANS, PLAN_STATUS } from '@/components/mentor/mocks/salesPlansMock';

export default function ProjectSalesPlansTab({ projectId }) {
  const plans = MOCK_SALES_PLANS.filter((p) => p.project_id === projectId);
  const active = plans.filter((p) => p.status === 'active');
  const inCutover = plans.filter((p) => p.status === 'in_cutover');
  const pending = plans.filter((p) => p.status === 'pending_approval');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card><CardContent className="p-3"><p className="text-[10px] uppercase text-slate-500 font-bold">Vigentes</p><p className="text-2xl font-bold text-emerald-600">{active.length}</p></CardContent></Card>
        <Card><CardContent className="p-3"><p className="text-[10px] uppercase text-slate-500 font-bold">Em transição</p><p className="text-2xl font-bold text-blue-600">{inCutover.length}</p></CardContent></Card>
        <Card><CardContent className="p-3"><p className="text-[10px] uppercase text-slate-500 font-bold">Em aprovação</p><p className="text-2xl font-bold text-amber-600">{pending.length}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2"><FileText className="w-4 h-4" />Planos do projeto ({plans.length})</span>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link to={createPageUrl('AdminIntSalesPlans')}>
                  <ExternalLink className="w-3 h-3 mr-1" />Ver hub completo
                </Link>
              </Button>
              <Button size="sm">
                <Plus className="w-3 h-3 mr-1" />Novo plano
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {plans.map((p) => {
              const status = PLAN_STATUS[p.status];
              return (
                <Link
                  key={p.id}
                  to={`${createPageUrl('AdminIntSalesPlanDetail')}?id=${p.id}`}
                  className="block p-3 rounded-lg border hover:border-violet-300 hover:bg-violet-50/30 dark:hover:bg-violet-900/10 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`text-[9px] ${status?.color}`}>{status?.label}</Badge>
                        <Badge variant="outline" className="text-[9px]">v{p.version}</Badge>
                        <span className="text-[10px] text-slate-500 font-mono">{p.code}</span>
                      </div>
                      <p className="text-sm font-bold">{p.name}</p>
                      <p className="text-[10px] text-slate-500">{p.description}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="text-center">
                        <p className="text-[9px] text-slate-500">Estabelecimentos</p>
                        <p className="font-bold">{p.terminal_count.toLocaleString('pt-BR')}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] text-slate-500">TPV/mês</p>
                        <p className="font-bold">{p.monthly_tpv > 0 ? `R$ ${(p.monthly_tpv / 1_000_000).toFixed(0)}M` : '—'}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] text-slate-500">Margem</p>
                        <p className="font-bold">{p.avg_margin > 0 ? `${p.avg_margin.toFixed(1)}%` : '—'}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          {plans.length === 0 && <p className="text-xs text-slate-500 italic text-center py-4">Nenhum plano cadastrado para este projeto.</p>}
        </CardContent>
      </Card>
    </div>
  );
}