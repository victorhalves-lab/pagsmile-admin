import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function AnalyticsNarrative() {
  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50/40">
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 text-xs">
            <p className="font-bold text-purple-900 mb-1">Resumo executivo (gerado por IA)</p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Seu MRR cresceu <span className="font-bold text-emerald-700">+12.5%</span> no último mês, impulsionado por <span className="font-bold">expansion revenue</span> (+R$ 1.8k) e novos clientes Pro. <span className="font-bold text-red-700">Atenção:</span> involuntary churn aumentou 18% — recomendamos revisar a política de retentativas e ativar Account Updater. Sua <span className="font-bold">NRR de 108%</span> está acima da média de mercado (102%), indicando ótima retenção e expansão.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}