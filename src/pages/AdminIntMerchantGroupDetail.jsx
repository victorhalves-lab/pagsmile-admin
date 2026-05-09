import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Building, Users, MapPin, TrendingUp, FileText, Plus, Trash2, AlertTriangle, Calendar, BarChart3, ExternalLink,
} from 'lucide-react';

/**
 * Mentor F0541–F0567 — Ficha do grupo: filiais, métricas agregadas, contrato master, mapa.
 */
const mockGroup = {
  id: 'GRP-001', name: 'Rede Farmácias ABC', radical_doc: '12.345.678',
  holding: 'Holding ABC Saúde S.A.', holding_doc: '12.345.000/0001-00',
  contract_master_id: 'CTR-MASTER-2025-0123', contract_start: '2025-03-01', contract_end: '2028-03-01',
  consolidated_management: true,
  tpv_30d: 23400000, tpv_change_pct: 12.4, ticket_medio: 145, cities_count: 12,
};

const mockFilials = [
  { id: '12345', name: 'Farmácia ABC — Matriz Centro', city: 'São Paulo', uf: 'SP', tpv_30d: 1240000, status: 'active', is_matriz: true },
  { id: '12346', name: 'Farmácia ABC — Vila Mariana', city: 'São Paulo', uf: 'SP', tpv_30d: 890000, status: 'active' },
  { id: '12347', name: 'Farmácia ABC — Pinheiros', city: 'São Paulo', uf: 'SP', tpv_30d: 1050000, status: 'active' },
  { id: '12348', name: 'Farmácia ABC — Moema', city: 'São Paulo', uf: 'SP', tpv_30d: 720000, status: 'active' },
  { id: '12349', name: 'Farmácia ABC — Campinas', city: 'Campinas', uf: 'SP', tpv_30d: 540000, status: 'suspended' },
  { id: '12350', name: 'Farmácia ABC — Rio Centro', city: 'Rio de Janeiro', uf: 'RJ', tpv_30d: 670000, status: 'active' },
];

export default function AdminIntMerchantGroupDetail() {
  const [params] = useSearchParams();
  const groupId = params.get('id') || mockGroup.id;

  // Alerta de churn agregado (queda >20% em 30d)
  const churnAlert = mockGroup.tpv_change_pct < -20;

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title={mockGroup.name}
        subtitle={`Grupo · ${mockFilials.length} filiais em ${mockGroup.cities_count} cidades`}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Grupos', page: 'AdminIntMerchantGroups' },
          { label: mockGroup.name },
        ]}
        icon={Building}
        actions={
          <div className="flex gap-2">
            <Button variant="outline"><Plus className="w-4 h-4 mr-1" /> Vincular filial</Button>
            <Button>Editar grupo</Button>
          </div>
        }
      />

      {/* Alerta de churn de rede */}
      {churnAlert && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-900">Alerta de churn de rede</p>
              <p className="text-xs text-red-800 mt-0.5">
                TPV agregado caiu {Math.abs(mockGroup.tpv_change_pct)}% nos últimos 30 dias. Possível churn em curso.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPIs agregados */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4">
          <p className="text-[10px] font-bold uppercase text-slate-500">Filiais ativas</p>
          <p className="text-3xl font-black mt-1">{mockFilials.filter(f => f.status === 'active').length}/{mockFilials.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-bold uppercase text-slate-500">TPV agregado (30d)</p>
          <p className="text-2xl font-black mt-1">R$ {(mockGroup.tpv_30d / 1000000).toFixed(2)}M</p>
          <p className={`text-xs font-bold mt-0.5 ${mockGroup.tpv_change_pct >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {mockGroup.tpv_change_pct >= 0 ? '+' : ''}{mockGroup.tpv_change_pct}%
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-bold uppercase text-slate-500">Ticket médio</p>
          <p className="text-2xl font-black mt-1">R$ {mockGroup.ticket_medio}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-bold uppercase text-slate-500">Cidades</p>
          <p className="text-3xl font-black mt-1 flex items-center gap-1"><MapPin className="w-5 h-5" />{mockGroup.cities_count}</p>
        </Card>
      </div>

      {/* Contrato master */}
      {mockGroup.contract_master_id && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><FileText className="w-4 h-4" /> Contrato Master</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-[10px] uppercase text-slate-500 font-bold">ID</p>
                <code className="text-sm font-mono">{mockGroup.contract_master_id}</code>
              </div>
              <div>
                <p className="text-[10px] uppercase text-slate-500 font-bold">Holding</p>
                <p className="text-sm font-medium">{mockGroup.holding}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-slate-500 font-bold">Início</p>
                <p className="text-sm font-medium">{mockGroup.contract_start}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-slate-500 font-bold">Fim</p>
                <p className="text-sm font-medium">{mockGroup.contract_end}</p>
              </div>
            </div>
            {mockGroup.consolidated_management && (
              <Badge className="mt-3 bg-emerald-100 text-emerald-700">Gestão consolidada habilitada</Badge>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="filials">
        <TabsList>
          <TabsTrigger value="filials">Filiais ({mockFilials.length})</TabsTrigger>
          <TabsTrigger value="map">Mapa Geográfico</TabsTrigger>
          <TabsTrigger value="metrics">Métricas Agregadas</TabsTrigger>
          <TabsTrigger value="audit">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="filials" className="space-y-2 mt-4">
          {mockFilials.map((f) => (
            <Link key={f.id} to={createPageUrl(`AdminIntMerchantProfile?id=${f.id}`)}>
              <Card className="hover:shadow-sm transition-shadow cursor-pointer">
                <CardContent className="p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${f.is_matriz ? 'bg-purple-100' : 'bg-slate-100'}`}>
                      <Building className={`w-4 h-4 ${f.is_matriz ? 'text-purple-600' : 'text-slate-500'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-sm">{f.name}</p>
                        {f.is_matriz && <Badge className="bg-purple-100 text-purple-700 text-[10px]">Matriz</Badge>}
                      </div>
                      <p className="text-[11px] text-slate-500">{f.city}/{f.uf} · ID {f.id}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="font-bold text-sm">R$ {(f.tpv_30d / 1000).toFixed(0)}k</p>
                      <p className="text-[10px] text-slate-500">TPV 30d</p>
                    </div>
                    <Badge className={f.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                      {f.status === 'active' ? 'Ativa' : 'Suspensa'}
                    </Badge>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </TabsContent>

        <TabsContent value="map" className="mt-4">
          <Card>
            <CardContent className="p-6 text-center text-slate-500">
              <MapPin className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm">Mapa geográfico das {mockFilials.length} filiais nas {mockGroup.cities_count} cidades</p>
              <p className="text-xs mt-1">(integração com biblioteca de mapas — placeholder)</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="mt-4">
          <Card>
            <CardContent className="p-6 text-center text-slate-500">
              <BarChart3 className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm">Comparação de TPV/aprovação/chargeback entre filiais</p>
              <p className="text-xs mt-1">Drill-down por cidade, mix bandeira, evolução 12m</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-4">
          <Card>
            <CardContent className="p-6 text-center text-slate-500">
              <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm">Timeline cronológica de alterações no grupo</p>
              <p className="text-xs mt-1">Vinculações/desvinculações, mudanças de contrato, ações em massa</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}