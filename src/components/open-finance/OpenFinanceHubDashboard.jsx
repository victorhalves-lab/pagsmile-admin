import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Landmark, ShieldCheck, AlertCircle, Search, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { OF_CONSENTS_MOCK, OF_BANK_HEALTH } from '@/components/transactions/pix/pixFlowMockData';

const statusMap = {
  active: { label: 'Ativo', cls: 'bg-emerald-100 text-emerald-700' },
  revoked: { label: 'Revogado', cls: 'bg-gray-100 text-gray-700' },
  expired: { label: 'Expirado', cls: 'bg-amber-100 text-amber-700' },
  pending: { label: 'Pendente', cls: 'bg-blue-100 text-blue-700' },
};

const healthMap = {
  healthy: { label: 'Saudável', cls: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  degraded: { label: 'Degradado', cls: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  incident: { label: 'Incidente', cls: 'bg-rose-100 text-rose-700', dot: 'bg-rose-500' },
};

export default function OpenFinanceHubDashboard() {
  const [tab, setTab] = useState('consents');
  const [search, setSearch] = useState('');

  const filteredConsents = OF_CONSENTS_MOCK.filter(c =>
    !search || c.customer.toLowerCase().includes(search.toLowerCase()) || c.bank.toLowerCase().includes(search.toLowerCase())
  );

  const active = OF_CONSENTS_MOCK.filter(c => c.status === 'active').length;
  const revoked = OF_CONSENTS_MOCK.filter(c => c.status === 'revoked').length;
  const expiring = OF_CONSENTS_MOCK.filter(c => c.status === 'expired').length;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs text-gray-500 uppercase">Consentimentos Ativos</span>
            </div>
            <p className="text-2xl font-bold text-emerald-700">{active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span className="text-xs text-gray-500 uppercase">Expirados</span>
            </div>
            <p className="text-2xl font-bold text-amber-700">{expiring}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500 uppercase">Revogados</span>
            </div>
            <p className="text-2xl font-bold text-gray-700">{revoked}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Landmark className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-gray-500 uppercase">Bancos Conectados</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{OF_BANK_HEALTH.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="consents">Consentimentos</TabsTrigger>
          <TabsTrigger value="banks">Conexões com Bancos</TabsTrigger>
          <TabsTrigger value="config">Configuração</TabsTrigger>
        </TabsList>

        <TabsContent value="consents" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Consentimentos Open Finance</CardTitle>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <Input placeholder="Buscar cliente ou banco..." className="pl-8 w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                    <tr>
                      <th className="p-2 text-left">Cliente</th>
                      <th className="p-2 text-left">Banco</th>
                      <th className="p-2 text-left">Finalidade</th>
                      <th className="p-2 text-center">Status</th>
                      <th className="p-2 text-right">Uso</th>
                      <th className="p-2 text-left">Expira em</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredConsents.map(c => (
                      <tr key={c.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{c.customer}</td>
                        <td className="p-2 text-gray-600">{c.bank}</td>
                        <td className="p-2 text-gray-600">{c.purpose}</td>
                        <td className="p-2 text-center">
                          <Badge className={cn('border-0', statusMap[c.status]?.cls)}>{statusMap[c.status]?.label}</Badge>
                        </td>
                        <td className="p-2 text-right">{c.usage_count}x</td>
                        <td className="p-2 text-gray-600">{c.expires_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banks" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {OF_BANK_HEALTH.map(b => (
              <Card key={b.code}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold">{b.bank}</p>
                      <p className="text-xs text-gray-500">Cód. {b.code}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={cn('w-2 h-2 rounded-full', healthMap[b.status].dot)} />
                      <Badge className={cn('border-0', healthMap[b.status].cls)}>{healthMap[b.status].label}</Badge>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span className="text-gray-500">Uptime</span><span className="font-medium">{b.uptime}%</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Latência média</span><span className="font-medium">{b.avg_latency_ms}ms</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="config" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configurações de Open Finance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900">📘 Sobre Open Finance Payments</p>
                <p className="text-xs text-blue-700 mt-1">
                  Habilita PIX Automático (cobrança recorrente sem cartão) e PIX Biometria (autorização direto no seu checkout via biometria do banco do cliente — sem redirect).
                </p>
              </div>
              <Button variant="outline" className="gap-2">
                <ExternalLink className="w-4 h-4" /> Documentação Open Finance
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}