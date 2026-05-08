import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/common/StatusBadge';
import { cn } from '@/lib/utils';

/**
 * Comparação inline entre transações (link analysis).
 * DIFERENCIAL — detecta mesmo IP, BIN, email, device entre 2-3 transações selecionadas.
 */
export default function CompareTransactionsPanel({ rows = [], open, onClose }) {
  if (!rows.length) return null;

  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

  // Detectar similaridades
  const sameIPs = new Set(rows.map(r => r.customer?.ip).filter(Boolean));
  const sameDevices = new Set(rows.map(r => r.customer?.device_id).filter(Boolean));
  const sameEmails = new Set(rows.map(r => r.customer?.email || r.customer_email).filter(Boolean));
  const sameBINs = new Set(rows.map(r => r.card?.first6).filter(Boolean));

  const links = [];
  if (sameIPs.size === 1 && rows.length > 1) links.push({ type: 'IP', value: [...sameIPs][0], severity: 'high' });
  if (sameDevices.size === 1 && rows.length > 1) links.push({ type: 'Device', value: [...sameDevices][0], severity: 'high' });
  if (sameEmails.size === 1 && rows.length > 1) links.push({ type: 'E-mail', value: [...sameEmails][0], severity: 'medium' });
  if (sameBINs.size === 1 && rows.length > 1) links.push({ type: 'BIN', value: [...sameBINs][0], severity: 'medium' });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#2bc196]" />
            Comparar transações ({rows.length})
          </DialogTitle>
          <DialogDescription>Análise de vínculos (link analysis) entre as transações selecionadas.</DialogDescription>
        </DialogHeader>

        {/* Vínculos detectados */}
        <div className="rounded-lg border border-slate-200 p-3 space-y-2">
          <p className="text-xs font-semibold uppercase text-slate-500">Vínculos detectados</p>
          {links.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              Nenhum vínculo suspeito entre estas transações
            </div>
          ) : (
            <div className="space-y-1">
              {links.map((l, i) => (
                <div key={i} className={cn(
                  "flex items-center gap-2 text-sm rounded-md px-2 py-1.5",
                  l.severity === 'high' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                )}>
                  <AlertTriangle className="w-4 h-4" />
                  <span><strong>{l.type}</strong> idêntico: <code className="text-xs">{l.value}</code></span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tabela comparativa */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="text-left p-2">Atributo</th>
                {rows.map((r, i) => (
                  <th key={i} className="text-left p-2">Tx {i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { label: 'ID', get: r => <code className="text-xs">{(r.transaction_id || r.id)?.slice(0, 12)}...</code> },
                { label: 'Status', get: r => <StatusBadge status={r.status} /> },
                { label: 'Valor', get: r => formatCurrency(r.amount) },
                { label: 'Método', get: r => <Badge variant="outline">{r.method || r.type}</Badge> },
                { label: 'Cliente', get: r => r.customer?.name || r.customer_name || '—' },
                { label: 'E-mail', get: r => <span className="text-xs">{r.customer?.email || r.customer_email || '—'}</span> },
                { label: 'IP', get: r => <code className="text-xs">{r.customer?.ip || '—'}</code> },
                { label: 'Device', get: r => <code className="text-xs">{r.customer?.device_id?.slice(0, 8) || '—'}</code> },
                { label: 'BIN', get: r => <code className="text-xs">{r.card?.first6 || '—'}</code> },
                { label: 'Bandeira', get: r => r.card?.brand || '—' },
              ].map(field => (
                <tr key={field.label}>
                  <td className="p-2 text-xs uppercase font-semibold text-slate-500">{field.label}</td>
                  {rows.map((r, i) => <td key={i} className="p-2">{field.get(r)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}