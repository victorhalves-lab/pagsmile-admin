import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, ArrowDownRight, TrendingDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DeclineAnalysis() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="Análise de Recusas"
        subtitle="Entenda os motivos de recusa e recupere vendas"
        breadcrumbs={[
          { label: 'Transações', page: 'Transactions' },
          { label: 'Análise de Recusas' }
        ]}
        actions={
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtros Avançados
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Recusa Geral</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5%</div>
            <p className="text-xs text-muted-foreground">+2.1% em relação ao mês anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Recusas</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Por Motivo: Fraude</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45%</div>
            <p className="text-xs text-muted-foreground">Principal motivo de recusa</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Perdido</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 145.230,00</div>
            <p className="text-xs text-muted-foreground">Receita potencial não convertida</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Principais Motivos de Recusa</CardTitle>
            <CardDescription>Distribuição das recusas por código de resposta</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-slate-50 rounded-md border border-dashed">
            <p className="text-sm text-muted-foreground">Gráfico de Rosca aqui</p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Evolução Diária</CardTitle>
            <CardDescription>Volume de recusas nos últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-slate-50 rounded-md border border-dashed">
            <p className="text-sm text-muted-foreground">Gráfico de Linha aqui</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}