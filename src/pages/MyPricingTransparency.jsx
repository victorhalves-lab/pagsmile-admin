import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import MyKpiCard from '@/components/my-compliance/MyKpiCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Receipt, TrendingDown, Calculator, Sparkles, AlertTriangle, BookOpen, FileText } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, BarChart, Bar } from 'recharts';
import {
  myPricingKpis,
  myMdrMatrix,
  myFeeDecomposition,
  myPricingHistory,
  myInstallmentSimulation,
  formatCurrency,
  formatPct
} from '@/components/my-value/mocks/myValueMock';

export default function MyPricingTransparency() {
  const [simAmount, setSimAmount] = useState(1000);
  const [simInstallments, setSimInstallments] = useState(3);

  const simulation = myInstallmentSimulation.find((s) => s.installments === simInstallments) || myInstallmentSimulation[1];
  const projectedFee = (simAmount * simulation.mdr_pct) / 100;
  const projectedRav = (simAmount * simulation.rav_pct) / 100;
  const projectedNet = simAmount - projectedFee - projectedRav;

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <PageHeader
        title="Transparência de Taxas — Você sabe exatamente o que paga"
        subtitle="MDR · RAV · Spread · Decomposição completa de custos"
        icon={Receipt}
        breadcrumbs={[{ label: 'Financeiro', page: '#' }, { label: 'Taxas' }]}
        actions={
          <>
            <Button variant="outline" className="gap-2"><BookOpen className="w-4 h-4" /> Glossário</Button>
            <Button variant="outline" className="gap-2"><FileText className="w-4 h-4" /> Contrato</Button>
          </>
        }
      />

      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
        <CardContent className="p-5 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-slate-900">Você está pagando <span className="text-emerald-700">{formatPct(Math.abs(myPricingKpis.spread_vs_market))}</span> abaixo da média de mercado</h3>
            <p className="text-sm text-slate-700 mt-1">
              MDR efetivo médio nos últimos 30 dias: <strong>{formatPct(myPricingKpis.effective_mdr_30d)}</strong> · MDR contratado: <strong>{formatPct(myPricingKpis.contracted_mdr_avg)}</strong> · Mercado: ~3,06%
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <MyKpiCard label="MDR CONTRATADO" value={formatPct(myPricingKpis.contracted_mdr_avg)} sub="média" accent="blue" />
        <MyKpiCard label="MDR EFETIVO 30D" value={formatPct(myPricingKpis.effective_mdr_30d)} sub="aplicado" icon={Receipt} accent="emerald" />
        <MyKpiCard label="TAXAS PAGAS" value={formatCurrency(myPricingKpis.total_fees_30d).slice(0, 14)} sub="últimos 30d" accent="slate" />
        <MyKpiCard label="VS MERCADO" value={formatPct(myPricingKpis.spread_vs_market)} sub="abaixo da média" icon={TrendingDown} accent="emerald" />
        <MyKpiCard label="ALERTAS DRIFT" value={myPricingKpis.drift_alerts} sub="ativos" icon={AlertTriangle} accent="amber" warn />
        <MyKpiCard label="A RECUPERAR" value={formatCurrency(myPricingKpis.recovery_potential).slice(0, 12)} sub="potencial" accent="emerald" />
        <MyKpiCard label="PRÓX. REVISÃO" value="15/08" sub="2026" accent="slate" />
      </div>

      <Tabs defaultValue="matrix">
        <TabsList>
          <TabsTrigger value="matrix">Tabela de MDRs</TabsTrigger>
          <TabsTrigger value="decomposition">Decomposição</TabsTrigger>
          <TabsTrigger value="evolution">Evolução Histórica</TabsTrigger>
          <TabsTrigger value="simulator">Simulador</TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tabela Completa de MDRs Contratados</CardTitle>
              <p className="text-xs text-slate-500">Valores em % aplicados sobre o valor bruto da transação</p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Método</TableHead>
                    <TableHead className="text-right">Visa</TableHead>
                    <TableHead className="text-right">Mastercard</TableHead>
                    <TableHead className="text-right">Elo</TableHead>
                    <TableHead className="text-right">Amex</TableHead>
                    <TableHead className="text-right">Hipercard</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myMdrMatrix.map((row) => (
                    <TableRow key={row.method}>
                      <TableCell className="font-semibold">{row.method}</TableCell>
                      <TableCell className="text-right font-mono">{row.fixed ? `${formatPct(row.fixed)} (fixo)` : row.visa ? formatPct(row.visa) : '—'}</TableCell>
                      <TableCell className="text-right font-mono">{row.mastercard ? formatPct(row.mastercard) : '—'}</TableCell>
                      <TableCell className="text-right font-mono">{row.elo ? formatPct(row.elo) : '—'}</TableCell>
                      <TableCell className="text-right font-mono">{row.amex ? formatPct(row.amex) : '—'}</TableCell>
                      <TableCell className="text-right font-mono">{row.hipercard ? formatPct(row.hipercard) : '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decomposition" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Para onde vai cada R$ 1 de MDR pago?</CardTitle>
              <p className="text-xs text-slate-500">Baseado em MDR médio de 2,85% — exemplo Crédito 2-6x Visa/Master</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={myFeeDecomposition} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="component" width={170} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Bar dataKey="share" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {myFeeDecomposition.map((fee) => (
                  <div key={fee.component} className="flex items-start justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-900">{fee.component}</div>
                      <div className="text-xs text-slate-500">{fee.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatPct(fee.value)}</div>
                      <div className="text-xs text-slate-500">{fee.share}% do total</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolution" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Evolução de MDR — 6 meses</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={myPricingHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => `${v}%`} domain={[2.5, 3.5]} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Legend />
                  <Line type="monotone" dataKey="contracted" stroke="#3b82f6" strokeWidth={2} name="Contratado" />
                  <Line type="monotone" dataKey="effective" stroke="#10b981" strokeWidth={2} name="Efetivo" />
                  <Line type="monotone" dataKey="market_avg" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name="Média Mercado" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulator" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calculator className="w-4 h-4" /> Simulador de Recebimento
              </CardTitle>
              <p className="text-xs text-slate-500">Simule quanto você receberá em diferentes cenários</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Valor da venda (R$)</Label>
                  <Input type="number" value={simAmount} onChange={(e) => setSimAmount(Number(e.target.value))} />
                </div>
                <div>
                  <Label>Parcelas</Label>
                  <select className="w-full h-10 px-3 border rounded-md" value={simInstallments} onChange={(e) => setSimInstallments(Number(e.target.value))}>
                    <option value="1">À vista (1x)</option>
                    <option value="3">3x</option>
                    <option value="6">6x</option>
                    <option value="12">12x</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                <Card className="bg-slate-50">
                  <CardContent className="p-4 text-center">
                    <div className="text-xs text-slate-500">Valor Bruto</div>
                    <div className="text-xl font-bold mt-1">{formatCurrency(simAmount)}</div>
                  </CardContent>
                </Card>
                <Card className="bg-red-50">
                  <CardContent className="p-4 text-center">
                    <div className="text-xs text-slate-500">MDR ({formatPct(simulation.mdr_pct)})</div>
                    <div className="text-xl font-bold text-red-600 mt-1">- {formatCurrency(projectedFee)}</div>
                  </CardContent>
                </Card>
                <Card className="bg-amber-50">
                  <CardContent className="p-4 text-center">
                    <div className="text-xs text-slate-500">RAV ({formatPct(simulation.rav_pct)})</div>
                    <div className="text-xl font-bold text-amber-600 mt-1">- {formatCurrency(projectedRav)}</div>
                  </CardContent>
                </Card>
                <Card className="bg-emerald-50 border-emerald-200">
                  <CardContent className="p-4 text-center">
                    <div className="text-xs text-slate-500">VOCÊ RECEBE</div>
                    <div className="text-xl font-black text-emerald-600 mt-1">{formatCurrency(projectedNet)}</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}