import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Shield, Search, Download, Filter, AlertTriangle, CheckCircle2, KeyRound, Settings, Database, Globe, FileDown, Activity, Users, X } from 'lucide-react';
import MyKpiCard from '@/components/my-compliance/MyKpiCard';
import { myAuditKpis, myAuditEvents, auditCategories } from '@/components/my-compliance/mocks/myComplianceMock';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const severityStyles = {
  info: 'bg-blue-100 text-blue-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700'
};

const categoryIcons = {
  auth: KeyRound, financial: Activity, config: Settings, security: Shield, api: Globe, data: Database
};

export default function MyAuditTrail() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [severity, setSeverity] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filtered = useMemo(() => myAuditEvents.filter(e => {
    if (search && !`${e.user} ${e.action} ${e.resource} ${e.ip}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== 'all' && e.category !== category) return false;
    if (severity !== 'all' && e.severity !== severity) return false;
    return true;
  }), [search, category, severity]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Trilha de Auditoria — Minhas Ações"
        subtitle="LGPD Art. 18 · Histórico completo de eventos no meu CNPJ · Conformidade Bacen"
        breadcrumbs={[{ label: 'Configurações', page: 'SettingsPage' }, { label: 'Auditoria' }]}
        icon={Shield}
        actions={
          <>
            <Button variant="outline" size="sm"><FileDown className="w-4 h-4 mr-2" />Exportar Trilha (LGPD)</Button>
            <Button size="sm"><AlertTriangle className="w-4 h-4 mr-2" />Reportar Acesso Suspeito</Button>
          </>
        }
      />

      <Card className="mb-6 bg-blue-50/30 border-blue-200">
        <CardContent className="p-4 flex gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold">Direito de acesso garantido pela LGPD (Art. 18, III)</p>
            <p className="text-blue-700 mt-1">Você tem acesso completo a todas as ações realizadas em sua conta nos últimos 24 meses, incluindo logins, mudanças de configuração, operações financeiras e acessos via API. Eventos críticos são preservados por 5 anos conforme Resolução BCB 4.658.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <MyKpiCard label="Eventos 30d" value={myAuditKpis.total_events_30d.toLocaleString('pt-BR')} icon={Activity} />
        <MyKpiCard label="Críticos" value={myAuditKpis.critical_events} icon={AlertTriangle} accent="red" warn />
        <MyKpiCard label="Usuários únicos" value={myAuditKpis.unique_users} icon={Users} accent="blue" />
        <MyKpiCard label="Logins falhos 24h" value={myAuditKpis.failed_logins_24h} icon={X} accent="amber" warn />
        <MyKpiCard label="Mudanças config" value={myAuditKpis.config_changes_30d} icon={Settings} accent="purple" />
        <MyKpiCard label="Chamadas API 30d" value={(myAuditKpis.api_calls_30d/1000).toFixed(1)+'k'} icon={Globe} accent="emerald" />
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todos os eventos ({filtered.length})</TabsTrigger>
          <TabsTrigger value="critical">Apenas críticos</TabsTrigger>
          <TabsTrigger value="lgpd">Eventos LGPD</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-4 flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[260px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input className="pl-9" placeholder="Buscar usuário, ação, recurso, IP..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>{auditCategories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger className="w-44"><SelectValue placeholder="Severidade" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas severidades</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="critical">Crítica</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" />Filtros avançados</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr className="text-left text-xs font-semibold text-slate-600">
                    <th className="px-4 py-3">Quando</th>
                    <th className="px-4 py-3">Usuário</th>
                    <th className="px-4 py-3">Ação</th>
                    <th className="px-4 py-3">Recurso</th>
                    <th className="px-4 py-3">IP / Local</th>
                    <th className="px-4 py-3">Severidade</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(e => {
                    const Icon = categoryIcons[e.category] || Activity;
                    return (
                      <tr key={e.id} className="border-b hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedEvent(e)}>
                        <td className="px-4 py-3 text-xs text-slate-600">{format(new Date(e.timestamp), 'dd/MM HH:mm:ss', { locale: ptBR })}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800">{e.user}</div>
                          <div className="text-xs text-slate-500">{e.user_role}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-slate-400" />
                            <span className="font-mono text-xs">{e.action}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs font-mono text-slate-600">{e.resource}</td>
                        <td className="px-4 py-3 text-xs">
                          <div className="font-mono">{e.ip}</div>
                          <div className="text-slate-500">{e.location}</div>
                        </td>
                        <td className="px-4 py-3"><Badge className={severityStyles[e.severity]}>{e.severity}</Badge></td>
                        <td className="px-4 py-3 text-right"><Button variant="ghost" size="sm">Ver detalhes</Button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="critical">
          <Card><CardContent className="p-12 text-center text-slate-500">Filtrar pela aba "Todos" com severidade crítica</CardContent></Card>
        </TabsContent>
        <TabsContent value="lgpd">
          <Card><CardHeader><CardTitle>Eventos rastreados para conformidade LGPD</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-slate-700">São automaticamente preservados por 5 anos:</div>
              <div className="grid md:grid-cols-2 gap-3">
                {['Acessos a dados pessoais de clientes','Exportações de dados (Art. 18)','Alterações de consentimento','Deleções por solicitação do titular','Compartilhamentos com terceiros','Logs de breach/incidentes'].map(t => (
                  <div key={t} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-sm"><CheckCircle2 className="w-4 h-4 text-blue-600" />{t}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <CardHeader className="border-b"><CardTitle>Detalhe do evento — {selectedEvent.id}</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><div className="text-xs font-semibold text-slate-500 uppercase">Timestamp</div><div className="font-mono">{selectedEvent.timestamp}</div></div>
                <div><div className="text-xs font-semibold text-slate-500 uppercase">Severidade</div><Badge className={severityStyles[selectedEvent.severity]}>{selectedEvent.severity}</Badge></div>
                <div><div className="text-xs font-semibold text-slate-500 uppercase">Usuário</div><div>{selectedEvent.user} ({selectedEvent.user_role})</div></div>
                <div><div className="text-xs font-semibold text-slate-500 uppercase">Ação</div><div className="font-mono">{selectedEvent.action}</div></div>
                <div><div className="text-xs font-semibold text-slate-500 uppercase">IP / Localização</div><div className="font-mono">{selectedEvent.ip}</div><div className="text-slate-500">{selectedEvent.location}</div></div>
                <div><div className="text-xs font-semibold text-slate-500 uppercase">Dispositivo</div><div>{selectedEvent.device}</div></div>
              </div>
              <div><div className="text-xs font-semibold text-slate-500 uppercase mb-1">Detalhes</div>
                <pre className="bg-slate-50 rounded-lg p-3 text-xs overflow-auto">{JSON.stringify(selectedEvent.details, null, 2)}</pre>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" onClick={() => setSelectedEvent(null)}>Fechar</Button>
                <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Baixar evidência</Button>
                <Button size="sm" variant="destructive"><AlertTriangle className="w-4 h-4 mr-2" />Não fui eu</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}