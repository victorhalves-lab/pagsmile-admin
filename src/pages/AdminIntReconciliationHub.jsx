import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scale, AlertTriangle, CheckCircle2, Download, Upload, Filter } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { mockReconciliation } from '@/components/orchestration/mockData';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

export default function AdminIntReconciliationHub() {
  const data = mockReconciliation;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reconciliation Hub"
        subtitle="Hub unificado de conciliação · Cruza Tuna ledger × extratos de adquirentes/bancos"
        icon={Scale}
        breadcrumbs={[{ label: 'Admin Interno', page: 'AdminIntDashboard' }, { label: 'Financeiro' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Upload className="w-4 h-4 mr-2" />Importar extrato</Button>
            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500 uppercase">Total registros</p>
            <p className="text-3xl font-bold">{data.totalRecords.toLocaleString('pt-BR')}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500 uppercase">Conciliados</p>
            <p className="text-3xl font-bold text-emerald-600">{data.reconciled.toLocaleString('pt-BR')}</p>
            <p className="text-xs text-slate-500">{data.rate}% taxa</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500 uppercase">Divergentes</p>
            <p className="text-3xl font-bold text-amber-600">{data.divergent.toLocaleString('pt-BR')}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-slate-500">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500 uppercase">Pendentes</p>
            <p className="text-3xl font-bold text-slate-600">{data.pending}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="divergences">
        <TabsList>
          <TabsTrigger value="divergences">Divergências por Tipo</TabsTrigger>
          <TabsTrigger value="acquirers">Por Adquirente</TabsTrigger>
        </TabsList>

        <TabsContent value="divergences">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Divergências classificadas</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-left text-xs text-slate-500 uppercase">
                    <th className="py-2 pr-4">Tipo</th>
                    <th className="py-2 pr-4">Quantidade</th>
                    <th className="py-2 pr-4">Valor envolvido</th>
                    <th className="py-2 pr-4">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {data.divergencesByType.map((d) => (
                    <tr key={d.type} className="border-b hover:bg-slate-50">
                      <td className="py-3 pr-4 font-medium">{d.type}</td>
                      <td className="py-3 pr-4 font-mono">{d.count.toLocaleString('pt-BR')}</td>
                      <td className="py-3 pr-4 font-bold">R$ {d.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 pr-4">
                        <Button size="sm" variant="outline">Investigar</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acquirers">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Conciliação por Adquirente</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.byAcquirer}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="acquirer" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="rate" radius={[8, 8, 0, 0]}>
                    {data.byAcquirer.map((entry, idx) => (
                      <Cell key={idx} fill={entry.rate >= 99.9 ? '#10b981' : entry.rate >= 99 ? '#f59e0b' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {data.byAcquirer.map((a) => (
                  <div key={a.acquirer} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <p className="font-semibold">{a.acquirer}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span>Esperado: R$ {a.expected.toLocaleString('pt-BR')}</span>
                      <span>Recebido: R$ {a.received.toLocaleString('pt-BR')}</span>
                      <Badge className={a.rate >= 99.9 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                        {a.rate}%
                      </Badge>
                    </div>
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