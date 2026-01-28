import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Download, Plus } from 'lucide-react';

export default function AdminIntPLD() {
  const alertsData = [
      { type: 'Transação Suspeita', merchant: 'Tech Solutions', date: '2026-01-26', detail: 'Volume 3x acima da média', status: 'pending' },
      { type: 'PEP Detectado', merchant: 'Loja ABC', date: '2026-01-25', detail: 'Sócio assumiu cargo público', status: 'investigating' },
  ];

  const columns = [
      { accessorKey: "type", header: "Tipo de Alerta" },
      { accessorKey: "merchant", header: "Merchant" },
      { accessorKey: "date", header: "Data" },
      { accessorKey: "detail", header: "Detalhe" },
      { 
          accessorKey: "status", 
          header: "Status",
          cell: ({row}) => <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs uppercase font-bold">{row.original.status}</span>
      },
      {
          id: "actions",
          cell: () => <Button size="sm" variant="outline">Analisar</Button>
      }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="PLD/AML & Prevenção" 
        subtitle="Monitoramento de Lavagem de Dinheiro"
      />

      <Tabs defaultValue="alerts">
          <TabsList>
              <TabsTrigger value="alerts">Alertas PLD</TabsTrigger>
              <TabsTrigger value="coaf">Comunicações COAF</TabsTrigger>
              <TabsTrigger value="audit">Auditoria</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts">
              <Card>
                  <CardHeader><CardTitle>Alertas Recentes</CardTitle></CardHeader>
                  <CardContent>
                      <DataTable columns={columns} data={alertsData} />
                  </CardContent>
              </Card>
          </TabsContent>

          <TabsContent value="coaf">
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Comunicações COAF</CardTitle>
                      <Button><Plus className="w-4 h-4 mr-2" /> Nova Comunicação</Button>
                  </CardHeader>
                  <CardContent>
                      <div className="text-center py-10 text-slate-500">
                          Nenhuma comunicação pendente.
                      </div>
                  </CardContent>
              </Card>
          </TabsContent>

          <TabsContent value="audit">
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                       <CardTitle>Trilha de Auditoria</CardTitle>
                       <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Exportar</Button>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-4">
                          {[1,2,3].map(i => (
                              <div key={i} className="flex justify-between items-center border-b pb-2">
                                  <div>
                                      <div className="font-medium">Alteração de Limite - Tech Solutions</div>
                                      <div className="text-xs text-slate-500">Analista João • 26/01/2026 14:30</div>
                                  </div>
                                  <div className="text-sm font-mono text-slate-600">LIMIT_UPDATE</div>
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