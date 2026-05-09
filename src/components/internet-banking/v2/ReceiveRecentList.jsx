import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownLeft, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Lista compacta de "PIX recebidos recentemente" no IBPixReceive.
 * Conexão visual com IBExtract, deixa a tela "viva".
 */
export default function ReceiveRecentList() {
  const recent = [
    { id: 1, name: 'Cliente Ana Silva', amount: 250.00, time: 'Hoje, 15:42' },
    { id: 2, name: 'Empresa XYZ Ltda', amount: 5000.00, time: 'Hoje, 14:32' },
    { id: 3, name: 'João Pedro', amount: 80.00, time: 'Hoje, 12:18' },
    { id: 4, name: 'Cliente Maria', amount: 3200.00, time: 'Ontem, 09:45' },
    { id: 5, name: 'Pagamento NF #4523', amount: 8750.00, time: '25/01, 09:23' },
  ];

  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  const total = recent.reduce((s, r) => s + r.amount, 0);

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base flex items-center gap-2">
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
            Últimos PIX recebidos
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Total recebido hoje: <span className="font-bold text-emerald-600">{formatCurrency(total)}</span>
          </p>
        </div>
        <Link to="/IBExtract">
          <Button variant="outline" size="sm" className="gap-2">
            Ver extrato
            <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {recent.map((r) => (
            <div key={r.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                  <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-white">{r.name}</p>
                  <p className="text-[10px] text-slate-500">{r.time}</p>
                </div>
              </div>
              <span className="font-bold text-sm text-emerald-600">+ {formatCurrency(r.amount)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}