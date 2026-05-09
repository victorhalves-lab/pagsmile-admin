import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitBranch, Clock, CheckCircle2, TrendingUp, Calendar, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

const STAGES = [
  { key: 'draft', label: 'Rascunho', icon: GitBranch, color: 'border-slate-300 bg-slate-50 dark:bg-slate-900' },
  { key: 'pending_approval', label: 'Em aprovação', icon: Clock, color: 'border-amber-300 bg-amber-50 dark:bg-amber-900/20' },
  { key: 'scheduled', label: 'Agendado', icon: Calendar, color: 'border-violet-300 bg-violet-50 dark:bg-violet-900/20' },
  { key: 'active', label: 'Vigente', icon: CheckCircle2, color: 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20' },
  { key: 'in_cutover', label: 'Em transição', icon: TrendingUp, color: 'border-blue-300 bg-blue-50 dark:bg-blue-900/20' },
  { key: 'discontinued', label: 'Descontinuado', icon: XCircle, color: 'border-red-300 bg-red-50 dark:bg-red-900/20' },
];

export default function SalesPlansLifecyclePipeline({ plans = [] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <GitBranch className="w-4 h-4" />Pipeline de ciclo de vida dos planos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {STAGES.map((stage) => {
            const stagePlans = plans.filter((p) => p.status === stage.key);
            return (
              <div key={stage.key} className={`rounded-lg border-2 ${stage.color} p-2.5`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <stage.icon className="w-3.5 h-3.5" />
                    <p className="text-[11px] font-bold">{stage.label}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-white dark:bg-slate-900">{stagePlans.length}</Badge>
                </div>
                <div className="space-y-1.5 max-h-44 overflow-y-auto">
                  {stagePlans.length === 0 && (
                    <p className="text-[10px] text-slate-400 italic">vazio</p>
                  )}
                  {stagePlans.map((p) => (
                    <Link
                      key={p.id}
                      to={`${createPageUrl('AdminIntSalesPlanDetail')}?id=${p.id}`}
                      className="block p-1.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 hover:border-violet-300 transition-colors"
                    >
                      <p className="text-[10px] font-semibold truncate">{p.name}</p>
                      <p className="text-[9px] text-slate-500 font-mono">{p.code}</p>
                      {p.terminal_count > 0 && (
                        <p className="text-[9px] text-slate-500 mt-0.5">{p.terminal_count} terminais</p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}