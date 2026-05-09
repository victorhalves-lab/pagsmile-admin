import React from 'react';
import { Calendar, AlertTriangle, FileText, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * Widget simples de próximas obrigações (boletos / agendamentos / NFs vencendo).
 * Surface info que já existiria na agenda — não cria automação.
 */
export default function BillsDueWidget() {
  const bills = [
    { id: 1, name: 'Aluguel - Imobiliária Centro', amount: 3500.00, dueIn: 2, type: 'rent', urgent: true },
    { id: 2, name: 'Energia Elétrica - Enel', amount: 850.00, dueIn: 5, type: 'utility' },
    { id: 3, name: 'NF Fornecedor ABC', amount: 5200.00, dueIn: 7, type: 'invoice' },
    { id: 4, name: 'Internet - Vivo Empresas', amount: 320.00, dueIn: 12, type: 'utility' },
  ];

  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <Card className="border-2 border-amber-200 dark:border-amber-800/40 overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <CardTitle className="text-base">A Pagar — Próximos 15 dias</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Surface de obrigações + agendamentos</p>
            </div>
          </div>
          <Badge className="bg-amber-100 text-amber-700 border-0">
            {bills.length} pendentes
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {bills.map((bill) => (
            <div key={bill.id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bill.urgent ? 'bg-red-100 dark:bg-red-900/40' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  {bill.urgent ? <AlertTriangle className="w-4 h-4 text-red-600" /> : <FileText className="w-4 h-4 text-slate-500" />}
                </div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-white text-sm">{bill.name}</p>
                  <p className={`text-xs ${bill.urgent ? 'text-red-600 font-semibold' : 'text-slate-500'}`}>
                    Vence em {bill.dueIn} {bill.dueIn === 1 ? 'dia' : 'dias'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 dark:text-white">{formatCurrency(bill.amount)}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <Button variant="outline" size="sm" className="w-full">
            Ver todas as obrigações
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}