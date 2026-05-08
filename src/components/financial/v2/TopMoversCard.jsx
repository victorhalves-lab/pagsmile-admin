import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Trophy } from 'lucide-react';
import { fmtBRL } from './utils';

// Top Movers — top 5 transações que mais impactaram o saldo (Stripe inspired)
export default function TopMoversCard({ entries = [] }) {
  const sorted = [...entries]
    .filter(e => e.amount > 0)
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
    .slice(0, 5);

  // Mock fallback
  const mock = [
    { id: 'm1', description: 'Pedido #45821 — Loja XYZ', amount: 8950, type: 'credit', category: 'sale' },
    { id: 'm2', description: 'Saque programado — Banco Itaú', amount: 5000, type: 'debit', category: 'withdrawal' },
    { id: 'm3', description: 'Pedido #45798 — Cliente Premium', amount: 3200, type: 'credit', category: 'sale' },
    { id: 'm4', description: 'Chargeback #CB-2026-103', amount: 2400, type: 'debit', category: 'chargeback' },
    { id: 'm5', description: 'Antecipação — 12 parcelas', amount: 1850, type: 'credit', category: 'anticipation' },
  ];

  const list = sorted.length > 0 ? sorted : mock;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <CardTitle className="text-base">Top Movimentações Hoje</CardTitle>
          </div>
          <Badge variant="outline" className="text-[10px]">Maior impacto</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {list.map((item, idx) => (
          <div
            key={item.id || idx}
            className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                {idx + 1}
              </div>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                item.type === 'credit' ? 'bg-emerald-100' : 'bg-red-100'
              }`}>
                {item.type === 'credit' ? (
                  <ArrowDownRight className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <ArrowUpRight className="w-3.5 h-3.5 text-red-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{item.description || item.category}</p>
                <p className="text-[10px] text-slate-500 capitalize">{item.category}</p>
              </div>
            </div>
            <span className={`font-bold text-sm ml-2 ${item.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
              {item.type === 'credit' ? '+' : '-'}{fmtBRL(item.amount)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}