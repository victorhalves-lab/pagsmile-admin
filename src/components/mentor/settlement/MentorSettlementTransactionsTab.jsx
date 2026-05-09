import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ExternalLink, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

const fmt = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

export default function MentorSettlementTransactionsTab({ transactions = [] }) {
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (brandFilter !== 'all' && t.brand !== brandFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return t.txn_id.toLowerCase().includes(q) || t.nsu.toLowerCase().includes(q) || t.terminal.toLowerCase().includes(q);
      }
      return true;
    });
  }, [transactions, brandFilter, search]);

  const totals = useMemo(() => ({
    count: filtered.length,
    gross: filtered.reduce((s, t) => s + t.amount, 0),
    mdr: filtered.reduce((s, t) => s + t.mdr, 0),
    net: filtered.reduce((s, t) => s + t.net, 0),
  }), [filtered]);

  const brands = [...new Set(transactions.map((t) => t.brand))];

  return (
    <div className="space-y-3">
      <Card>
        <CardContent className="p-3 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-center">
            <div className="bg-slate-50 rounded p-2">
              <p className="text-[10px] uppercase font-bold text-slate-500">Transações</p>
              <p className="text-lg font-black text-slate-800">{totals.count}</p>
            </div>
            <div className="bg-emerald-50 rounded p-2">
              <p className="text-[10px] uppercase font-bold text-slate-500">Bruto</p>
              <p className="text-lg font-black text-emerald-700">{fmt(totals.gross)}</p>
            </div>
            <div className="bg-red-50 rounded p-2">
              <p className="text-[10px] uppercase font-bold text-slate-500">MDR</p>
              <p className="text-lg font-black text-red-700">−{fmt(totals.mdr)}</p>
            </div>
            <div className="bg-violet-50 rounded p-2">
              <p className="text-[10px] uppercase font-bold text-slate-500">Líquido</p>
              <p className="text-lg font-black text-violet-700">{fmt(totals.net)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <Input placeholder="Buscar TXN, NSU, terminal..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-xs" />
            </div>
            <div className="flex gap-1">
              <button onClick={() => setBrandFilter('all')} className={`px-2 py-1 rounded text-[10px] font-semibold border ${brandFilter === 'all' ? 'bg-violet-600 text-white border-violet-700' : 'bg-white text-slate-600 border-slate-200'}`}>Todas</button>
              {brands.map((b) => (
                <button key={b} onClick={() => setBrandFilter(b)} className={`px-2 py-1 rounded text-[10px] font-semibold border uppercase ${brandFilter === b ? 'bg-violet-600 text-white border-violet-700' : 'bg-white text-slate-600 border-slate-200'}`}>{b}</button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Download className="w-3 h-3 mr-1" /> Exportar
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-2 font-bold text-slate-600">TXN</th>
                  <th className="text-left p-2 font-bold text-slate-600">Captura</th>
                  <th className="text-left p-2 font-bold text-slate-600">Terminal</th>
                  <th className="text-left p-2 font-bold text-slate-600">Bandeira</th>
                  <th className="text-left p-2 font-bold text-slate-600">NSU</th>
                  <th className="text-right p-2 font-bold text-slate-600">Bruto</th>
                  <th className="text-right p-2 font-bold text-slate-600">MDR</th>
                  <th className="text-right p-2 font-bold text-slate-600">Líquido</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.txn_id} className="border-b last:border-0 hover:bg-violet-50/40">
                    <td className="p-2"><code className="font-mono text-[10px]">{t.txn_id}</code></td>
                    <td className="p-2 text-slate-600">{new Date(t.captured_at).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="p-2"><Badge variant="outline" className="text-[10px]">{t.terminal}</Badge></td>
                    <td className="p-2"><Badge className="bg-blue-100 text-blue-700 text-[10px] uppercase">{t.brand}</Badge></td>
                    <td className="p-2 font-mono text-[10px]">{t.nsu}</td>
                    <td className="p-2 text-right font-semibold">{fmt(t.amount)}</td>
                    <td className="p-2 text-right text-red-700">−{fmt(t.mdr)}</td>
                    <td className="p-2 text-right font-bold text-emerald-700">{fmt(t.net)}</td>
                    <td className="p-2">
                      <Link to={createPageUrl('TransactionDetail') + `?id=${t.txn_id}`}>
                        <ExternalLink className="w-3 h-3 text-slate-400 hover:text-violet-600" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}