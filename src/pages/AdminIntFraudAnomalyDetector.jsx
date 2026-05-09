import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Activity, AlertCircle, Eye, Brain } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { mockFraudAnomalies } from '@/components/orchestration/mockData';
import { cn } from '@/lib/utils';

export default function AdminIntFraudAnomalyDetector() {
  const sevConfig = {
    critical: { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-300', icon: 'bg-red-500', label: 'Crítico' },
    high: { color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-300', icon: 'bg-orange-500', label: 'Alto' },
    medium: { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-300', icon: 'bg-amber-500', label: 'Médio' },
    low: { color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-300', icon: 'bg-blue-500', label: 'Baixo' },
  };

  const totalLoss = mockFraudAnomalies.reduce((s, a) => s + a.estimatedLoss, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fraud Anomaly Detector (IA Preditiva)"
        subtitle="Detecção em tempo real de padrões anômalos · Velocity, Geo, Card Testing, Chargeback Cluster"
        icon={Brain}
        breadcrumbs={[{ label: 'Admin Interno', page: 'AdminIntDashboard' }, { label: 'Risco' }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500 uppercase">Anomalias Abertas</p>
            <p className="text-3xl font-bold text-red-600">{mockFraudAnomalies.filter(a => a.status === 'open').length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500 uppercase">Em Investigação</p>
            <p className="text-3xl font-bold text-amber-600">{mockFraudAnomalies.filter(a => a.status === 'investigating').length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500 uppercase">Mitigadas (24h)</p>
            <p className="text-3xl font-bold text-emerald-600">{mockFraudAnomalies.filter(a => a.status === 'mitigated').length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-violet-500">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500 uppercase">Perda Estimada</p>
            <p className="text-3xl font-bold text-violet-600">R$ {(totalLoss/1000).toFixed(0)}k</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {mockFraudAnomalies.map((a) => {
          const cfg = sevConfig[a.severity];
          return (
            <Card key={a.id} className={cn(cfg.border, 'border-2')}>
              <CardContent className={cn('p-5', cfg.bg)}>
                <div className="flex items-start gap-3">
                  <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md', cfg.icon)}>
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge className={cn(cfg.color, 'bg-white border')}>{cfg.label}</Badge>
                      <Badge variant="outline" className="font-mono text-[10px]">Score: {a.score}/100</Badge>
                      <Badge variant="secondary" className="text-[10px]">{a.type}</Badge>
                      <Badge className={
                        a.status === 'open' ? 'bg-red-100 text-red-700' :
                        a.status === 'investigating' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }>{a.status}</Badge>
                    </div>
                    <p className={cn('font-bold text-base mb-1', cfg.color)}>{a.title}</p>
                    <p className="text-xs text-slate-700 mb-2">{a.description}</p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-600 flex-wrap">
                      <span>📊 {a.affectedTransactions} transações afetadas</span>
                      <span className="font-mono">💰 R$ {a.estimatedLoss.toLocaleString('pt-BR')}</span>
                      <span>🕐 {new Date(a.detectedAt).toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-100" variant="outline">
                      <Eye className="w-3 h-3 mr-1" />
                      Investigar
                    </Button>
                    {a.status === 'open' && (
                      <Button size="sm" variant="destructive">
                        Bloquear padrão
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}