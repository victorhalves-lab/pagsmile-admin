import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import MyKpiCard from '@/components/my-compliance/MyKpiCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PiggyBank, Calendar, Sparkles, FileText, TrendingUp, Download } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { myReserveKpis, myReserveTimeline, myReserveScheduledReleases, myReserveHistory, formatCurrency } from '@/components/my-ops/mocks/myOpsMock';

export default function MyRollingReserve() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <PageHeader
        title="Rolling Reserve — Sua reserva de risco transparente"
        subtitle="Visibilidade total · Liberações agendadas · Histórico completo"
        icon={PiggyBank}
        breadcrumbs={[{ label: 'Financeiro', page: '#' }, { label: 'Reserva' }]}
        actions={<Button variant="outline" className="gap-2"><Download className="w-4 h-4" /> Exportar</Button>}
      />

      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
        <CardContent className="p-5 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-emerald-600 mt-0.5" />
          <div>
            <h3 className="font-bold text-slate-900">
              Sua próxima liberação é em <span className="text-emerald-700">{new Date(myReserveKpis.next_release_date).toLocaleDateString('pt-BR')}</span>
            </h3>
            <p className="text-sm text-slate-700 mt-1">
              Você receberá <strong>{formatCurrency(myReserveKpis.next_release_amount)}</strong> referente a transações realizadas há {myReserveKpis.retention_period_days} dias. Retenção contratual: <strong>{myReserveKpis.current_retention}%</strong> · Base: {myReserveKpis.contractual_basis}.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MyKpiCard label="RETENÇÃO" value={`${myReserveKpis.current_retention}%`} sub="atual" accent="blue" />
        <MyKpiCard label="SALDO RETIDO" value={formatCurrency(myReserveKpis.retained_total).slice(0, 12)} sub="total" accent="amber" />
        <MyKpiCard label="LIBERADO 30D" value={formatCurrency(myReserveKpis.released_30d).slice(0, 12)} sub="últimos 30d" accent="emerald" />
        <MyKpiCard label="A LIBERAR" value={formatCurrency(myReserveKpis.pending_release).slice(0, 12)} sub="próximos 30d" accent="emerald" />
        <MyKpiCard label="PRÓX. LIBERAÇÃO" value={new Date(myReserveKpis.next_release_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} sub={formatCurrency(myReserveKpis.next_release_amount).slice(0, 11)} icon={Calendar} accent="emerald" />
        <MyKpiCard label="PERÍODO" value={`${myReserveKpis.retention_period_days}d`} sub="retenção" accent="blue" />
      </div>

      <Tabs defaultValue="timeline">
        <TabsList>
          <TabsTrigger value="timeline">Movimento Recente</TabsTrigger>
          <TabsTrigger value="scheduled">Liberações Agendadas ({myReserveScheduledReleases.length})</TabsTrigger>
          <TabsTrigger value="history">Histórico Mensal</TabsTrigger>
          <TabsTrigger value="how">Como Funciona</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Saldo Retido — últimos 30 dias</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={myReserveTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Legend />
                  <Line type="monotone" dataKey="balance" stroke="#2bc196" strokeWidth={3} name="Saldo Retido" dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="mt-6 space-y-3">
          {myReserveScheduledReleases.map((rel) => (
            <Card key={rel.id} className="border-l-4 border-l-emerald-500">
              <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <div className="font-bold text-base">
                      {new Date(rel.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="text-xs text-slate-500">{rel.transactions_count} transações · D+{myReserveKpis.retention_period_days}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-600 text-lg">{formatCurrency(rel.amount)}</div>
                  <Badge className="bg-emerald-100 text-emerald-700 mt-1">Agendada</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-sm text-slate-700 flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <strong className="text-slate-900">Total a liberar nos próximos 30 dias:</strong> {formatCurrency(myReserveScheduledReleases.reduce((s, r) => s + r.amount, 0))}
                <br />
                <span className="text-xs">Liberações ocorrem automaticamente — não é necessário solicitar.</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Histórico Mensal — Retido vs Liberado</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={myReserveHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Legend />
                  <Bar dataKey="retained" fill="#f59e0b" name="Retido" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="released" fill="#2bc196" name="Liberado" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="how" className="mt-6">
          <Card>
            <CardContent className="p-6 space-y-3 text-sm text-slate-700">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4" /> O que é Rolling Reserve?
              </h3>
              <p>
                É uma reserva de segurança aplicada sobre cada transação aprovada para cobrir riscos de chargebacks e disputas futuras. Funciona como um "fundo de garantia" rotativo.
              </p>
              <div className="bg-emerald-50 border border-emerald-200 rounded p-4">
                <strong className="text-emerald-900 block mb-2">📊 Como funciona na sua conta:</strong>
                <ol className="space-y-1 ml-5 list-decimal text-xs">
                  <li>A cada transação aprovada, retemos <strong>{myReserveKpis.current_retention}%</strong> do valor.</li>
                  <li>Esse valor fica retido por <strong>{myReserveKpis.retention_period_days} dias</strong> (período de janela de chargeback).</li>
                  <li>Após o período, o valor é <strong>liberado automaticamente</strong> ao seu saldo.</li>
                  <li>Se houver chargeback, o valor é <strong>debitado da reserva</strong> primeiro.</li>
                </ol>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded p-3">
                <strong className="text-amber-900">📜 Base contratual:</strong> {myReserveKpis.contractual_basis}. Para revisar o percentual, fale com seu gerente comercial.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}