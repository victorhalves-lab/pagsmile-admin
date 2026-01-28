import React from 'react';
import KPICard from './shared/KPICard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, Landmark, CalendarClock, Scale, Wallet,
  ArrowRight
} from 'lucide-react';

export default function FinancialView() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Saldo em Merchants" value="R$ 12.4M" change={5.2} icon={Wallet} />
        <KPICard title="A Liquidar Hoje" value="R$ 2.1M" change={-10.5} icon={CalendarClock} />
        <KPICard title="Reservas Retidas" value="R$ 4.5M" change={2.1} icon={Landmark} />
        <KPICard title="Conciliação Pendente" value="R$ 15k" change={50} positiveIsBad={true} icon={Scale} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Fluxo de Liquidação (7 Dias)</CardTitle>
            <CardDescription>Previsão de saídas de caixa</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-lg mx-6 mb-6">
            <p className="text-slate-400">Gráfico de barras: Previsão de liquidação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agenda de Hoje</CardTitle>
            <CardDescription>Status das liquidações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Lote 1 (09:00)</span>
                <span className="text-green-600 font-medium">Concluído</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-full"></div>
              </div>
              <p className="text-xs text-slate-500 text-right">R$ 850k / R$ 850k</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Lote 2 (13:00)</span>
                <span className="text-blue-600 font-medium">Em andamento</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full w-[65%]"></div>
              </div>
              <p className="text-xs text-slate-500 text-right">R$ 520k / R$ 800k</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Lote 3 (17:00)</span>
                <span className="text-slate-500 font-medium">Agendado</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-slate-300 h-2 rounded-full w-0"></div>
              </div>
              <p className="text-xs text-slate-500 text-right">R$ 0 / R$ 450k</p>
            </div>

            <Button variant="outline" className="w-full mt-4">
              Ver Agenda Completa <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}