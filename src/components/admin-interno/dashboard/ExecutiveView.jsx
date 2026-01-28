import React from 'react';
import KPICard from './shared/KPICard';
import { TPVEvolutionChart, MixChart, FinancialChart, FunnelOnboardingChart } from './shared/Charts';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, CreditCard, Activity, TrendingUp, Users, 
  ArrowUpRight, ShoppingBag, Percent
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ExecutiveView() {
  // Mock Data
  const tpvData = [
    { name: 'Jan', tpv: 35000000, meta: 32000000 },
    { name: 'Fev', tpv: 38000000, meta: 34000000 },
    { name: 'Mar', tpv: 36000000, meta: 36000000 },
    { name: 'Abr', tpv: 41000000, meta: 38000000 },
    { name: 'Mai', tpv: 45000000, meta: 40000000 },
    { name: 'Jun', tpv: 45200000, meta: 42000000 },
  ];

  const mixData = [
    { name: 'Jan', pix: 0.35, card: 0.65 },
    { name: 'Fev', pix: 0.38, card: 0.62 },
    { name: 'Mar', pix: 0.40, card: 0.60 },
    { name: 'Abr', pix: 0.42, card: 0.58 },
    { name: 'Mai', pix: 0.45, card: 0.55 },
    { name: 'Jun', pix: 0.48, card: 0.52 },
  ];

  const financialData = [
    { name: 'Jan', receita: 1200000, custo: 800000, margem: 400000 },
    { name: 'Fev', receita: 1350000, custo: 900000, margem: 450000 },
    { name: 'Mar', receita: 1300000, custo: 850000, margem: 450000 },
    { name: 'Abr', receita: 1500000, custo: 1000000, margem: 500000 },
    { name: 'Mai', receita: 1650000, custo: 1100000, margem: 550000 },
    { name: 'Jun', receita: 1700000, custo: 1150000, margem: 550000 },
  ];
  
  const funnelData = [
    { "value": 100, "name": "Leads", fill: "#8884d8" },
    { "value": 80, "name": "Propostas", fill: "#83a6ed" },
    { "value": 50, "name": "KYC", fill: "#8dd1e1" },
    { "value": 40, "name": "Aprovados", fill: "#82ca9d" },
    { "value": 26, "name": "Ativos", fill: "#a4de6c" }
  ];

  const topMerchants = [
    { name: "Mega Loja Online", tpv: 5200000, share: 11.5 },
    { name: "E-commerce Express", tpv: 4100000, share: 9.0 },
    { name: "Serviços Digitais Ltda", tpv: 3800000, share: 8.4 },
    { name: "Marketplace Brasil", tpv: 2500000, share: 5.5 },
    { name: "Tech Solutions", tpv: 2100000, share: 4.6 },
  ];

  const trendMock = [
    { value: 400 }, { value: 300 }, { value: 300 }, { value: 200 }, { value: 278 }, { value: 189 }, { value: 239 }, { value: 349 }, { value: 430 },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs de Volume */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="TPV Total (Mês)" 
          value="R$ 45.2M" 
          change={12.5} 
          icon={DollarSign}
          trendData={trendMock}
          className="border-l-4 border-l-[#00D26A]"
        />
        <KPICard 
          title="Transações" 
          value="125.4k" 
          change={8.2} 
          icon={Activity}
          trendData={trendMock}
        />
        <KPICard 
          title="Ticket Médio" 
          value="R$ 360,50" 
          change={-2.1} 
          icon={CreditCard}
        />
        <KPICard 
          title="Novos Merchants" 
          value="42" 
          change={15.0} 
          icon={Users}
        />
      </div>

      {/* KPIs Financeiros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Receita Bruta" 
          value="R$ 1.35M" 
          change={15.2} 
          icon={TrendingUp}
          valueClassName="text-emerald-600"
        />
        <KPICard 
          title="Margem Bruta" 
          value="R$ 420k" 
          change={18.5} 
          icon={ShoppingBag}
        />
        <KPICard 
          title="Take Rate Médio" 
          value="2.98%" 
          change={0.5} 
          icon={Percent}
        />
        <KPICard 
          title="Custo Total" 
          value="R$ 930k" 
          change={13.2} 
          positiveIsBad={true}
          icon={ArrowUpRight}
        />
      </div>

      {/* Gráficos Linha 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TPVEvolutionChart data={tpvData} />
        <MixChart data={mixData} />
      </div>

      {/* Gráficos Linha 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FinancialChart data={financialData} />
        
        {/* Top Merchants List */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Merchants</CardTitle>
            <CardDescription>Por volume TPV</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topMerchants.map((m, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-xs text-slate-500">{(m.tpv / 1000000).toFixed(1)}M</p>
                    </div>
                  </div>
                  <Badge variant="outline">{m.share}%</Badge>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t text-center">
              <span className="text-xs text-slate-500">Concentração Top 10: </span>
              <span className="text-xs font-bold text-amber-500">48% (Alerta)</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}