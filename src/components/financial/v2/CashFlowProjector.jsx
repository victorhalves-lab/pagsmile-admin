import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, AlertTriangle, Wallet } from 'lucide-react';
import { fmtBRL, fmtCompact } from './utils';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts';
import { addDays, format } from 'date-fns';

// Cash Flow Projector — saldo futuro com saques+antecipações (Adyen inspired)
export default function CashFlowProjector({ currentBalance = 45680, receivables = [], withdrawals = [] }) {
  const [horizon, setHorizon] = useState(14);

  const data = useMemo(() => {
    const today = new Date();
    let balance = currentBalance;
    const arr = [{ day: 'Hoje', date: today, balance, marker: balance }];
    for (let i = 1; i <= horizon; i++) {
      const d = addDays(today, i);
      const recIn = receivables
        .filter(r => r.settlement_date && new Date(r.settlement_date).toDateString() === d.toDateString())
        .reduce((s, r) => s + (r.net_amount || 0), 0);
      const wOut = withdrawals
        .filter(w => w.scheduled_date && new Date(w.scheduled_date).toDateString() === d.toDateString())
        .reduce((s, w) => s + (w.amount || 0), 0);
      // Mock fallback
      const mockIn = recIn || (i % 3 === 0 ? Math.random() * 5000 + 2000 : 0);
      const mockOut = wOut || (i === 7 ? 8000 : 0);
      balance += mockIn - mockOut;
      arr.push({ day: format(d, 'dd/MM'), date: d, balance: Math.round(balance), marker: balance });
    }
    return arr;
  }, [currentBalance, receivables, withdrawals, horizon]);

  const minBalance = Math.min(...data.map(d => d.balance));
  const willGoNegative = minBalance < 0;
  const lowestDay = data.find(d => d.balance === minBalance);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-blue-600" />
          <CardTitle className="text-base">Projeção de Caixa</CardTitle>
        </div>
        <div className="flex gap-1">
          {[7, 14, 30].map(h => (
            <Button
              key={h}
              size="sm"
              variant={horizon === h ? 'default' : 'outline'}
              className="h-7 px-2 text-xs"
              onClick={() => setHorizon(h)}
            >
              {h}d
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {willGoNegative && (
          <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-800">Atenção ao caixa</p>
              <p className="text-amber-700">Saldo atinge {fmtBRL(minBalance)} em {lowestDay?.day}. Considere antecipar.</p>
            </div>
          </div>
        )}
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="cashFlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={fmtCompact} />
              <Tooltip formatter={(v) => fmtBRL(v)} />
              <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" />
              <Area type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={2} fill="url(#cashFlow)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t">
          <div>
            <p className="text-slate-500">Hoje</p>
            <p className="font-bold">{fmtCompact(currentBalance)}</p>
          </div>
          <div>
            <p className="text-slate-500">Em {horizon}d</p>
            <p className="font-bold text-emerald-600">{fmtCompact(data[data.length - 1].balance)}</p>
          </div>
          <div>
            <p className="text-slate-500">Mínimo</p>
            <p className={`font-bold ${willGoNegative ? 'text-red-600' : 'text-slate-700'}`}>{fmtCompact(minBalance)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}