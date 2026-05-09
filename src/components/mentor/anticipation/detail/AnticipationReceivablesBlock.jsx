import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Receipt, Search, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const liqStatusCfg = {
  pending: { label: 'Pendente', color: 'bg-blue-100 text-blue-700' },
  liquidated: { label: 'Liquidou', color: 'bg-green-100 text-green-700' },
  in_chargeback: { label: 'Chargeback', color: 'bg-red-100 text-red-700' },
};

export default function AnticipationReceivablesBlock({ receivables }) {
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [search, setSearch] = useState('');

  const filtered = receivables.filter(r => !search || r.id.includes(search) || r.nsu.includes(search));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  // Distribuição temporal
  const distribution = [
    { range: '1-7 dias', count: receivables.filter(r => r.days_anticipated <= 7).length },
    { range: '8-15 dias', count: receivables.filter(r => r.days_anticipated >= 8 && r.days_anticipated <= 15).length },
    { range: '16-23 dias', count: receivables.filter(r => r.days_anticipated >= 16 && r.days_anticipated <= 23).length },
    { range: '24+ dias', count: receivables.filter(r => r.days_anticipated >= 24).length },
  ];

  const totalGross = receivables.reduce((s, r) => s + r.gross_value, 0);
  const totalNet = receivables.reduce((s, r) => s + r.net_value, 0);
  const inChargeback = receivables.filter(r => r.liquidation_status === 'in_chargeback').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Receipt className="w-5 h-5 text-violet-600" />
            Recebíveis Antecipados ({receivables.length})
            {inChargeback > 0 && <Badge className="bg-red-100 text-red-700">{inChargeback} em chargeback</Badge>}
          </CardTitle>
          <Link to={createPageUrl('AdminIntTransactionsList')}>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-3.5 h-3.5 mr-1" /> Ver na lista de transações
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Totalizadores */}
        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">Soma Bruto</p>
            <p className="font-bold">{formatCurrency(totalGross)}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">Soma Líquido</p>
            <p className="font-bold">{formatCurrency(totalNet)}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">Bandeira maioritária</p>
            <p className="font-bold">Visa</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">Terminal mais usado</p>
            <p className="font-bold">T1</p>
          </div>
        </div>

        {/* Gráfico distribuição temporal */}
        <div className="border rounded-lg p-4">
          <p className="text-sm font-medium mb-2">Distribuição temporal (dias até vencimento natural)</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={distribution}>
              <XAxis dataKey="range" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Filtros internos */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Filtrar por ID ou NSU..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr className="border-b">
                <th className="text-left py-2 px-3">ID Transação</th>
                <th className="text-left py-2 px-3">NSU</th>
                <th className="text-left py-2 px-3">Captura</th>
                <th className="text-right py-2 px-3">Bruto</th>
                <th className="text-right py-2 px-3">Líquido</th>
                <th className="text-center py-2 px-3">Liq. natural</th>
                <th className="text-center py-2 px-3">Dias antec.</th>
                <th className="text-center py-2 px-3">Bandeira</th>
                <th className="text-center py-2 px-3">Terminal</th>
                <th className="text-center py-2 px-3">Status liq.</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(r => {
                const cfg = liqStatusCfg[r.liquidation_status];
                return (
                  <tr key={r.id} className="border-b hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono">
                      <Link to={createPageUrl('TransactionDetail') + '?id=' + r.id} className="text-blue-600 hover:underline">{r.id}</Link>
                    </td>
                    <td className="py-2 px-3 font-mono">{r.nsu}</td>
                    <td className="py-2 px-3">{new Date(r.capture_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</td>
                    <td className="py-2 px-3 text-right">{formatCurrency(r.gross_value)}</td>
                    <td className="py-2 px-3 text-right">{formatCurrency(r.net_value)}</td>
                    <td className="py-2 px-3 text-center">{new Date(r.natural_settlement_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</td>
                    <td className="py-2 px-3 text-center font-semibold">{r.days_anticipated}d</td>
                    <td className="py-2 px-3 text-center capitalize">{r.brand}</td>
                    <td className="py-2 px-3 text-center">{r.terminal}</td>
                    <td className="py-2 px-3 text-center"><Badge className={`${cfg.color} text-[10px]`}>{cfg.label}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between text-xs">
            <span>Mostrando {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} de {filtered.length}</span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Anterior</Button>
              <span className="px-3 py-1">{page}/{totalPages}</span>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Próxima</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}