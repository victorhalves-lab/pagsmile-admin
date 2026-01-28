import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, ArrowDownRight, TrendingDown, Filter, ShieldAlert, CreditCard, AlertTriangle, Building2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
        <Card className="bg-gradient-to-br from-red-50 to-white border-red-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Taxa de Recusa Geral</CardTitle>
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">12.5%</div>
            <p className="text-xs text-red-600 font-medium mt-1">+2.1% vs mês anterior</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total de Recusas</CardTitle>
            <div className="p-2 bg-slate-100 rounded-lg">
              <AlertCircle className="h-4 w-4 text-slate-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">1,234</div>
            <p className="text-xs text-slate-500 mt-1">Últimos 30 dias</p>
          </CardContent>
        </Card>
         <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Motivo #1: Fraude</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <ShieldAlert className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-700">45%</div>
            <p className="text-xs text-orange-600 font-medium mt-1">Das recusas são por suspeita de fraude</p>
          </CardContent>
        </Card>
         <Card className="bg-white border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Valor Perdido</CardTitle>
            <div className="p-2 bg-slate-100 rounded-lg">
              <ArrowDownRight className="h-4 w-4 text-slate-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">R$ 145.230</div>
            <p className="text-xs text-slate-500 mt-1">Receita potencial não convertida</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Top 5 Motivos de Recusa
            </CardTitle>
            <CardDescription>Principais códigos de resposta retornados pelos emissores</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead className="text-right">Qtd</TableHead>
                  <TableHead className="text-right">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Suspeita de Fraude</TableCell>
                  <TableCell><Badge variant="outline">FRAUD_01</Badge></TableCell>
                  <TableCell className="text-right">555</TableCell>
                  <TableCell className="text-right">45%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Saldo Insuficiente</TableCell>
                  <TableCell><Badge variant="outline">51</Badge></TableCell>
                  <TableCell className="text-right">320</TableCell>
                  <TableCell className="text-right">26%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Cartão Inválido</TableCell>
                  <TableCell><Badge variant="outline">14</Badge></TableCell>
                  <TableCell className="text-right">150</TableCell>
                  <TableCell className="text-right">12%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Não Autorizado</TableCell>
                  <TableCell><Badge variant="outline">05</Badge></TableCell>
                  <TableCell className="text-right">120</TableCell>
                  <TableCell className="text-right">10%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Timeout Emissor</TableCell>
                  <TableCell><Badge variant="outline">91</Badge></TableCell>
                  <TableCell className="text-right">89</TableCell>
                  <TableCell className="text-right">7%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-500" />
              Performance por Banco Emissor
            </CardTitle>
            <CardDescription>Taxas de aprovação e recusa por banco</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Banco</TableHead>
                  <TableHead className="text-right">Transações</TableHead>
                  <TableHead className="text-right">Aprovação</TableHead>
                  <TableHead className="text-right">Recusa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Nubank</TableCell>
                  <TableCell className="text-right">4,500</TableCell>
                  <TableCell className="text-right text-green-600">92%</TableCell>
                  <TableCell className="text-right text-red-600">8%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Itaú</TableCell>
                  <TableCell className="text-right">3,800</TableCell>
                  <TableCell className="text-right text-green-600">89%</TableCell>
                  <TableCell className="text-right text-red-600">11%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Bradesco</TableCell>
                  <TableCell className="text-right">2,100</TableCell>
                  <TableCell className="text-right text-green-600">85%</TableCell>
                  <TableCell className="text-right text-red-600">15%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Banco do Brasil</TableCell>
                  <TableCell className="text-right">1,900</TableCell>
                  <TableCell className="text-right text-green-600">82%</TableCell>
                  <TableCell className="text-right text-red-600">18%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Santander</TableCell>
                  <TableCell className="text-right">1,500</TableCell>
                  <TableCell className="text-right text-green-600">80%</TableCell>
                  <TableCell className="text-right text-red-600">20%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}