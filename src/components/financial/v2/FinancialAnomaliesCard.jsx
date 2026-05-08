import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, TrendingDown, Activity } from 'lucide-react';

// Anomaly detection — Brex/Ramp inspired
export default function FinancialAnomaliesCard() {
  const anomalies = [
    {
      severity: 'high',
      icon: TrendingUp,
      title: 'Volume de saques 3.2× acima do normal',
      desc: 'R$ 28.5k saídos hoje vs média de R$ 8.9k. Verifique se foi intencional.',
      time: 'Há 2h',
    },
    {
      severity: 'medium',
      icon: TrendingDown,
      title: 'Taxa média MDR subiu 12% na semana',
      desc: 'Ticket menor + mais débito vs crédito. Receita de taxa caiu R$ 1.2k.',
      time: 'Hoje',
    },
    {
      severity: 'low',
      icon: Activity,
      title: 'Bloqueio incomum: R$ 5k em reserva CB',
      desc: '+R$ 1.5k em reserva nos últimos 7d. Acompanhar evolução de chargebacks.',
      time: 'Ontem',
    },
  ];

  const sevColor = {
    high: 'bg-red-50 border-red-200 text-red-700',
    medium: 'bg-amber-50 border-amber-200 text-amber-700',
    low: 'bg-blue-50 border-blue-200 text-blue-700',
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <CardTitle className="text-base">Anomalias Detectadas</CardTitle>
          </div>
          <Badge variant="outline" className="text-[10px]">{anomalies.length} alertas</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {anomalies.map((a, i) => (
          <div key={i} className={`p-3 rounded-lg border ${sevColor[a.severity]}`}>
            <div className="flex items-start gap-2">
              <a.icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className="text-xs font-bold">{a.title}</p>
                  <span className="text-[10px] opacity-70 whitespace-nowrap">{a.time}</span>
                </div>
                <p className="text-[11px] opacity-90">{a.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}