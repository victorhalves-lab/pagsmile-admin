import React, { useMemo } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, TrendingUp, Sparkles, Briefcase, Users, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import TabRealized from '@/components/admin-interno/profitability/TabRealized';
import TabProjection from '@/components/admin-interno/profitability/TabProjection';
import TabSensitivity from '@/components/admin-interno/profitability/TabSensitivity';
import TabClientMargin from '@/components/admin-interno/profitability/TabClientMargin';
import { getProfitabilityData } from '@/components/admin-interno/profitability/profitabilityMockData';

export default function AdminIntProfitabilityView() {
  const data = useMemo(() => getProfitabilityData(), []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Visão de Rentabilidade"
        subtitle="Margem líquida unificada — receita vs custo variável vs custo fixo"
        breadcrumbs={[
          { label: 'Administração' },
          { label: 'Custos Globais', page: 'AdminIntGlobalCosts' },
          { label: 'Visão de Rentabilidade' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to={createPageUrl('AdminIntGlobalCosts')}>
                <Calculator className="w-4 h-4 mr-2" /> Custos Globais
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to={createPageUrl('AdminIntPartners')}>
                <Briefcase className="w-4 h-4 mr-2" /> Parceiros
              </Link>
            </Button>
          </div>
        }
      />

      <Alert className="bg-blue-50 border-blue-200">
        <Info className="w-4 h-4 text-blue-600" />
        <AlertDescription className="text-blue-900 text-sm">
          <strong>Equação fundamental:</strong> Margem/Tx = Receita/Tx − Custo Variável/Tx (parceiros) − Custo Fixo Rateado/Tx (calculadora pessoas + overhead).
          Os dados desta página integram <strong>FeePlans</strong>, <strong>Partners</strong>, <strong>Calculadora de Custo Fixo</strong> e <strong>Transactions</strong>.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="realized">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="realized" className="gap-2 py-2.5">
            <TrendingUp className="w-4 h-4" /> 📈 Visão Atual
          </TabsTrigger>
          <TabsTrigger value="projection" className="gap-2 py-2.5">
            <Briefcase className="w-4 h-4" /> 🎯 Projeção
          </TabsTrigger>
          <TabsTrigger value="sensitivity" className="gap-2 py-2.5">
            <Sparkles className="w-4 h-4" /> 🔬 Sensibilidade
          </TabsTrigger>
          <TabsTrigger value="clients" className="gap-2 py-2.5">
            <Users className="w-4 h-4" /> 💼 Por Cliente
          </TabsTrigger>
        </TabsList>

        <TabsContent value="realized" className="mt-6">
          <TabRealized data={data.realized} />
        </TabsContent>

        <TabsContent value="projection" className="mt-6">
          <TabProjection data={data.projection} />
        </TabsContent>

        <TabsContent value="sensitivity" className="mt-6">
          <TabSensitivity baseline={data.sensitivityBaseline} />
        </TabsContent>

        <TabsContent value="clients" className="mt-6">
          <TabClientMargin clients={data.clients} fixCostPerTx={data.realized.fixCostPerTx} />
        </TabsContent>
      </Tabs>
    </div>
  );
}