import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle2, Clock, AlertCircle, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const STATUS_META = {
  created: { label: 'Criado', color: 'bg-slate-100 text-slate-700', icon: Clock },
  in_validation: { label: 'Em validação', color: 'bg-blue-100 text-blue-700', icon: Clock },
  validated: { label: 'Validado', color: 'bg-cyan-100 text-cyan-700', icon: CheckCircle2 },
  in_execution: { label: 'Em execução', color: 'bg-amber-100 text-amber-700', icon: Zap },
  executed: { label: 'Executado', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  failed: { label: 'Falhou', color: 'bg-red-100 text-red-700', icon: AlertCircle },
  reverted: { label: 'Revertido', color: 'bg-violet-100 text-violet-700', icon: AlertCircle },
};

const fmt = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

export default function MentorSettlementHeaderCard({ settlement }) {
  const meta = STATUS_META[settlement.status] || STATUS_META.created;
  const Icon = meta.icon;

  const copy = (txt) => {
    navigator.clipboard.writeText(txt);
    toast.success('Copiado');
  };

  return (
    <Card className="border-violet-200 bg-gradient-to-br from-violet-50/40 to-white">
      <CardContent className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* ID + status */}
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Settlement ID</p>
            <div className="flex items-center gap-2 mb-2">
              <code className="text-sm font-mono font-bold text-slate-800">{settlement.settlement_id}</code>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copy(settlement.settlement_id)}>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={cn('gap-1', meta.color)}>
                <Icon className="w-3 h-3" /> {meta.label}
              </Badge>
              {settlement.sub_status && (
                <Badge variant="outline" className="text-[10px]">{settlement.sub_status}</Badge>
              )}
              <Badge variant="outline" className="text-[10px] uppercase">{settlement.type.replace('_', ' ')}</Badge>
              <Badge variant="outline" className="text-[10px] uppercase">{settlement.origin}</Badge>
            </div>
            {settlement.bank_reference && (
              <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                <span className="text-slate-500">Ref. bancária:</span>
                <code className="font-mono text-slate-700">{settlement.bank_reference}</code>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => copy(settlement.bank_reference)}>
                  <Copy className="w-2.5 h-2.5" />
                </Button>
              </div>
            )}
          </div>

          {/* Valor */}
          <div className="border-l border-slate-200 pl-4">
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Valor líquido a transferir</p>
            <p className="text-3xl font-black text-emerald-700">{fmt(settlement.financial.net_amount)}</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Bruto {fmt(settlement.financial.gross_amount)} · descontos {fmt(settlement.financial.gross_amount - settlement.financial.net_amount)}
            </p>
          </div>

          {/* Execução */}
          <div className="border-l border-slate-200 pl-4">
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Execução</p>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-100 text-emerald-700 text-[11px]">
                <Zap className="w-3 h-3 mr-1" /> {settlement.execution_method}
              </Badge>
              <span className="text-xs text-slate-600">
                {settlement.dates.actual_execution_at
                  ? new Date(settlement.dates.actual_execution_at).toLocaleString('pt-BR')
                  : `Prevista ${new Date(settlement.dates.expected_execution_at).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}`}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              SLA {settlement.dates.sla_target_hours}h · {settlement.dates.sla_status === 'within_sla' ? '✅ dentro' : '⚠️ atenção'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}