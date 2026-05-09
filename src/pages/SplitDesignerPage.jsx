import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Save, Eye, BookTemplate, FileText } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import SplitDesigner from '@/components/orchestration/SplitDesigner';

const TEMPLATES = [
  { id: 'mp_classic', name: 'Marketplace Clássico', description: '10% master / 90% sub-lojista', usage: 1284 },
  { id: 'affiliate', name: 'Programa de Afiliados', description: '85% lojista / 10% afiliado / 5% master', usage: 412 },
  { id: 'multi_seller', name: 'Multi-vendedor', description: 'Distribuído por SKU', usage: 198 },
  { id: 'subscription_share', name: 'Assinatura compartilhada', description: '70% conteúdo / 20% plataforma / 10% taxa', usage: 87 },
];

export default function SplitDesignerPage() {
  const [savedAt, setSavedAt] = useState(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Split & Marketplace Designer"
        subtitle="Designer granular de regras de split com liability e processing fee allocation"
        icon={Users}
        breadcrumbs={[{ label: 'Financeiro', page: 'FinancialOverview' }, { label: 'Split', page: 'SplitManagement' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <BookTemplate className="w-4 h-4 mr-2" />
              Templates
            </Button>
            <Button onClick={() => setSavedAt(new Date().toLocaleTimeString('pt-BR'))}>
              <Save className="w-4 h-4 mr-2" />
              Salvar regra
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="designer">
        <TabsList>
          <TabsTrigger value="designer">Designer</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="docs">Documentação Tuna</TabsTrigger>
        </TabsList>

        <TabsContent value="designer" className="space-y-4">
          <SplitDesigner totalAmount={1500} />

          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4">
              <p className="font-semibold text-amber-900 text-sm">⚠️ Importante: Liability</p>
              <p className="text-xs text-amber-700 mt-1">
                O recipient marcado como <strong>liable</strong> é o responsável legal por chargebacks. 
                Em marketplaces, geralmente o sub-lojista. Em modelo "platform-as-merchant", você (master).
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-3">
          {TEMPLATES.map((tpl) => (
            <Card key={tpl.id} className="hover:shadow-md cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{tpl.name}</p>
                  <p className="text-xs text-slate-500">{tpl.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{tpl.usage.toLocaleString('pt-BR')} usos</Badge>
                  <Button size="sm" variant="outline">
                    <Eye className="w-3 h-3 mr-1" />
                    Aplicar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="docs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="w-4 h-4" />
                Estrutura Tuna · split_rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg overflow-auto">
{`{
  "split_rules": [
    {
      "recipient_id": "rec_master",
      "amount": null,
      "percentage": 10,
      "liable": true,
      "charge_processing_fee": true
    },
    {
      "recipient_id": "sub_001",
      "amount": null,
      "percentage": 70,
      "liable": false,
      "charge_processing_fee": false
    },
    {
      "recipient_id": "sub_002",
      "amount": null,
      "percentage": 20,
      "liable": false,
      "charge_processing_fee": false
    }
  ]
}`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {savedAt && (
        <div className="text-xs text-emerald-700 text-right">Salvo às {savedAt}</div>
      )}
    </div>
  );
}