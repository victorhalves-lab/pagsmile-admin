import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Banknote, CreditCard, ShieldAlert, Lock, AlertTriangle, QrCode,
  TrendingUp, Calculator, Info, Receipt, Users
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import CostPerTransactionCalculator from '@/components/admin-interno/costs/CostPerTransactionCalculator';

const brands = ['Visa', 'Mastercard', 'Elo', 'Amex', 'Hipercard'];

export default function AdminIntGlobalCosts() {
  const [editing, setEditing] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Custos Globais PagSmile"
        subtitle="Custo consolidado da operação — base para cálculo de rentabilidade"
        breadcrumbs={[
          { label: 'Administração', page: '#' },
          { label: 'Parceiros', page: 'AdminIntPartners' },
          { label: 'Custos Globais', page: 'AdminIntGlobalCosts' },
        ]}
        actions={
          editing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditing(false)}>Cancelar</Button>
              <Button onClick={() => { toast.success('Custos globais salvos!'); setEditing(false); }}>Salvar</Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link to={createPageUrl('AdminIntProfitabilityView')}>
                  <TrendingUp className="w-4 h-4 mr-2" /> Visão de Rentabilidade
                </Link>
              </Button>
              <Button onClick={() => setEditing(true)}>Editar Custos Globais</Button>
            </div>
          )
        }
      />

      {/* Aviso */}
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-900">Como funcionam os custos globais?</AlertTitle>
        <AlertDescription className="text-blue-800">
          Os custos globais são a média ponderada dos custos contratados com cada parceiro (Adyen, Stone, Cielo, Visa, Mastercard, etc.) somados aos custos diretos da PagSmile. Eles servem como referência para calcular a margem em cada plano comercial e detectar taxas vendidas abaixo do custo.
        </AlertDescription>
      </Alert>

      {/* Calculadora de custo médio por transação (custo fixo rateado) */}
      <CostPerTransactionCalculator editing={editing} />

      {/* Resumo de margens */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 mb-1">Custo médio MDR Crédito</p>
            <p className="text-2xl font-bold text-slate-900">2.18%</p>
            <Badge className="bg-emerald-100 text-emerald-700 mt-2">Margem média 1.81%</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 mb-1">Custo médio PIX</p>
            <p className="text-2xl font-bold text-slate-900">0.32%</p>
            <Badge className="bg-emerald-100 text-emerald-700 mt-2">Margem média 0.67%</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 mb-1">Custo médio Antifraude</p>
            <p className="text-2xl font-bold text-slate-900">R$ 0.45</p>
            <Badge className="bg-emerald-100 text-emerald-700 mt-2">Margem R$ 0.25</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 mb-1">Custo médio 3DS</p>
            <p className="text-2xl font-bold text-slate-900">R$ 0.18</p>
            <Badge className="bg-emerald-100 text-emerald-700 mt-2">Margem R$ 0.12</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Tabs por categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Estrutura de Custos Globais</CardTitle>
          <CardDescription>Edite cada categoria de custo para refletir a realidade operacional da PagSmile.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="mdr">
            <TabsList className="flex flex-wrap h-auto">
              <TabsTrigger value="mdr"><CreditCard className="w-3.5 h-3.5 mr-1" />MDR Cartão</TabsTrigger>
              <TabsTrigger value="anticipation"><TrendingUp className="w-3.5 h-3.5 mr-1" />Antecipação</TabsTrigger>
              <TabsTrigger value="threeds"><Lock className="w-3.5 h-3.5 mr-1" />3DS</TabsTrigger>
              <TabsTrigger value="antifraud"><ShieldAlert className="w-3.5 h-3.5 mr-1" />Antifraude</TabsTrigger>
              <TabsTrigger value="fii"><Receipt className="w-3.5 h-3.5 mr-1" />FII / Gateway</TabsTrigger>
              <TabsTrigger value="precb"><AlertTriangle className="w-3.5 h-3.5 mr-1" />Pré-CB / CB</TabsTrigger>
              <TabsTrigger value="pix"><QrCode className="w-3.5 h-3.5 mr-1" />PIX</TabsTrigger>
              <TabsTrigger value="boleto"><Banknote className="w-3.5 h-3.5 mr-1" />Boleto</TabsTrigger>
              <TabsTrigger value="infra"><Calculator className="w-3.5 h-3.5 mr-1" />Infra & Operação</TabsTrigger>
            </TabsList>

            {/* MDR consolidado */}
            <TabsContent value="mdr" className="mt-4 space-y-3">
              <p className="text-xs text-slate-500">Custo médio ponderado de MDR (entre todos os adquirentes).</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bandeira</TableHead>
                    <TableHead>1x</TableHead>
                    <TableHead>2-6x</TableHead>
                    <TableHead>7-12x</TableHead>
                    <TableHead>13-21x</TableHead>
                    <TableHead>Débito</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brands.map((brand, idx) => (
                    <TableRow key={brand}>
                      <TableCell className="font-medium">{brand}</TableCell>
                      {['vista', '2_6', '7_12', '13_21', 'debit'].map((col, ci) => (
                        <TableCell key={col}>
                          <CostCell editing={editing} value={(2.05 + idx * 0.1 + ci * 0.15).toFixed(2) + '%'} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="anticipation" className="mt-4 space-y-4">
              <p className="text-xs text-slate-500">Custo de antecipação consolidado (média ponderada entre adquirentes).</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <CostField editing={editing} label="Antecipação D+1 (a.m.)" defaultValue="1.59%" />
                <CostField editing={editing} label="Antecipação D+2 a D+14 (a.m.)" defaultValue="1.39%" />
                <CostField editing={editing} label="Antecipação D+15 a D+30 (a.m.)" defaultValue="1.09%" />
                <CostField editing={editing} label="Custo de capital (a.m.)" defaultValue="0.85%" />
              </div>
            </TabsContent>

            <TabsContent value="threeds" className="mt-4 space-y-4">
              <p className="text-xs text-slate-500">Custos diretos das bandeiras + provedor 3DS (CardinalCommerce, Adyen 3DS).</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <CostField editing={editing} label="3DS Visa - Autenticada (R$)" defaultValue="0.18" />
                <CostField editing={editing} label="3DS Mastercard - Autenticada (R$)" defaultValue="0.20" />
                <CostField editing={editing} label="3DS Frictionless (R$)" defaultValue="0.10" />
                <CostField editing={editing} label="3DS Challenge (R$)" defaultValue="0.30" />
                <CostField editing={editing} label="3DS Tentativa falha (R$)" defaultValue="0.05" />
              </div>
            </TabsContent>

            <TabsContent value="antifraud" className="mt-4 space-y-4">
              <p className="text-xs text-slate-500">Custos do provedor de antifraude (Konduto, ClearSale, próprio).</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <CostField editing={editing} label="Antifraude Cartão (R$)" defaultValue="0.45" />
                <CostField editing={editing} label="Antifraude PIX (R$)" defaultValue="0.05" />
                <CostField editing={editing} label="Análise manual (R$)" defaultValue="2.50" />
                <CostField editing={editing} label="Score de risco extra (R$)" defaultValue="0.02" />
              </div>
            </TabsContent>

            <TabsContent value="fii" className="mt-4 space-y-4">
              <p className="text-xs text-slate-500">FII (Fee de Intercâmbio Inteligente) e custos de processamento por transação.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <CostField editing={editing} label="FII por Transação Aprovada (R$)" defaultValue="0.10" />
                <CostField editing={editing} label="FII Recusada (R$)" defaultValue="0.02" />
                <CostField editing={editing} label="Gateway interno (R$)" defaultValue="0.05" />
                <CostField editing={editing} label="Custo de captura tardia (R$)" defaultValue="0.03" />
                <CostField editing={editing} label="Custo de estorno (R$)" defaultValue="0.05" />
              </div>
            </TabsContent>

            <TabsContent value="precb" className="mt-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 p-4 border rounded-lg bg-blue-50/40">
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <div className="w-6 h-4 bg-blue-600 rounded text-white text-[10px] font-bold flex items-center justify-center">VISA</div>
                    Verifi (Visa) - CDRN / RDR
                  </h4>
                  <CostField editing={editing} label="Verifi CDRN - Alerta (R$)" defaultValue="11.00" />
                  <CostField editing={editing} label="Verifi RDR - Resolução automática (R$)" defaultValue="5.00" />
                  <CostField editing={editing} label="Setup mensal Verifi (R$)" defaultValue="500.00" />
                </div>
                <div className="space-y-3 p-4 border rounded-lg bg-red-50/40">
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <div className="w-6 h-4 bg-red-600 rounded text-white text-[10px] font-bold flex items-center justify-center">MC</div>
                    Ethoca (Mastercard)
                  </h4>
                  <CostField editing={editing} label="Ethoca Alert (R$)" defaultValue="10.00" />
                  <CostField editing={editing} label="Ethoca Consumer Clarity (R$)" defaultValue="3.50" />
                  <CostField editing={editing} label="Setup mensal Ethoca (R$)" defaultValue="450.00" />
                </div>
              </div>
              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold mb-3">Chargeback & Representment</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <CostField editing={editing} label="Chargeback recebido (R$)" defaultValue="50.00" />
                  <CostField editing={editing} label="Representment - perdido (R$)" defaultValue="25.00" />
                  <CostField editing={editing} label="Multa por excesso CB ratio (R$)" defaultValue="5000.00" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pix" className="mt-4 space-y-4">
              <p className="text-xs text-slate-500">Custo PIX consolidado (PSP + Banco Central + custos internos).</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <CostField editing={editing} label="PIX in - Percentual (%)" defaultValue="0.30%" />
                <CostField editing={editing} label="PIX in - Fixo (R$)" defaultValue="0.00" />
                <CostField editing={editing} label="PIX out / Devolução (R$)" defaultValue="0.05" />
                <CostField editing={editing} label="DICT - Consulta de chave (R$)" defaultValue="0.005" />
                <CostField editing={editing} label="MED - Custo operacional (R$)" defaultValue="2.00" />
              </div>
            </TabsContent>

            <TabsContent value="boleto" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <CostField editing={editing} label="Boleto - Emissão (R$)" defaultValue="1.50" />
                <CostField editing={editing} label="Boleto - Liquidação (R$)" defaultValue="0.80" />
                <CostField editing={editing} label="Boleto - Vencido (R$)" defaultValue="0.00" />
                <CostField editing={editing} label="Registro CIP (R$)" defaultValue="0.20" />
              </div>
            </TabsContent>

            <TabsContent value="infra" className="mt-4 space-y-4">
              <p className="text-xs text-slate-500">Custos operacionais e de infraestrutura rateados por transação.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <CostField editing={editing} label="Infra (cloud/processamento) por tx (R$)" defaultValue="0.008" />
                <CostField editing={editing} label="Suporte rateado por tx (R$)" defaultValue="0.012" />
                <CostField editing={editing} label="Compliance/KYC rateado (R$)" defaultValue="0.005" />
                <CostField editing={editing} label="Webhooks/SMS/Email (R$)" defaultValue="0.003" />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function CostField({ editing, label, defaultValue }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      {editing ? (
        <Input className="h-9" defaultValue={defaultValue} />
      ) : (
        <div className="h-9 flex items-center px-3 bg-slate-50 rounded-md border border-slate-200 font-mono text-sm">
          {defaultValue}
        </div>
      )}
    </div>
  );
}

function CostCell({ editing, value }) {
  return editing ? (
    <Input className="w-20 h-8" defaultValue={value} />
  ) : (
    <span className="font-mono text-sm">{value}</span>
  );
}