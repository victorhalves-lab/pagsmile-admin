import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import MyKpiCard from '@/components/my-compliance/MyKpiCard';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Shield, AlertTriangle, TrendingDown, Sparkles, MapPin, CreditCard, Settings } from 'lucide-react';
import { myFraudKpis, myFraudAlerts, triggerLabels, myFraudRules, formatCurrency } from '@/components/my-ops/mocks/myOpsMock';

const SEVERITY_CFG = {
  high: { label: '🔴 Alta', color: 'bg-red-100 text-red-700', border: 'border-l-red-500' },
  medium: { label: '🟡 Média', color: 'bg-amber-100 text-amber-700', border: 'border-l-amber-500' },
  low: { label: '🟢 Baixa', color: 'bg-emerald-100 text-emerald-700', border: 'border-l-emerald-500' }
};

const ACTION_CFG = {
  blocked: { label: 'Bloqueada', color: 'bg-red-100 text-red-700' },
  review: { label: 'Em revisão', color: 'bg-amber-100 text-amber-700' },
  approved_with_3ds: { label: 'Aprovada c/ 3DS', color: 'bg-blue-100 text-blue-700' },
  approved: { label: 'Aprovada', color: 'bg-emerald-100 text-emerald-700' }
};

export default function MyFraudAlerts() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <PageHeader
        title="Alertas Antifraude — Sua proteção em tempo real"
        subtitle="Detecção · Bloqueios · Regras customizadas · Score de risco"
        icon={Shield}
        breadcrumbs={[{ label: 'Risco', page: '#' }, { label: 'Antifraude' }]}
        actions={<Button variant="outline" className="gap-2"><Settings className="w-4 h-4" /> Configurar regras</Button>}
      />

      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
        <CardContent className="p-5 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-emerald-600 mt-0.5" />
          <div>
            <h3 className="font-bold text-slate-900">
              Seu ratio de fraude está em <span className="text-emerald-700">{myFraudKpis.fraud_ratio}%</span> — bem abaixo da média do setor ({myFraudKpis.industry_benchmark}%)
            </h3>
            <p className="text-sm text-slate-700 mt-1">
              Bloqueamos <strong>{formatCurrency(myFraudKpis.blocked_amount_30d)}</strong> em transações suspeitas nos últimos 30 dias e evitamos uma estimativa de <strong>{myFraudKpis.saved_chargebacks_estimated} chargebacks</strong>.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <MyKpiCard label="ALERTAS 30D" value={myFraudKpis.alerts_30d} sub="detectados" icon={AlertTriangle} accent="amber" />
        <MyKpiCard label="ATIVOS" value={myFraudKpis.active_alerts} sub="aguardando" accent="red" warn={myFraudKpis.active_alerts > 0} />
        <MyKpiCard label="$ BLOQUEADO" value={formatCurrency(myFraudKpis.blocked_amount_30d).slice(0, 12)} sub="30d" accent="emerald" />
        <MyKpiCard label="CB EVITADOS" value={myFraudKpis.saved_chargebacks_estimated} sub="estimativa" icon={TrendingDown} accent="emerald" />
        <MyKpiCard label="RATIO FRAUDE" value={`${myFraudKpis.fraud_ratio}%`} sub={`bench ${myFraudKpis.industry_benchmark}%`} accent="emerald" />
        <MyKpiCard label="SCORE TOPO" value={myFraudKpis.top_score_today} sub="hoje" accent="amber" />
        <MyKpiCard label="REGRAS ATIVAS" value={myFraudKpis.rules_active} sub="customizadas" accent="blue" />
      </div>

      <Tabs defaultValue="alerts">
        <TabsList>
          <TabsTrigger value="alerts">Alertas Ativos ({myFraudAlerts.length})</TabsTrigger>
          <TabsTrigger value="rules">Regras Customizadas ({myFraudRules.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="mt-6 space-y-3">
          {myFraudAlerts.map((alert) => {
            const severityCfg = SEVERITY_CFG[alert.severity];
            const actionCfg = ACTION_CFG[alert.action_taken];
            return (
              <Card key={alert.id} className={`border-l-4 ${severityCfg.border}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="font-mono font-bold text-sm">{alert.transaction_id}</span>
                        <Badge className={severityCfg.color}>{severityCfg.label}</Badge>
                        <Badge className={actionCfg.color}>{actionCfg.label}</Badge>
                        <Badge variant="outline" className="font-mono">Score {alert.score}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <div className="text-[10px] uppercase text-slate-500">Valor</div>
                          <div className="font-bold">{formatCurrency(alert.amount)}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase text-slate-500">Cartão</div>
                          <div className="font-mono flex items-center gap-1 text-xs">
                            <CreditCard className="w-3 h-3" /> {alert.card_brand} ****{alert.card_last4}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase text-slate-500">Cliente</div>
                          <div className="font-mono text-xs truncate">{alert.customer_email}</div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase text-slate-500">Local</div>
                          <div className="text-xs flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {alert.city}, {alert.country}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="text-[10px] uppercase text-slate-500 mb-1">Sinais detectados:</div>
                        <div className="flex flex-wrap gap-1">
                          {alert.triggers.map((t) => (
                            <Badge key={t} variant="outline" className="text-[10px]">{triggerLabels[t] || t}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-2 font-mono">
                        {new Date(alert.detected_at).toLocaleString('pt-BR')} · IP {alert.ip}
                      </div>
                    </div>
                    {alert.status === 'open' && (
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline">Aprovar</Button>
                        <Button size="sm" variant="destructive">Manter bloqueio</Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="rules" className="mt-6 space-y-3">
          {myFraudRules.map((rule) => (
            <Card key={rule.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold">{rule.name}</span>
                      <Badge className={rule.action === 'block' ? 'bg-red-100 text-red-700' : rule.action === 'force_3ds' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}>
                        {rule.action === 'block' ? 'Bloquear' : rule.action === 'force_3ds' ? 'Forçar 3DS' : 'Revisar'}
                      </Badge>
                    </div>
                    <code className="text-xs text-slate-500 mt-1 block font-mono">{rule.condition}</code>
                    <div className="text-xs text-slate-500 mt-1">Disparada {rule.triggers_30d}x nos últimos 30 dias</div>
                  </div>
                  <Switch checked={rule.active} />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}