import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, Bell, Clock, CheckCircle, XCircle, Eye, 
  AlertCircle, Filter, Plus, Settings
} from 'lucide-react';

// Mock alerts data
const alerts = [
  { id: 1, type: 'critical', title: 'CB Ratio > 0.85%', message: 'Merchant "Loja Suspeita" ultrapassou limite de CB Ratio', time: '5 min', acknowledged: false },
  { id: 2, type: 'critical', title: 'Latência Adquirente > SLA', message: 'Rede com latência de 456ms (SLA: 300ms)', time: '12 min', acknowledged: true },
  { id: 3, type: 'warning', title: 'MED Ratio > 0.15%', message: '3 merchants com MED Ratio acima do limite de atenção', time: '1h', acknowledged: false },
  { id: 4, type: 'warning', title: 'Webhook Delivery < 95%', message: 'Taxa de entrega de webhooks em 93.2%', time: '2h', acknowledged: false },
  { id: 5, type: 'info', title: 'Novo merchant ativado', message: 'Tech Store foi ativado com sucesso', time: '3h', acknowledged: true }
];

const incidents = [
  { id: 'INC-001', severity: 'P1', title: 'Indisponibilidade Rede', status: 'resolved', openedAt: '28/01 10:30', resolvedAt: '28/01 10:45', ttm: '15min', owner: 'João Silva' },
  { id: 'INC-002', severity: 'P2', title: 'Degradação PIX Bradesco', status: 'in_progress', openedAt: '28/01 14:00', resolvedAt: null, ttm: null, owner: 'Maria Santos' },
  { id: 'INC-003', severity: 'P3', title: 'Falha Webhook Merchant X', status: 'open', openedAt: '28/01 13:45', resolvedAt: null, ttm: null, owner: null }
];

const alertRules = [
  { name: 'Latência Adquirente > SLA', threshold: '> 500ms', severity: 'CRITICAL', enabled: true },
  { name: 'Taxa de Erro > 0.5%', threshold: '> 0.5%', severity: 'CRITICAL', enabled: true },
  { name: 'Webhook Delivery < 95%', threshold: '< 95%', severity: 'CRITICAL', enabled: true },
  { name: 'CB Ratio Merchant > 0.85%', threshold: '> 0.85%', severity: 'WARNING', enabled: true },
  { name: 'CB Ratio Global > 0.75%', threshold: '> 0.75%', severity: 'WARNING', enabled: true },
  { name: 'MED Ratio > 0.15%', threshold: '> 0.15%', severity: 'WARNING', enabled: true },
  { name: 'Uptime Provider < 99.9%', threshold: '< 99.9%', severity: 'WARNING', enabled: true }
];

const kpiMetrics = {
  mttr: { p1: '15min', p2: '1h 30min', p3: '4h' },
  mtta: { critical: '3min', warning: '15min' },
  autoResolution: 62
};

const severityConfig = {
  critical: { color: 'bg-red-500', textColor: 'text-red-700', bgLight: 'bg-red-50', icon: AlertCircle },
  warning: { color: 'bg-yellow-500', textColor: 'text-yellow-700', bgLight: 'bg-yellow-50', icon: AlertTriangle },
  info: { color: 'bg-blue-500', textColor: 'text-blue-700', bgLight: 'bg-blue-50', icon: Bell }
};

const incidentSeverityConfig = {
  P1: { color: 'bg-red-500', label: 'Crítico' },
  P2: { color: 'bg-orange-500', label: 'Alto' },
  P3: { color: 'bg-yellow-500', label: 'Médio' },
  P4: { color: 'bg-blue-500', label: 'Baixo' }
};

const incidentStatusConfig = {
  open: { color: 'bg-red-100 text-red-700', label: 'Aberto' },
  in_progress: { color: 'bg-yellow-100 text-yellow-700', label: 'Em Andamento' },
  resolved: { color: 'bg-green-100 text-green-700', label: 'Resolvido' }
};

