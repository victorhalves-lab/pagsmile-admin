import React, { useMemo, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Receipt, HelpCircle, Calendar, AlertTriangle, Lock, CheckCircle, Sparkles, MessageCircle } from 'lucide-react';
import { createPageUrl } from '@/components/utils';
import { MOCK_URS, MOCK_EFFECTS, UR_STATUS, PAYMENT_ARRANGEMENTS, EFFECT_TYPES, formatCurrency, formatCurrencyShort } from '@/components/regulatory/mocks/urMock';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

export default function MyReceivablesUnits() {
  // Mock — lojista logado mer_001
  const myUrs = useMemo(() => MOCK_URS.filter((u) => u.merchant.id === 'mer_001').slice(0, 30), []);
  const myEffects = useMemo(() => MOCK_EFFECTS.filter((e) => e.ur?.merchant?.id === 'mer_001'), []);

  const totalAvailable = myUrs.reduce((s, u) => s + u.available_value, 0);
  const totalCommitted = myUrs.reduce((s, u) => s + u.committed_value, 0);
  const totalGross = myUrs.reduce((s, u) => s + u.net_value, 0);
  const judicialBlocked = myEffects.filter((e) => e.type === 'judicial_lien').reduce((s, e) => s + e.value_affected, 0);
  const cededValue = myEffects.filter((e) => e.type.includes('assignment')).reduce((s, e) => s + e.value_affected, 0);
  const anticipatedValue = myEffects.filter((e) => e.type === 'registered_anticipation').reduce((s, e) => s + e.value_affected, 0);

  // Pipeline 14 days
  const pipelineData = useMemo(() => {
    const days = {};
    myUrs.forEach((u) => {
      const d = new Date(u.expected_date).toISOString().split('T')[0];
      if (!days[d]) days[d] = { date: d, available: 0, committed: 0 };
      days[d].available += u.available_value;
      days[d].committed += u.committed_value;
    });
    return Object.values(days).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 14).map((d) => ({
      ...d,
      date: new Date(d.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    }));
  }, [myUrs]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Minhas Unidades de Recebíveis"
        subtitle="Visão regulatória dos seus recebíveis registrados nas registradoras (CERC/CIP/B3/TAG)"
        icon={Receipt}
        breadcrumbs={[
          { label: 'Financeiro', page: 'FinancialOverview' },
          { label: 'Minhas URs' },
        ]}
        actions={
          <Button variant="outline" size="sm" onClick={() => toast.info('FAQ aberto')}>
            <HelpCircle className="w-4 h-4 mr-1" /> O que é uma UR?
          </Button>
        }
      />

      {/* Banner explicativo */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardContent className="p-3 flex items-start gap-2 text-xs">
          <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
          <div className="text-blue-900">
            <strong>O que é uma UR?</strong> Cada venda no cartão gera uma "Unidade de Recebível" registrada oficialmente
            por exigência do Banco Central (Resolução CMN 4.734/2019). Aqui você vê seus direitos a receber e
            quais compromissos (cessões, antecipações, bloqueios) já estão aplicados sobre eles.
          </div>
        </CardContent>
      </Card>

      {/* KPIs principais */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-1 text-emerald-600 mb-1">
              <CheckCircle className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase">Disponível para você</span>
            </div>
            <p className="text-xl font-black text-emerald-700">{formatCurrencyShort(totalAvailable)}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Livre de compromissos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-[10px] font-bold uppercase text-slate-500">Total bruto</p>
            <p className="text-xl font-black">{formatCurrencyShort(totalGross)}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{myUrs.length} URs</p>
          </CardContent>
        </Card>
        <Card className={cededValue > 0 ? 'bg-violet-50 border-violet-200' : ''}>
          <CardContent className="p-3">
            <p className="text-[10px] font-bold uppercase text-slate-500">Cedido a terceiros</p>
            <p className="text-xl font-black text-violet-700">{formatCurrencyShort(cededValue)}</p>
          </CardContent>
        </Card>
        <Card className={anticipatedValue > 0 ? 'bg-cyan-50 border-cyan-200' : ''}>
          <CardContent className="p-3">
            <p className="text-[10px] font-bold uppercase text-slate-500">Antecipado</p>
            <p className="text-xl font-black text-cyan-700">{formatCurrencyShort(anticipatedValue)}</p>
          </CardContent>
        </Card>
        <Card className={judicialBlocked > 0 ? 'bg-red-50 border-red-200' : ''}>
          <CardContent className="p-3">
            <p className="text-[10px] font-bold uppercase text-slate-500">Bloqueio judicial</p>
            <p className="text-xl font-black text-red-700">{formatCurrencyShort(judicialBlocked)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerta proativo se houver bloqueio judicial */}
      {judicialBlocked > 0 && (
        <Card className="border-red-200 bg-red-50/40">
          <CardContent className="p-3 flex items-start gap-2 text-xs">
            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-red-900">Você tem URs com bloqueio judicial — entenda o que isso significa</p>
              <p className="text-red-800 mt-1">
                Algumas das suas URs estão com bloqueio determinado por decisão judicial.
                Quando elas liquidarem, os recursos vão para o credor judicial até o limite determinado.
              </p>
            </div>
            <Link to={createPageUrl('MyContractEffects')}>
              <Button size="sm" variant="outline">Ver detalhes</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="pipeline">
        <TabsList>
          <TabsTrigger value="pipeline" className="text-xs"><Calendar className="w-3 h-3 mr-1" />Cronograma</TabsTrigger>
          <TabsTrigger value="list" className="text-xs">Lista de URs</TabsTrigger>
          <TabsTrigger value="simulator" className="text-xs"><Sparkles className="w-3 h-3 mr-1" />Quanto vou receber?</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Próximas liquidações (14 dias)</CardTitle>
              <p className="text-[10px] text-slate-500">Verde = vai cair na sua conta · Amarelo = comprometido com terceiros</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={pipelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Area type="monotone" dataKey="available" name="Disponível p/ você" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                  <Area type="monotone" dataKey="committed" name="Comprometido" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.5} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-2">UR</th>
                    <th className="text-left p-2">Vencimento</th>
                    <th className="text-left p-2">Bandeira/Adquirente</th>
                    <th className="text-left p-2">Arranjo</th>
                    <th className="text-right p-2">Bruto</th>
                    <th className="text-right p-2">Você recebe</th>
                    <th className="text-center p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myUrs.slice(0, 15).map((u) => {
                    const status = UR_STATUS[u.status];
                    const arr = PAYMENT_ARRANGEMENTS[u.arrangement];
                    return (
                      <tr key={u.id} className="border-b hover:bg-slate-50">
                        <td className="p-2 font-mono text-[10px]">{u.id}</td>
                        <td className="p-2 text-[11px]">{new Date(u.expected_date).toLocaleDateString('pt-BR')}</td>
                        <td className="p-2 capitalize text-[11px]">{u.brand} · {u.acquirer}</td>
                        <td className="p-2"><Badge className={`${arr?.color} text-[9px]`}>{arr?.label}</Badge>{u.total_installments > 1 && <span className="ml-1 text-[9px]">{u.installment}/{u.total_installments}</span>}</td>
                        <td className="p-2 text-right">{formatCurrency(u.gross_value)}</td>
                        <td className="p-2 text-right font-bold text-emerald-700">{formatCurrency(u.available_value)}</td>
                        <td className="p-2 text-center"><Badge className={`${status?.color} border text-[9px]`}>{status?.label}</Badge></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulator" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Simulação: distribuição na liquidação</CardTitle>
              <p className="text-[10px] text-slate-500">Para cada UR, mostramos o que vai pra você vs comprometimentos</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {myUrs.slice(0, 6).map((u) => {
                const effects = myEffects.filter((e) => e.ur_id === u.id);
                return (
                  <div key={u.id} className="p-3 border rounded-lg space-y-1.5">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-mono text-xs font-bold">{u.id}</p>
                        <p className="text-[10px] text-slate-500">Venc: {new Date(u.expected_date).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <p className="text-sm font-bold">{formatCurrency(u.net_value)}</p>
                    </div>
                    <div className="space-y-0.5 text-[10px]">
                      {effects.map((e) => (
                        <div key={e.id} className="flex justify-between text-amber-700">
                          <span>→ {EFFECT_TYPES[e.type]?.label} ({e.counterparty?.name?.slice(0, 25)})</span>
                          <span>−{formatCurrency(e.value_affected)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-bold text-emerald-700 border-t pt-1">
                        <span>= Para você</span>
                        <span>{formatCurrency(u.available_value)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-3 flex items-center gap-2 text-xs text-blue-900">
          <MessageCircle className="w-4 h-4 shrink-0" />
          <span className="flex-1">Tem dúvidas sobre suas URs? Nosso time de Customer Success está aqui para ajudar.</span>
          <Button size="sm" variant="outline">Falar com suporte</Button>
        </CardContent>
      </Card>
    </div>
  );
}