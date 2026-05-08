import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { RotateCcw, Clock, CheckCircle2, XCircle, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import StatusBadge from '@/components/common/StatusBadge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/**
 * Aba dedicada a Reembolsos (refunds + partial_refunds + voids).
 * KPIs específicos + filtros próprios + mass actions.
 */
export default function RefundsView() {
  const [reasonFilter, setReasonFilter] = useState('all');
  const [requesterFilter, setRequesterFilter] = useState('all');
  const [selected, setSelected] = useState([]);

  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

  const { data: transactions = [] } = useQuery({
    queryKey: ['refund-transactions'],
    queryFn: () => base44.entities.Transaction.list('-created_date', 500),
  });

  const refunds = useMemo(() => {
    return transactions.filter(t =>
      ['refunded', 'partial_refunded', 'voided'].includes(t.status) ||
      ['refund', 'partial_refund', 'void'].includes(t.type)
    );
  }, [transactions]);

  const stats = useMemo(() => {
    const requested = refunds.length;
    const processed = refunds.filter(r => r.status === 'refunded' || r.status === 'voided').length;
    const pending = refunds.filter(r => r.status === 'partial_refunded' || r.status === 'pending').length;
    const total = refunds.reduce((s, r) => s + (r.amount || 0), 0);
    const avg = requested > 0 ? total / requested : 0;
    return { requested, processed, pending, total, avg };
  }, [refunds]);

  const filtered = useMemo(() => {
    let r = [...refunds];
    if (reasonFilter !== 'all') r = r.filter(t => t.refusal_reason?.includes(reasonFilter));
    if (requesterFilter !== 'all') {
      r = r.filter(t => requesterFilter === 'merchant' ? t.metadata?.requested_by === 'merchant' : t.metadata?.requested_by !== 'merchant');
    }
    return r;
  }, [refunds, reasonFilter, requesterFilter]);

  const toggleSelect = (id) => {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const approveBatch = () => {
    toast.success(`${selected.length} reembolsos aprovados em lote`);
    setSelected([]);
  };

  const massRefund = () => {
    toast.success('Devolução em massa iniciada — você será notificado ao concluir');
  };

  const cards = [
    { label: 'Solicitados', value: stats.requested, icon: RotateCcw, tone: 'blue' },
    { label: 'Processados', value: stats.processed, icon: CheckCircle2, tone: 'emerald' },
    { label: 'Pendentes', value: stats.pending, icon: Clock, tone: 'amber' },
    { label: 'Valor médio', value: formatCurrency(stats.avg), icon: XCircle, tone: 'slate' },
  ];

  const tones = {
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
    slate: 'bg-slate-50 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300',
  };

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className={cn("rounded-xl border border-slate-100 dark:border-slate-700 p-4", tones[c.tone])}>
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5 opacity-60" />
              </div>
              <p className="text-[10px] uppercase tracking-wide font-medium opacity-70">{c.label}</p>
              <p className="text-2xl font-bold mt-0.5">{c.value}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Volume total reembolsado</p>
          <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(stats.total)}</p>
        </div>
        <Button variant="outline" className="bg-white" onClick={massRefund}>
          Devolução em massa
        </Button>
      </div>

      {/* Filtros + Mass actions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex flex-wrap items-center gap-2">
        <Select value={reasonFilter} onValueChange={setReasonFilter}>
          <SelectTrigger className="w-[200px] h-9"><SelectValue placeholder="Motivo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os motivos</SelectItem>
            <SelectItem value="customer">Solicitação do cliente</SelectItem>
            <SelectItem value="duplicate">Pagamento duplicado</SelectItem>
            <SelectItem value="cancellation">Cancelamento</SelectItem>
            <SelectItem value="fraud">Suspeita de fraude</SelectItem>
            <SelectItem value="other">Outros</SelectItem>
          </SelectContent>
        </Select>
        <Select value={requesterFilter} onValueChange={setRequesterFilter}>
          <SelectTrigger className="w-[180px] h-9"><SelectValue placeholder="Solicitante" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="customer">Cliente</SelectItem>
            <SelectItem value="merchant">Comerciante</SelectItem>
            <SelectItem value="system">Sistema/Auto</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-2">
          {selected.length > 0 && (
            <>
              <span className="text-xs text-slate-500">{selected.length} selecionados</span>
              <Button size="sm" onClick={approveBatch} className="bg-[#2bc196] hover:bg-[#25a880] text-white">
                Aprovar lote
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" className="gap-2">
            <FileSpreadsheet className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Lista */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500">
              <tr>
                <th className="text-left p-3 w-10"></th>
                <th className="text-left p-3">ID Reembolso</th>
                <th className="text-left p-3">Cliente</th>
                <th className="text-left p-3">Valor</th>
                <th className="text-left p-3">Tipo</th>
                <th className="text-left p-3">Motivo</th>
                <th className="text-left p-3">Data</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-500">
                    Nenhum reembolso encontrado
                  </td>
                </tr>
              ) : filtered.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(r.id)}
                      onChange={() => toggleSelect(r.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="p-3 font-mono text-xs">{r.transaction_id?.slice(0, 14) || r.id?.slice(0, 14)}...</td>
                  <td className="p-3">
                    <p className="font-medium text-xs">{r.customer?.name || r.customer_name || '—'}</p>
                    <p className="text-[10px] text-slate-500">{r.customer?.email || r.customer_email || '—'}</p>
                  </td>
                  <td className="p-3 font-semibold">{formatCurrency(r.amount)}</td>
                  <td className="p-3">
                    <Badge variant="outline" className="capitalize text-[10px]">
                      {r.type === 'partial_refund' ? 'Parcial' : r.type === 'void' ? 'Cancelamento' : 'Total'}
                    </Badge>
                  </td>
                  <td className="p-3 text-xs text-slate-600">{r.refusal_reason || r.metadata?.refund_reason || 'Não informado'}</td>
                  <td className="p-3 text-xs text-slate-500">
                    {r.created_date ? format(new Date(r.created_date), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : '—'}
                  </td>
                  <td className="p-3"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}