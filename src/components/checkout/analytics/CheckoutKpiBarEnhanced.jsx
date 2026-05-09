import React, { useState } from 'react';
import EnhancedKPICard from '@/components/analytics/shared/EnhancedKPICard';
import DrillDownDrawer from '@/components/analytics/shared/DrillDownDrawer';
import { TrendingUp, ShoppingCart, CreditCard, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function CheckoutKpiBarEnhanced({ formatCurrency }) {
  const [drillDown, setDrillDown] = useState(null);

  const kpis = [
    {
      key: 'conversion',
      title: 'Taxa de Conversão',
      value: '12.4%',
      delta: '+2.1pp',
      trend: 'up',
      icon: TrendingUp,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
      sparklineData: [9.2, 9.8, 10.1, 10.5, 10.3, 11.2, 11.8, 12.0, 11.9, 12.4],
      benchmark: '9.8% (e-commerce)',
      drillTitle: 'Sessões convertidas',
    },
    {
      key: 'abandonment',
      title: 'Abandono de Carrinho',
      value: '68.2%',
      delta: '-3.5pp',
      trend: 'down',
      icon: ShoppingCart,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100',
      sparklineData: [72.0, 71.5, 71.8, 70.4, 70.1, 69.8, 69.5, 69.2, 68.7, 68.2],
      benchmark: '70% (média setor)',
      drillTitle: 'Carrinhos abandonados',
    },
    {
      key: 'ticket',
      title: 'Ticket Médio',
      value: formatCurrency(247.50),
      delta: '+8.3%',
      trend: 'up',
      icon: CreditCard,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      sparklineData: [228, 232, 235, 238, 240, 244, 246, 247, 246, 247.5],
      benchmark: 'R$ 192 (e-commerce)',
      drillTitle: 'Distribuição de ticket',
    },
    {
      key: 'visitors',
      title: 'Visitantes Únicos',
      value: '8.4K',
      delta: '+15.2%',
      trend: 'up',
      icon: Users,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      sparklineData: [6800, 7000, 7200, 7400, 7500, 7800, 8000, 8200, 8300, 8400],
      benchmark: '+8% (média)',
      drillTitle: 'Origem dos visitantes',
    },
  ];

  const whyChanged = (kpi) => {
    toast.info(`💡 ${kpi.title}: análise em geração pela Helena IA...`);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(kpi => (
          <EnhancedKPICard
            key={kpi.key}
            title={kpi.title}
            value={kpi.value}
            delta={kpi.delta}
            deltaLabel="vs mês passado"
            trend={kpi.trend}
            icon={kpi.icon}
            iconColor={kpi.iconColor}
            iconBg={kpi.iconBg}
            sparklineData={kpi.sparklineData}
            benchmark={kpi.benchmark}
            benchmarkLabel="setor"
            onDrillDown={() => setDrillDown(kpi)}
            whyChanged={() => whyChanged(kpi)}
          />
        ))}
      </div>

      <DrillDownDrawer
        open={!!drillDown}
        onOpenChange={(o) => !o && setDrillDown(null)}
        title={drillDown?.drillTitle || ''}
        subtitle={`Detalhamento de ${drillDown?.title}`}
        badge={drillDown?.value}
        onExport={() => toast.success('Exportando CSV...')}
      >
        <div className="space-y-3">
          <div className="text-xs text-slate-600">
            Drill-down detalhado por hora, device, origem e país. (Clique nas barras para filtrar)
          </div>
          <div className="space-y-2">
            {[
              { label: 'Mobile iOS', value: '34%', count: '2.8K' },
              { label: 'Desktop Chrome', value: '28%', count: '2.3K' },
              { label: 'Mobile Android', value: '24%', count: '2.0K' },
              { label: 'Desktop Safari', value: '9%', count: '760' },
              { label: 'Outros', value: '5%', count: '420' },
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                <div className="flex-1">
                  <p className="text-sm font-semibold">{row.label}</p>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-[#2bc196]" style={{ width: row.value }} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{row.value}</p>
                  <p className="text-[10px] text-slate-500">{row.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DrillDownDrawer>
    </>
  );
}