function AlertItem({ alert, onAcknowledge }) {
  const config = severityConfig[alert.type];
  const Icon = config.icon;

  return (
    <div className={`flex items-start gap-4 p-4 border rounded-lg ${alert.acknowledged ? 'opacity-60' : ''} ${config.bgLight}`}>
      <div className={`p-2 rounded-lg ${config.color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{alert.title}</h4>
          <span className="text-xs text-slate-500">{alert.time} atrás</span>
        </div>
        <p className="text-sm text-slate-600 mt-1">{alert.message}</p>
        {!alert.acknowledged && (
          <Button variant="outline" size="sm" className="mt-2" onClick={() => onAcknowledge(alert.id)}>
            <CheckCircle className="w-4 h-4 mr-1" />
            Reconhecer
          </Button>
        )}
      </div>
    </div>
  );
}

function IncidentRow({ incident }) {
  const severity = incidentSeverityConfig[incident.severity];
  const status = incidentStatusConfig[incident.status];

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
      <div className="flex items-center gap-4">
        <Badge className={`${severity.color} text-white`}>{incident.severity}</Badge>
        <div>
          <p className="font-medium">{incident.title}</p>
          <p className="text-xs text-slate-500">{incident.id} • Aberto em {incident.openedAt}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {incident.owner && (
          <span className="text-sm text-slate-600">👤 {incident.owner}</span>
        )}
        {incident.ttm && (
          <span className="text-sm font-medium text-green-600">TTR: {incident.ttm}</span>
        )}
        <Badge className={status.color}>{status.label}</Badge>
        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default function AlertsView() {
  const [activeAlerts, setActiveAlerts] = useState(alerts);

  const handleAcknowledge = (id) => {
    setActiveAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const criticalCount = activeAlerts.filter(a => a.type === 'critical' && !a.acknowledged).length;
  const warningCount = activeAlerts.filter(a => a.type === 'warning' && !a.acknowledged).length;
  const openIncidents = incidents.filter(i => i.status !== 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className={criticalCount > 0 ? 'border-red-200 bg-red-50' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Alertas Críticos</p>
                <p className="text-3xl font-bold text-red-600">{criticalCount}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className={warningCount > 0 ? 'border-yellow-200 bg-yellow-50' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Alertas Warning</p>
                <p className="text-3xl font-bold text-yellow-600">{warningCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className={openIncidents > 0 ? 'border-orange-200 bg-orange-50' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Incidentes Abertos</p>
                <p className="text-3xl font-bold text-orange-600">{openIncidents}</p>
              </div>
              <Bell className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Auto-Resolução</p>
                <p className="text-3xl font-bold text-green-600">{kpiMetrics.autoResolution}%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts" className="gap-2">
            <Bell className="w-4 h-4" />
            Alertas
            {(criticalCount + warningCount) > 0 && (
              <Badge variant="destructive" className="ml-1">{criticalCount + warningCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="incidents" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            Incidentes
            {openIncidents > 0 && (
              <Badge variant="secondary" className="ml-1">{openIncidents}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rules" className="gap-2">
            <Settings className="w-4 h-4" />
            Regras
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alerts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Alertas Ativos</CardTitle>
                <CardDescription>Notificações automáticas do sistema de monitoramento</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeAlerts.map((alert) => (
                  <AlertItem key={alert.id} alert={alert} onAcknowledge={handleAcknowledge} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Incidentes</CardTitle>
                <CardDescription>Problemas confirmados com impacto em produção</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Novo Incidente
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {incidents.map((incident) => (
                  <IncidentRow key={incident.id} incident={incident} />
                ))}
              </div>
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium mb-3">Métricas de Gestão de Incidentes</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">MTTR (Mean Time To Resolve)</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">P1: {kpiMetrics.mttr.p1}</Badge>
                      <Badge variant="outline">P2: {kpiMetrics.mttr.p2}</Badge>
                      <Badge variant="outline">P3: {kpiMetrics.mttr.p3}</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-500">MTTA (Mean Time To Acknowledge)</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">Critical: {kpiMetrics.mtta.critical}</Badge>
                      <Badge variant="outline">Warning: {kpiMetrics.mtta.warning}</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-500">Taxa Auto-Resolução</p>
                    <p className="text-lg font-bold text-green-600 mt-1">{kpiMetrics.autoResolution}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Regras de Alerta</CardTitle>
                <CardDescription>Configuração de thresholds e notificações automáticas</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nova Regra
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {alertRules.map((rule) => (
                  <div key={rule.name} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={rule.enabled} className="rounded" readOnly />
                      <div>
                        <p className="font-medium">{rule.name}</p>
                        <p className="text-xs text-slate-500">Threshold: {rule.threshold}</p>
                      </div>
                    </div>
                    <Badge variant={rule.severity === 'CRITICAL' ? 'destructive' : 'secondary'}>
                      {rule.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}