import React from 'react';
import KPICard from './shared/KPICard';
import { RiskGaugeChart } from './shared/Charts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ShieldAlert, UserX, AlertTriangle, FileWarning, Search, Eye
} from 'lucide-react';

export default function RiskView() {
  const highRiskMerchants = [
    { name: "Eletrônicos Express", ratio: 0.95, program: "VDMP", status: "Alerta Crítico" },
    { name: "Digital Services", ratio: 0.82, program: "-", status: "Atenção" },
    { name: "Drop Store BR", ratio: 0.78, program: "-", status: "Atenção" },
    { name: "Gaming World", ratio: 0.65, program: "-", status: "Monitorar" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Pré-CBs Pendentes" value="R$ 125k" change={12} positiveIsBad={true} icon={AlertTriangle} />
        <KPICard title="CBs Abertos" value="42" change={-5} positiveIsBad={true} icon={FileWarning} />
        <KPICard title="Fraude Confirmada" value="R$ 15k" change={-10} positiveIsBad={true} icon={ShieldAlert} />
        <KPICard title="Merchants Suspensos" value="3" change={0} positiveIsBad={true} icon={UserX} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visa Gauge */}
        <Card>
          <CardHeader>
            <CardTitle>Visa VDMP</CardTitle>
            <CardDescription>Monitoramento de Programa</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskGaugeChart value={0.65} label="Global Ratio" threshold={0.9} />
            <div className="mt-4 text-center text-sm text-slate-500">
              Projeção fim do mês: <span className="font-bold text-slate-700">0.72%</span>
            </div>
          </CardContent>
        </Card>

        {/* Mastercard Gauge */}
        <Card>
          <CardHeader>
            <CardTitle>Mastercard ECM</CardTitle>
            <CardDescription>Monitoramento de Programa</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskGaugeChart value={0.45} label="Global Ratio" threshold={1.0} />
            <div className="mt-4 text-center text-sm text-slate-500">
              Projeção fim do mês: <span className="font-bold text-slate-700">0.48%</span>
            </div>
          </CardContent>
        </Card>

        {/* High Risk Merchants */}
        <Card>
          <CardHeader>
            <CardTitle>Top Risco</CardTitle>
            <CardDescription>Merchants com maior ratio</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0 divide-y">
              {highRiskMerchants.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{m.name}</p>
                    <div className="flex gap-2 mt-1">
                      {m.program !== "-" && <Badge variant="destructive" className="text-[10px] h-4">{m.program}</Badge>}
                      <span className="text-xs text-slate-500">{m.status}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${m.ratio > 0.9 ? 'text-red-600' : m.ratio > 0.65 ? 'text-orange-600' : 'text-slate-600'}`}>
                      {m.ratio.toFixed(2)}%
                    </p>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Eye className="w-3 h-3 text-slate-400" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <Button variant="outline" className="w-full">
                Ver Monitoramento Completo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}