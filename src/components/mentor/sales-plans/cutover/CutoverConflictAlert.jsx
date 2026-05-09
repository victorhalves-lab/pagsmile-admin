import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const MOCK_CONFLICTS = [
  { id: 'cf_001', date: '2026-05-15', plans: ['SP-BR-2026-003', 'SP-BR-2026-007'], shared_terminals: 23, severity: 'medium', detail: 'Merchants no overlap de marketplace receberão duas comunicações em datas próximas' },
  { id: 'cf_002', date: '2026-07-01', plans: ['SP-BR-2026-006', 'SP-BR-2026-008'], shared_terminals: 156, severity: 'high', detail: 'Cutover simultâneo de plano principal + plano vertical educação · risco de confusão na régua' },
];

export default function CutoverConflictAlert() {
  if (MOCK_CONFLICTS.length === 0) return null;

  return (
    <Card className="border-amber-300 bg-amber-50 dark:bg-amber-900/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2 text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-4 h-4" />Conflitos de cutover detectados ({MOCK_CONFLICTS.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {MOCK_CONFLICTS.map((c) => (
          <div key={c.id} className="p-2.5 rounded bg-white dark:bg-slate-900 border border-amber-200">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div className="flex-1 min-w-[220px]">
                <div className="flex items-center gap-1.5 mb-1">
                  <Badge className={`text-[9px] ${c.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {c.severity === 'high' ? 'ALTA' : 'MÉDIA'}
                  </Badge>
                  <span className="text-[11px] font-bold">{new Date(c.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <p className="text-[11px] mb-1">
                  Planos sobrepostos: {c.plans.map((p, i) => (
                    <span key={p}><span className="font-mono font-bold">{p}</span>{i < c.plans.length - 1 ? ' + ' : ''}</span>
                  ))}
                </p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">
                  <strong>{c.shared_terminals}</strong> estabelecimentos afetados por ambos · {c.detail}
                </p>
              </div>
              <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => toast.info('Abrindo wizard de resolução · realocação de cutover ou unificação de comunicações')}>
                Resolver
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}