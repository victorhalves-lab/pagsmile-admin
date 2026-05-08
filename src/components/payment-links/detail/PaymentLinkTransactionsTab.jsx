import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Filter } from 'lucide-react';

const formatBRL = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const mockTxs = [
  { id: 'TX001', customer: 'João Silva', email: 'joao@email.com', amount: 297, status: 'approved', method: 'PIX', date: '08/05 14:32' },
  { id: 'TX002', customer: 'Maria Santos', email: 'maria@email.com', amount: 297, status: 'approved', method: 'Cartão 6x', date: '08/05 13:15' },
  { id: 'TX003', customer: 'Pedro Costa', email: 'pedro@email.com', amount: 297, status: 'approved', method: 'PIX', date: '08/05 11:42' },
  { id: 'TX004', customer: 'Ana Lima', email: 'ana@email.com', amount: 297, status: 'pending', method: 'PIX', date: '08/05 09:33' },
  { id: 'TX005', customer: 'Carlos Souza', email: 'carlos@email.com', amount: 297, status: 'approved', method: 'Cartão 12x', date: '07/05 22:18' },
  { id: 'TX006', customer: 'Fernanda Rocha', email: 'fer@email.com', amount: 297, status: 'refused', method: 'Cartão 3x', date: '07/05 20:04' },
  { id: 'TX007', customer: 'Lucas Almeida', email: 'lucas@email.com', amount: 297, status: 'approved', method: 'PIX', date: '07/05 18:55' },
];

const statusBadge = (s) => {
  const map = {
    approved: { label: 'Aprovada', cls: 'bg-emerald-100 text-emerald-700' },
    pending: { label: 'Pendente', cls: 'bg-amber-100 text-amber-700' },
    refused: { label: 'Recusada', cls: 'bg-red-100 text-red-700' },
  };
  const c = map[s] || { label: s, cls: 'bg-slate-100 text-slate-700' };
  return <Badge className={`${c.cls} text-[10px]`}>{c.label}</Badge>;
};

export default function PaymentLinkTransactionsTab({ link }) {
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm">Transações deste link</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-3.5 h-3.5 mr-1" /> Filtros
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-3.5 h-3.5 mr-1" /> Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 text-xs">
              <tr>
                <th className="text-left p-2.5 font-semibold">ID</th>
                <th className="text-left p-2.5 font-semibold">Cliente</th>
                <th className="text-left p-2.5 font-semibold">Status</th>
                <th className="text-left p-2.5 font-semibold">Método</th>
                <th className="text-right p-2.5 font-semibold">Valor</th>
                <th className="text-left p-2.5 font-semibold">Data</th>
              </tr>
            </thead>
            <tbody>
              {mockTxs.map((tx) => (
                <tr key={tx.id} className="border-t hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <td className="p-2.5 font-mono text-xs">{tx.id}</td>
                  <td className="p-2.5">
                    <div>
                      <p className="font-medium text-xs">{tx.customer}</p>
                      <p className="text-[11px] text-slate-500">{tx.email}</p>
                    </div>
                  </td>
                  <td className="p-2.5">{statusBadge(tx.status)}</td>
                  <td className="p-2.5 text-xs">{tx.method}</td>
                  <td className="p-2.5 text-right font-semibold">{formatBRL(tx.amount)}</td>
                  <td className="p-2.5 text-xs text-slate-500">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-3">Mostrando {mockTxs.length} transações deste link.</p>
      </CardContent>
    </Card>
  );
}