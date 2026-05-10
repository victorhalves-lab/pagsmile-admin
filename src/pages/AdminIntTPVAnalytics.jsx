import React, { useState } from 'react';
import { TrendingUp, FileText } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TPVHeroBlock from '@/components/tpv/TPVHeroBlock';
import TPVTimelineChart from '@/components/tpv/TPVTimelineChart';
import TPVDistributionCard from '@/components/tpv/TPVDistributionCard';
import TPVTopMerchantsTable from '@/components/tpv/TPVTopMerchantsTable';
import TPVRegionalHeatmap from '@/components/tpv/TPVRegionalHeatmap';
import TPVMarginalContribution from '@/components/tpv/TPVMarginalContribution';
import TPVFiltersBar from '@/components/tpv/TPVFiltersBar';
import { TPV_KPIS, TPV_BY_BRAND, TPV_BY_ACQUIRER, TPV_BY_PAYMENT, SAVED_VIEWS } from '@/components/tpv/mocks/tpvMock';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminIntTPVAnalytics() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('30d');
  const [granularity, setGranularity] = useState('day');

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <PageHeader
        icon={TrendingUp}
        title="TPV Analytics — Total Payment Volume"
        subtitle="Mentor API · ORIGEM 198-199 · Agregação analítica consolidada"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'Dashboard' },
          { label: 'Analytics' },
          { label: 'TPV' },
        ]}
        actions={
          <div className="flex gap-2">
            <Link to="/AdminIntTPVExportCenter">
              <Button variant="outline" className="gap-1">
                <FileText className="w-4 h-4" /> Centro de Exportação TPV
              </Button>
            </Link>
          </div>
        }
      />

      <TPVFiltersBar
        period={period} onPeriodChange={setPeriod}
        granularity={granularity} onGranularityChange={setGranularity}
        onExport={() => navigate('/AdminIntTPVExportCenter')}
      />

      <TPVHeroBlock kpis={TPV_KPIS} />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="dimensions">Dimensões</TabsTrigger>
          <TabsTrigger value="concentration">Concentração & Pareto</TabsTrigger>
          <TabsTrigger value="geo">Geográfico</TabsTrigger>
          <TabsTrigger value="drivers">Drivers de Crescimento</TabsTrigger>
          <TabsTrigger value="saved">Visões Salvas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <TPVTimelineChart />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <TPVDistributionCard title="Por Bandeira" data={TPV_BY_BRAND} />
            <TPVDistributionCard title="Por Adquirente" data={TPV_BY_ACQUIRER} />
            <TPVDistributionCard title="Por Arranjo" data={TPV_BY_PAYMENT} />
          </div>
        </TabsContent>

        <TabsContent value="dimensions" className="space-y-4 mt-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">📊 Cross-Tabulação · Bandeira × Adquirente</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <th className="p-2 text-left text-xs font-semibold">Bandeira / Adquirente</th>
                    {TPV_BY_ACQUIRER.map(a => <th key={a.name} className="p-2 text-right text-xs font-semibold">{a.name}</th>)}
                    <th className="p-2 text-right text-xs font-semibold bg-blue-50">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {TPV_BY_BRAND.map(b => (
                    <tr key={b.name} className="border-b border-slate-100">
                      <td className="p-2 font-medium">{b.name}</td>
                      {TPV_BY_ACQUIRER.map(a => {
                        const cellValue = (b.value * a.share / 100) / 1_000_000;
                        const intensity = Math.min(cellValue / 200, 1);
                        return (
                          <td key={a.name} className="p-2 text-right text-xs font-mono" style={{ backgroundColor: `rgba(6, 182, 212, ${intensity * 0.3})` }}>
                            R$ {cellValue.toFixed(0)}M
                          </td>
                        );
                      })}
                      <td className="p-2 text-right font-bold bg-blue-50">R$ {(b.value / 1_000_000).toFixed(0)}M</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Performance por Bandeira</h3>
              <table className="w-full text-sm">
                <thead><tr><th className="text-left text-xs">Bandeira</th><th className="text-right text-xs">Ticket Médio</th><th className="text-right text-xs">Aprovação</th></tr></thead>
                <tbody>
                  {TPV_BY_BRAND.map(b => (
                    <tr key={b.name} className="border-t">
                      <td className="py-2">{b.name}</td>
                      <td className="text-right py-2">R$ {b.ticket_avg}</td>
                      <td className="text-right py-2">
                        <Badge variant="outline" className={b.approval > 96 ? 'text-emerald-600' : 'text-amber-600'}>{b.approval}%</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <TPVDistributionCard title="Capture Channel" data={[
              { name: 'POS', value: 720_500_000, share: 39 },
              { name: 'E-commerce', value: 553_900_000, share: 30 },
              { name: 'Paylink', value: 369_500_000, share: 20 },
              { name: 'API Direta', value: 203_623_000, share: 11 },
            ]} />
          </div>
        </TabsContent>

        <TabsContent value="concentration" className="space-y-4 mt-4">
          <Card className="p-4 bg-amber-50 border-amber-200">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="text-xs uppercase font-bold text-amber-800">Concentração Pareto</div>
                <div className="text-3xl font-black mt-1">Top 20% lojistas concentram <span className="text-amber-700">{TPV_KPIS.pareto_top20_concentration}%</span> do TPV</div>
                <div className="text-xs text-amber-700 mt-1">Padrão saudável (Pareto natural ~80%)</div>
              </div>
            </div>
          </Card>
          <TPVTopMerchantsTable />
        </TabsContent>

        <TabsContent value="geo" className="mt-4">
          <TPVRegionalHeatmap />
        </TabsContent>

        <TabsContent value="drivers" className="mt-4">
          <TPVMarginalContribution />
        </TabsContent>

        <TabsContent value="saved" className="mt-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">⭐ Visões Salvas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SAVED_VIEWS.map(v => (
                <Card key={v.id} className="p-3 hover:shadow-md cursor-pointer">
                  <div className="font-medium">{v.name}</div>
                  <div className="text-xs text-slate-500 mt-1">Criada por: {v.creator}</div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}