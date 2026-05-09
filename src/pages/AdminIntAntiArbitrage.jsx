import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldAlert, AlertTriangle, TrendingUp, Filter } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import AntiArbitrageMonitor from '@/components/orchestration/AntiArbitrageMonitor';

export default function AdminIntAntiArbitrage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Anti-Arbitrage Monitor"
        subtitle="Monitor de padrões de arbitragem em tarifas/MDR cross-merchant · Diferencial PagSmile"
        icon={ShieldAlert}
        breadcrumbs={[{ label: 'Admin Interno', page: 'AdminIntDashboard' }, { label: 'Risco' }]}
        actions={
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Configurar regras
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500 uppercase">Alertas Abertos</p>
            <p className="text-3xl font-bold text-red-600">3</p>
            <p className="text-xs text-slate-500">requerem ação</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500 uppercase">Impacto Detectado</p>
            <p className="text-3xl font-bold text-amber-600">R$ 26k</p>
            <p className="text-xs text-slate-500">últimos 30 dias</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500 uppercase">Mitigados</p>
            <p className="text-3xl font-bold text-emerald-600">12</p>
            <p className="text-xs text-slate-500">economia: R$ 84k</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500 uppercase">Padrões Monitorados</p>
            <p className="text-3xl font-bold text-blue-600">14</p>
            <p className="text-xs text-slate-500">regras ativas</p>
          </CardContent>
        </Card>
      </div>

      <AntiArbitrageMonitor />

      <Card>
        <CardContent className="p-5">
          <h4 className="font-bold text-base mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Padrões de Detecção Configurados
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { name: 'Volume migration', threshold: '+200% em 7d', active: true },
              { name: 'Parcelamento estratégico', threshold: '> 50% acima da média', active: true },
              { name: 'MCC switching', threshold: 'Mudança MCC com benchmark anterior', active: true },
              { name: 'Cross-merchant CPF', threshold: 'Mesmo CPF em 3+ merchants', active: false },
              { name: 'Acquirer routing abuse', threshold: 'Mudança forçada para tier inferior', active: true },
              { name: 'Settlement delay gaming', threshold: 'Manipulação de prazo D+', active: false },
            ].map((rule) => (
              <div key={rule.name} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <p className="font-semibold text-sm">{rule.name}</p>
                  <p className="text-xs text-slate-500">{rule.threshold}</p>
                </div>
                <Badge className={rule.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}>
                  {rule.active ? 'Ativa' : 'Inativa'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}