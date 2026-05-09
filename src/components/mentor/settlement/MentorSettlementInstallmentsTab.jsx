import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Layers, Download, RefreshCw, Zap, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const fmt = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

const STATUS_META = {
  paid: { color: 'bg-emerald-500', label: 'Paga', textColor: 'text-emerald-700', bg: 'bg-emerald-50' },
  scheduled: { color: 'bg-slate-300', label: 'Agendada', textColor: 'text-slate-600', bg: 'bg-slate-50' },
  in_progress: { color: 'bg-amber-500', label: 'Em execução', textColor: 'text-amber-700', bg: 'bg-amber-50' },
  failed: { color: 'bg-red-500', label: 'Falhou', textColor: 'text-red-700', bg: 'bg-red-50' },
};

export default function MentorSettlementInstallmentsTab({ data }) {
  if (!data || data.total_installments === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-sm text-slate-500">
          Este pagamento não possui parcelas — é uma liquidação única.
        </CardContent>
      </Card>
    );
  }

  const progress = (data.paid_installments / data.total_installments) * 100;

  return (
    <div className="space-y-3">
      {/* Totalizadores */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-violet-600" /> Resumo das parcelas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
            <div className="bg-slate-50 rounded p-2 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-500">Total</p>
              <p className="text-lg font-black">{data.total_installments}</p>
            </div>
            <div className="bg-emerald-50 rounded p-2 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-500">Pagas</p>
              <p className="text-lg font-black text-emerald-700">{data.paid_installments}</p>
            </div>
            <div className="bg-slate-50 rounded p-2 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-500">Pago</p>
              <p className="text-base font-black text-emerald-700">{fmt(data.paid_value)}</p>
            </div>
            <div className="bg-amber-50 rounded p-2 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-500">A liquidar</p>
              <p className="text-base font-black text-amber-700">{fmt(data.pending_value)}</p>
            </div>
            <div className="bg-violet-50 rounded p-2 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-500">Valor médio</p>
              <p className="text-base font-black text-violet-700">{fmt(data.avg_amount)}</p>
            </div>
          </div>
          {/* Barra de progresso */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-600">
              <span>Progresso</span>
              <span className="font-bold">{progress.toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-violet-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => toast.success('Cronograma exportado')}>
              <Download className="w-3 h-3 mr-1" /> Exportar cronograma
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timeline visual */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Timeline de parcelas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto pb-2">
            <div className="flex items-stretch gap-1 min-w-max">
              {data.installments.map((inst) => {
                const meta = STATUS_META[inst.status] || STATUS_META.scheduled;
                return (
                  <div
                    key={inst.number}
                    className={cn('flex flex-col items-center gap-1 px-2 py-2 rounded border min-w-[70px]', meta.bg)}
                    title={`Parcela ${inst.number}/${inst.total} · ${inst.status}`}
                  >
                    <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold', meta.color)}>
                      {inst.number}
                    </div>
                    <span className="text-[9px] text-slate-500">{new Date(inst.expected_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                    <span className={cn('text-[10px] font-bold', meta.textColor)}>{fmt(inst.amount)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista detalhada */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Lista de parcelas</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-2 font-bold text-slate-600">#</th>
                <th className="text-left p-2 font-bold text-slate-600">Status</th>
                <th className="text-left p-2 font-bold text-slate-600">Prevista</th>
                <th className="text-left p-2 font-bold text-slate-600">Efetiva</th>
                <th className="text-right p-2 font-bold text-slate-600">Valor</th>
                <th className="text-left p-2 font-bold text-slate-600">Método</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {data.installments.map((inst) => {
                const meta = STATUS_META[inst.status] || STATUS_META.scheduled;
                const Icon = inst.status === 'paid' ? CheckCircle2 : inst.status === 'failed' ? AlertTriangle : Clock;
                return (
                  <tr key={inst.number} className="border-b last:border-0 hover:bg-violet-50/40">
                    <td className="p-2 font-bold">{inst.number}/{inst.total}</td>
                    <td className="p-2">
                      <Badge className={cn('text-[9px] gap-0.5', meta.bg, meta.textColor)}>
                        <Icon className="w-2.5 h-2.5" /> {meta.label}
                      </Badge>
                    </td>
                    <td className="p-2 text-slate-600">{new Date(inst.expected_at).toLocaleDateString('pt-BR')}</td>
                    <td className="p-2 text-slate-600">{inst.actual_at ? new Date(inst.actual_at).toLocaleDateString('pt-BR') : '—'}</td>
                    <td className="p-2 text-right font-bold">{fmt(inst.amount)}</td>
                    <td className="p-2"><Badge variant="outline" className="text-[10px]">{inst.method}</Badge></td>
                    <td className="p-2">
                      {inst.status === 'failed' && (
                        <Button variant="outline" size="sm" className="h-6 text-[10px]" onClick={() => toast.success(`Parcela ${inst.number} reprocessada`)}>
                          <RefreshCw className="w-2.5 h-2.5 mr-1" /> Reprocessar
                        </Button>
                      )}
                      {inst.status === 'scheduled' && (
                        <Button variant="ghost" size="sm" className="h-6 text-[10px] text-violet-600" onClick={() => toast.success(`Parcela ${inst.number} antecipada`)}>
                          <Zap className="w-2.5 h-2.5 mr-1" /> Antecipar
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}