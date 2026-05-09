import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Plus, Users, TrendingUp, Settings2 } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';

const TENANTS = [
  { id: 't_001', name: 'Marketplace ABC', merchants: 248, volume: 4280000, mrr: 84200, plan: 'Enterprise', status: 'active' },
  { id: 't_002', name: 'Marketplace XYZ', merchants: 142, volume: 1840000, mrr: 38400, plan: 'Growth', status: 'active' },
  { id: 't_003', name: 'Marketplace DEF', merchants: 89, volume: 920000, mrr: 18420, plan: 'Pro', status: 'active' },
  { id: 't_004', name: 'White-label Banco Y', merchants: 412, volume: 8420000, mrr: 184200, plan: 'Enterprise', status: 'active' },
  { id: 't_005', name: 'Pilot Marketplace', merchants: 12, volume: 84000, mrr: 1240, plan: 'Starter', status: 'pending' },
];

export default function AdminIntTenantManagement() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tenant Management"
        subtitle="Gestão multi-tenant da plataforma · Marketplaces, white-labels e clientes Enterprise"
        icon={Building2}
        breadcrumbs={[{ label: 'Admin Interno', page: 'AdminIntDashboard' }]}
        actions={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo tenant
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-slate-500 uppercase">Tenants</p><p className="text-3xl font-bold">{TENANTS.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-slate-500 uppercase">Merchants</p><p className="text-3xl font-bold text-blue-600">{TENANTS.reduce((s, t) => s + t.merchants, 0).toLocaleString('pt-BR')}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-slate-500 uppercase">TPV Combinado</p><p className="text-3xl font-bold text-emerald-600">R$ {(TENANTS.reduce((s, t) => s + t.volume, 0)/1000000).toFixed(1)}M</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-slate-500 uppercase">MRR</p><p className="text-3xl font-bold text-violet-600">R$ {(TENANTS.reduce((s, t) => s + t.mrr, 0)/1000).toFixed(0)}k</p></CardContent></Card>
      </div>

      <div className="space-y-3">
        {TENANTS.map((t) => (
          <Card key={t.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md flex-shrink-0">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-base">{t.name}</p>
                    <Badge variant="outline" className="font-mono text-[10px]">{t.id}</Badge>
                    <Badge className={
                      t.plan === 'Enterprise' ? 'bg-violet-100 text-violet-700' :
                      t.plan === 'Growth' ? 'bg-blue-100 text-blue-700' :
                      t.plan === 'Pro' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-slate-100 text-slate-700'
                    }>{t.plan}</Badge>
                    <Badge className={t.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                      {t.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div><span className="text-slate-500">Merchants:</span> <strong>{t.merchants}</strong></div>
                    <div><span className="text-slate-500">TPV:</span> <strong>R$ {(t.volume/1000000).toFixed(1)}M</strong></div>
                    <div><span className="text-slate-500">MRR:</span> <strong>R$ {t.mrr.toLocaleString('pt-BR')}</strong></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Users className="w-3 h-3 mr-1" />
                    Merchants
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings2 className="w-3 h-3 mr-1" />
                    Configurar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}